import { BufferObject } from "./BufferObject";
import { _gl } from "./Context";
import { GLVertexComponents, u32, BufferObjectLike } from "./Types";

/**
 * A TransformFeedback object manages the output of vertex shader data.
 */
export interface TransformFeedback {
    /**
     * Binds the TransformFeedback object.
     */
    bind: () => void;
    /**
     * Unbinds the TransformFeedback object.
     */
    unbind: () => void;
    /**
     * Starts a TransformFeedback operation.
     * @param primitive - The number of vertices per primitive. (Default: GL.POINTS)
     * @note options: gl.POINTS, gl.LINES, gl.TRIANGLES.
     */
    begin: (primitive: GLVertexComponents) => void;
    /**
     * Ends a TransformFeedback operation.
     */
    end: () => void;
}

/**
 * Creates a TransformFeedback object and binds it.
 */
export function createTransformFeedback(): TransformFeedback{
    // Create the WebGLTransformFeedback object
    const tfbo = _gl.createTransformFeedback();
    if (!tfbo) {
        throw new Error(`Failed to create TransformFeedback using context: ${_gl}`);
    }

    function bind() {
        _gl.bindTransformFeedback(_gl.TRANSFORM_FEEDBACK, tfbo);
    }

    // Bind on creation.
    bind();

    // Return an object with the desired methods
    return {
        bind,
        unbind,
        begin,
        end,
    };
}

/**
 * Binds a range of each output buffer to the TransformFeedback target.
 * This is not specific to any TransformFeedback object.
 * @param outputBuffers - An array of tuples containing a [BufferObject, offset, and length].
 * @param startIndex - The index to start binding the output buffers. (Default: 0)
 */
export function bindFeedbackOutputBuffers<T extends BufferObject>(
    outputBuffers: [BufferObjectLike<T>, u32, u32][],
    startIndex: u32 = 0,
): void {
    for (let i = startIndex; i < outputBuffers.length; i++) {
        let [buffer, offset, length] = outputBuffers[i];
        _gl.bindBufferRange(_gl.TRANSFORM_FEEDBACK_BUFFER, i, buffer.buf, offset, length);
    }
}

function unbind() {
    _gl.bindTransformFeedback(_gl.TRANSFORM_FEEDBACK, null);
}

function begin(primitive: GLVertexComponents = 0) {
    _gl.beginTransformFeedback(primitive);
}

function end() {
    _gl.endTransformFeedback();
}