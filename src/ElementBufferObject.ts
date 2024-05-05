import { _gl } from './Context';
import { TypedArray } from './Types';
import { createBufferObject } from './BufferObject';

/**
 * Creates an element buffer object for use with WebGL2.
 * @param data - A TypedArray used to set the buffer contents.
 * @param usage - Data usage pattern. (default: STATIC_DRAW)
 */
export function createElementBuffer(
    data: TypedArray,
    usage: GLenum = _gl.STATIC_DRAW,
) {
    const buffer = createBufferObject(_gl.ELEMENT_ARRAY_BUFFER, usage);
    buffer.bind();
    buffer.setBuffer(data);
    return buffer;
}