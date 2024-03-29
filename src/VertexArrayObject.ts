import { gl } from "./Context";
import { VertexBufferObject, ElementBufferObject } from "./BufferObject";

/**
 * A Vertex Array Object (VAO) encapsulates a vertex buffer object (VBO) and an optional element buffer object (EBO).
 */
export class VertexArrayObject {
    private readonly vao: WebGLVertexArrayObject;
    
    /**
     * Creates a new VertexArrayObject.
     * @param draw - The draw function.
     * @param vbo - The VertexBufferObject to encapsulate.
     * @param ebo - The ElementBufferObject to encapsulate (optional).
     */
    constructor(
        vbo: VertexBufferObject,
        ebo?: ElementBufferObject,
    ) {
        this.vao = gl.createVertexArray() as WebGLVertexArrayObject;
       
        this.bind();
        vbo.bind();
        ebo?.bind();
        
        this.unbind();
        ebo?.unbind();
    }

    /**
     * Binds the VertexArrayObject.
     */
    public bind(): void {
        gl.bindVertexArray(this.vao);
        gl.enableVertexAttribArray(0);
    }

    /**
     * Unbinds the VertexArrayObject.
     */
    public unbind(): void {
        gl.bindVertexArray(null);
    }
}