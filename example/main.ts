import * as Gluu from "../index";

// We can use an OffscreenCanvas since we're not rendering to the screen.
const gl = Gluu.init(new OffscreenCanvas(0, 0));

// Create a shader program with transform feedback varyings.
const program = Gluu.createTransformFeedbackProgram(
    `#version 300 es
    in float a;
    in float b;
    out float sum;
    out float difference;
    out float product;

    void main() {
        sum = a + b;
        difference = a - b;
        product = a * b;
    }`,
    ['sum', 'difference', 'product'],
    false,
);

// Clean up compiled shaders and cache.
Gluu.cleanShaders();

// Sets the currently referenced program for buffer objects.
// This does NOT call gl.useProgram().
Gluu.setProgram(program);

// Input buffer for float a;
const aBuffer = Gluu.createVertexBuffer(
    new Float32Array([1, 2, 3, 4]),
    [
        { attribute: 'a', size: 1 },
    ]
);
aBuffer.enableAllAttributes();

// Input buffer for float b;
const bBuffer = Gluu.createVertexBuffer(
    new Float32Array([5, 6, 7, 8]),
    [
        { attribute: 'b', size: 1 },
    ]
);
bBuffer.enableAllAttributes();

// Output buffers for sum, difference, and product.
const sumBuffer = Gluu.createFeedbackBuffer(new Float32Array(4));
const differenceBuffer = Gluu.createFeedbackBuffer(new Float32Array(4));
const productBuffer = Gluu.createFeedbackBuffer(new Float32Array(4));

// Create a TransformFeedback object.
const tf = Gluu.createTransformFeedback();

// Bind the output buffers to the TransformFeedback target.
Gluu.bindFeedbackOutputBuffers([
    [sumBuffer, 0, 16],
    [differenceBuffer, 0, 16],
    [productBuffer, 0, 16],
]);

// gl.bindBuffer(gl.ARRAY_BUFFER, null); 
// Not necessary with FeedbackBufferObjects. 
// No output buffer is bound to ARRAY_BUFFER.

// Pre-render setup
gl.clearColor(0, 0, 0, 1);

// Disable rasterization, as we're not rendering to the screen.
gl.enable(gl.RASTERIZER_DISCARD);

render();

function render() {
    // Use TFBO program.
    gl.useProgram(program);

    tf.bind();
    tf.begin(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, 4);
    tf.end();
    tf.unbind();

    logResults(sumBuffer, 'sum');
    logResults(differenceBuffer, 'difference');
    logResults(productBuffer, 'product');
}

function logResults<T extends Gluu.BufferObject>(
    buffer: Gluu.BufferObjectLike<T>, 
    label: string
): void {
    const data = new Float32Array(4); // This should be equal to the length of the buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buf);
    gl.getBufferSubData(gl.ARRAY_BUFFER, 0, data);
    console.log(`${label}: ${data}`);
}