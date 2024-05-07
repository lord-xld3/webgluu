import { _gl } from "./Context";
import { ElementBufferObject } from "./ElementBufferObject";
import { VertexBufferObject } from "./VertexBufferObject";

/**
 * A VertexArrayObject (VAO) silently captures the state of buffers and attributes.
 */
interface VertexArrayObject {
    /**
     * Binds the VertexArrayObject.
     * Any state captured while bound will be restored when re-binding the VAO.
     * @note Binding the VAO does not capture existing state.
     */
    bind(): void;
    /**
     * Unbinds the VertexArrayObject. This does not affect state, and the VAO no longer captures state.
     */
    unbind(): void;
}

/**
 * Creates and binds a VertexArrayObject that captures the state of buffers and attributes.
 * 
 * @param bufferInfo - An array of [VertexBufferObject, attributeName[]] pairs.
 * @param elementBuffer - An optional ElementBufferObject.
 * 
 * @note Only enables attributes from the supplied attributeName[] array for each VBO.
 * 
 * @note When the VAO is re-binded, the state of the buffers and attributes will be restored.
 * @note Specifically, it captures the state of VertexBuffers + attributes, and ElementBuffers.
 */
export function createVertexArray(
    vertexBufferInfo: [VertexBufferObject, string[]][],
    elementBuffer?: ElementBufferObject,
): VertexArrayObject {
    const vao = _gl.createVertexArray()!;
    if (!vao) {
        console.error(`Failed to create VertexArray using context: ${_gl}`);
    }

    function bind() {
        _gl.bindVertexArray(vao);
    }

    bind();

    for (let i = 0; i < vertexBufferInfo.length; i++) {
        const [vbo, attributes] = vertexBufferInfo[i];
        vbo.bind();
        vbo.enableAttributes(attributes);
    }

    elementBuffer?.bind();

    return {
        bind,
        unbind() {
            _gl.bindVertexArray(null);
        },
    };
}