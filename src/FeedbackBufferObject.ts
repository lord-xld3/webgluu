import { BufferObject } from './BufferObject';
import { TypedArray } from './Types';

/**
 * A simple BufferObject for use with TransformFeedback.
 * @note This is intended for writing to buffers that are not used in rendering.
 * @note Vertex, element, and uniform buffers can be used as output buffers instead with TransformFeedback.
 */
export class FeedbackBufferObject extends BufferObject {
    /**
     * Creates a new FeedbackBufferObject.
     * 
     * @param data The data to be written to the buffer. 
     * Any range of this buffer can be modified by TransformFeedback.
     * 
     * @param target The target buffer type. (default: gl.ARRAY_BUFFER)
     * @param usage The usage pattern of the buffer. (default: gl.STATIC_COPY)
     */
    constructor(
        data: TypedArray,
        target: GLenum = WebGL2RenderingContext.ARRAY_BUFFER,
        usage: GLenum = WebGL2RenderingContext.STATIC_COPY,
    ) {
        super(target, usage);
        this.bind();
        this.setBuffer(data);
    }
}