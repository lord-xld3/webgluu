import { BufferObject, createBufferObject } from './BufferObject';
import { TypedArray } from './Types';

/**
 * A FeedbackBufferObject is intended for writing to buffers that are not used in rendering.
 */
interface FeedbackBufferObject extends BufferObject {}

/**
 * A simple BufferObject for use with TransformFeedback.
 * @note This is intended for writing to buffers that are not used in rendering.
 * @note Vertex, element, and uniform buffers can be used as output buffers instead with TransformFeedback.
 */
export function createFeedbackBuffer(
    data: TypedArray,
    target: GLenum = WebGL2RenderingContext.TRANSFORM_FEEDBACK_BUFFER,
    usage: GLenum = WebGL2RenderingContext.STATIC_COPY,
): FeedbackBufferObject {
    const buffer = createBufferObject(target, usage);
    buffer.bind();
    buffer.setBuffer(data);
    return buffer;
};