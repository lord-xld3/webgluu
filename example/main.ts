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

const sumBuffer = new Gluu.BufferObject(gl.ARRAY_BUFFER, gl.STATIC_COPY);
sumBuffer.bind();
sumBuffer.setBuffer(new Float32Array(4));

const differenceBuffer = new Gluu.BufferObject(gl.ARRAY_BUFFER, gl.STATIC_COPY);
differenceBuffer.bind();
differenceBuffer.setBuffer(new Float32Array(4));

const productBuffer = new Gluu.BufferObject(gl.ARRAY_BUFFER, gl.STATIC_COPY);
productBuffer.bind();
productBuffer.setBuffer(new Float32Array(4));

const tfbo = new Gluu.TransformFeedbackBufferObject([
    [sumBuffer, 0, 16],
    [differenceBuffer, 0, 16],
    [productBuffer, 0, 16],
]);

gl.bindBuffer(gl.ARRAY_BUFFER, null);

// Pre-render setup
gl.clearColor(0, 0, 0, 1);
gl.enable(gl.RASTERIZER_DISCARD);

render();

function render() {
    gl.useProgram(program);

    tfbo.bind();
    tfbo.begin(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, 4);
    tfbo.end();

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