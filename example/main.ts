import * as Gluu from "../index";
const gl = Gluu.init(document.getElementById('canvas') as HTMLCanvasElement);

const program = Gluu.createTFBOProgram(
    [
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
        }
        `,

        `#version 300 es
        precision highp float;
        void main() {
        }`
    ], 
    ['sum', 'difference', 'product'],
    false,
);

Gluu.cleanShaders();

// Sets the currently referenced program for buffer objects.
// This does NOT call gl.useProgram().
Gluu.setProgram(program);

const aBuffer = new Gluu.VertexBufferObject(
    new Float32Array([1, 2, 3, 4]),
    [
        { attribute: 'a', size: 1 },
    ]
);

aBuffer.enableAllAttributes();

const bBuffer = new Gluu.VertexBufferObject(
    new Float32Array([5, 6, 7, 8]),
    [
        { attribute: 'b', size: 1 },
    ]
);

bBuffer.enableAllAttributes();

const tf = gl.createTransformFeedback()!;
gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);

const sumBuffer = gl.createBuffer()!;
gl.bindBuffer(gl.ARRAY_BUFFER, sumBuffer);
gl.bufferData(gl.ARRAY_BUFFER, 4 * 4, gl.STATIC_DRAW);

const differenceBuffer = gl.createBuffer()!;
gl.bindBuffer(gl.ARRAY_BUFFER, differenceBuffer);
gl.bufferData(gl.ARRAY_BUFFER, 4 * 4, gl.STATIC_DRAW);

const productBuffer = gl.createBuffer()!;
gl.bindBuffer(gl.ARRAY_BUFFER, productBuffer);
gl.bufferData(gl.ARRAY_BUFFER, 4 * 4, gl.STATIC_DRAW);

gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, sumBuffer);
gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, differenceBuffer);
gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 2, productBuffer);

gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

// Pre-render setup
gl.clearColor(0, 0, 0, 1);
gl.enable(gl.RASTERIZER_DISCARD);

render();

function render() {
    gl.useProgram(program);

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, 4);
    gl.endTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

    logResults(sumBuffer, 'sum');
    logResults(differenceBuffer, 'difference');
    logResults(productBuffer, 'product');
}

function logResults(buffer: WebGLBuffer, label: string) {
    const data = new Float32Array(4); // This should be equal to the length of the buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.getBufferSubData(gl.ARRAY_BUFFER, 0, data);
    console.log(`${label}: ${data}`);
}