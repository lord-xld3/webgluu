import { _gl } from "./Context";
import { GLVertexComponents, u32, FeedbackBufferLike } from "./Types";

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
 * Creates a TransformFeedback object and binds output buffers.
 */
export function createTransformFeedback(
    outputBuffers: [FeedbackBufferLike, u32, u32][],
    startIndex: u32 = 0,
): TransformFeedback {
    // Create the WebGLTransformFeedback object
    const tfbo = _gl.createTransformFeedback()!;
    if (!tfbo) {
        console.error(`Failed to create TransformFeedback using context: ${_gl}`);
    }

    function bind() {
        _gl.bindTransformFeedback(_gl.TRANSFORM_FEEDBACK, tfbo);
    }

    // Bind on creation.
    bind();

    // Bind output buffers
    for (let i = startIndex; i < outputBuffers.length; i++) {
        let [buffer, offset, length] = outputBuffers[i];
        _gl.bindBufferRange(_gl.TRANSFORM_FEEDBACK_BUFFER, i, buffer.buf, offset, length);
    }

    // Return an object with the desired methods
    return {
        bind,
        unbind() {
            _gl.bindTransformFeedback(_gl.TRANSFORM_FEEDBACK, null);
        },
        begin(primitive: GLVertexComponents = 0) {
            _gl.beginTransformFeedback(primitive);
        },
        end() {
            _gl.endTransformFeedback();
        },
    };
}