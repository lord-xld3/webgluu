import { _gl } from "./Context";

/**
 * A VertexArrayObject (VAO) encapsulates the state needed to render a mesh.
 */
export class VertexArrayObject {
    private readonly vao: WebGLVertexArrayObject;
    
    /**
     * Creates a new VertexArrayObject and binds it.
     * 
     * @throws {Error} Throws an error if the WebGL context fails to create a vertex array object.
     */
    constructor(){
        this.vao = _gl.createVertexArray()!;
        if (!this.vao) {
            throw new Error(`Failed to create VertexArrayObject using context: ${_gl}`);
        }

        this.bind();
    }

    /**
     * Binds the VertexArrayObject.
     */
    public bind(): void {
        _gl.bindVertexArray(this.vao);
    }

    /**
     * Unbinds the VertexArrayObject.
     */
    public unbind(): void {
        _gl.bindVertexArray(null);
    }
}