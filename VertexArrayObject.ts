import { gl } from "./Context";
import { VertexBufferObject, ElementBufferObject, BufferObject } from "./BufferObjects";

/**
 * A Vertex Array Object (VAO) encapsulates a vertex buffer object (VBO) and an optional element buffer object (EBO).
 */
export class VertexArrayObject {
    private readonly vao: WebGLVertexArrayObject;
    public draw: () => void;
    
    /**
     * Creates a new VertexArrayObject.
     * @param drawFunc - The draw function.
     * @param vbo - The VertexBufferObject to encapsulate.
     * @param ebo - The ElementBufferObject to encapsulate (optional).
     */
    constructor(
        drawFunc: () => void,
        vbo: VertexBufferObject,
        ebo?: ElementBufferObject,
    ) {
        this.draw = drawFunc;
        this.vao = gl.createVertexArray() as WebGLVertexArrayObject;
        this.bind();
        vbo.bind();
        ebo?.bind();
        
        // If this is not unbound, it may "leak" into other VAOs, since the EBO is optional.
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    /**
     * Binds the VertexArrayObject.
     */
    public bind(): void {
        gl.bindVertexArray(this.vao);
    }

    // /**
    //  * Unbinds the VertexArrayObject.
    //  */
    // public unbind(): void {
    //     gl.bindVertexArray(null);
    // }

    // /**
    //  * Sets the draw function.
    //  * @param drawFunc - The draw function.
    //  */
    // public setDrawFunc(drawFunc: () => void): void {
    //     this.draw = drawFunc;
    // }
}

