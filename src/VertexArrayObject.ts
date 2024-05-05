import { _gl } from "./Context";

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
 * Creates a VertexArrayObject that silently captures the state of buffers and attributes.
 * @note When the VAO is re-binded, the state of the buffers and attributes will be restored.
 * @note Specifically, it captures the state of VertexBuffers + attributes, and ElementBuffers.
 */
export function createVertexArray(): VertexArrayObject {
    const vao = _gl.createVertexArray();
    if (!vao) {
        throw new Error(`Failed to create VertexArray using context: ${_gl}`);
    }

    return {
        bind() {
            _gl.bindVertexArray(vao);
        },
        unbind,
    };
}

function unbind() {
    _gl.bindVertexArray(null);
}