import * as Gluu from '../src/index';
const ctx = new Gluu.GluuContext(document.getElementById('canvas') as HTMLCanvasElement);
const gl = ctx.getGL();

const program = Gluu.createShaderPrograms(ctx, [
    {
        vert: 
        `#version 300 es
        in vec2 position;
        void main() {
            gl_Position = vec4(position, 0, 1);
        }`,
        frag: 
        `#version 300 es
        precision mediump float;
        out vec4 color;
        void main() {
            color = vec4(1, 0, 0, 1);
        }`
    }
])[0];

const mesh = new Gluu.VertexBufferObject(ctx, program, new Float32Array([
    -0.5, -0.5,
    0.5, -0.5,
    0.0, 0.5,
]), [
    { attribute: 'position', size: 2 },
]);

const vao = new Gluu.VertexArrayObject(ctx, mesh);

gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.useProgram(program);
vao.bind();
gl.drawArrays(gl.TRIANGLES, 0, 3);