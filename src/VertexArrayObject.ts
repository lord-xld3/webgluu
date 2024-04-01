import { _gl } from "./Context";
import { VertexBufferObject, ElementBufferObject } from "./BufferObject";

/**
 * A VertexArrayObject (VAO) encapsulates multiple VertexBufferObjects (VBOs) and an optional ElementBufferObject (EBO).
 */
export class VertexArrayObject {
    private readonly vao: WebGLVertexArrayObject;
    
    /**
     * Creates a new VertexArrayObject.
     * @param vbos - The VertexBufferObjects to encapsulate.
     * @param ebo - The ElementBufferObject to encapsulate (optional).
     */
    constructor(
        vbos: VertexBufferObject[],
        ebo?: ElementBufferObject,
    ) {
        this.vao = _gl.createVertexArray() as WebGLVertexArrayObject;
        
        
        this.bind();
        vbos.forEach((vbo) => {
            vbo.bind();
        });
        ebo?.bind();

        // unbind the EBO target so it can't leak into the next VAO.
        this.unbind();
        ebo?.unbind();
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