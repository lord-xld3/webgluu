import * as Gluu from '../index'
const gl = Gluu.init(document.getElementById('canvas') as HTMLCanvasElement);

const program = Gluu.createShaderPrograms(
    [{
        vert: 
        `#version 300 es
        in vec2 a_position;
        out vec4 v_position;
        void main() {
            gl_Position = vec4(a_position, 0, 1);
            v_position = gl_Position;
        }`,
        frag: 
        `#version 300 es
        precision mediump float;
        in vec4 v_position;
        out vec4 color;
        void main() {
            color = vec4(1, 0, 0, 1);
        }`
    }]
)[0];

// Sets the currently referenced program for buffer objects.
// This does NOT call gl.useProgram().
Gluu.setProgram(program);

// Define vertices for a triangle
const vertices = new Float32Array([
    -0.5, -0.5,  // Vertex 1
    0.5, -0.5,   // Vertex 2
    0.0, 0.5     // Vertex 3
]);

// Create a buffer object for the vertices
const mesh = new Gluu.VertexBufferObject(vertices, [
    { attribute: 'a_position', size: 2 },
]);

// Create an element buffer object for the indices
const ebo = new Gluu.ElementBufferObject(new Uint16Array([0, 1, 2]));

// Create a vertex array object to bind the buffers
const vao = new Gluu.VertexArrayObject([mesh], ebo);


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