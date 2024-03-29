import * as Gluu from '../index.js';
const gl = Gluu.createContext(document.getElementById('webgl-canvas'));
Gluu.useContext(gl);

const programs = Gluu.createShaderPrograms([
    `
        attribute vec4 a_position;
        void main() {
        gl_Position = a_position;
        }
    `
    ,`
        void main() {
        gl_FragColor = vec4(1, 0, 0, 1);
        }
    `
]);

const program = programs[0];

const vao = new Gluu.VertexArrayObject(
    new Gluu.VertexBufferObject(
        program,
        new Float32Array([
            -0.5, -0.5,
            0.5, -0.5,
            0.0, 0.5
        ]), 
        [{
            attribute: 'a_position',
            size: 2,
        }]
    )
);

gl.clearColor(1, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
vao.bind();
gl.drawArrays(gl.TRIANGLES, 0, 3);