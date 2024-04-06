import * as Gluu from "../index";
const gl = Gluu.init(document.getElementById('canvas') as HTMLCanvasElement);

const program = Gluu.createProgram(
    [
        `#version 300 es

        in vec2 a_position;
        in vec4 a_color;

        uniform uniformStruct {
            vec4 u_color;
        };

        out vec4 v_color;

        void main() {
            gl_Position = vec4(a_position, 0, 1);
            v_color = a_color + u_color;
        }`,

        `#version 300 es
        precision mediump float;

        in vec4 v_color;

        out vec4 color;

        void main() {
            color = v_color;
        }`
    ]
);

Gluu.cleanShaders();

// Sets the currently referenced program for buffer objects.
// This does NOT call gl.useProgram().
Gluu.setProgram(program);

// Vertex data (position, color)
const triangleMesh = new Float32Array([
    -0.5, -0.5, 1.0, 0.0, 0.0, 1.0,
    0.5, -0.5, 0.0, 1.0, 0.0, 1.0,
    0.0, 0.5, 0.0, 0.0, 1.0, 1.0,
]);


// Create a vertex buffer object for the triangle
const mesh = new Gluu.VertexBufferObject(triangleMesh, [
    { attribute: 'a_position', size: 2, stride: 6 * 4, offset: 0 },
    { attribute: 'a_color', size: 4, stride: 6 * 4, offset: 2 * 4 },
]);

// Create an element buffer object for the indices
const ebo = new Gluu.ElementBufferObject(new Uint16Array([0, 1, 2]));

// Create a vertex array object to bind the buffers
const vao = new Gluu.VertexArrayObject([mesh], ebo);

// UBO testing
const ubo = new Gluu.UniformBufferObject("uniformStruct", new Float32Array([1.0, 0.0, 0.0, 1.0]));
ubo.bind();
ubo.setBuffer(new Float32Array([0.5, 0.5, 0.5, 0.5]));
ubo.setSubBuffer(new Float32Array([1.0, 0.0, 0.0, 1.0]));

// Pre-render setup
gl.clearColor(0, 0, 0, 1);
render();

function render() {
    
    // Resize before clearing the screen to avoid flickering
    gl.resize();
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Actually render stuff
    gl.useProgram(program);
    vao.bind();
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);
    
    // Loop
    requestAnimationFrame(render);
}