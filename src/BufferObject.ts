import { _gl } from './Context';
import { TypedArray, u32 } from './Types';

export interface BufferObject {
    /**
     * WebGLBuffer object.
    */
    buf: WebGLBuffer;
    /**
     * Binds the buffer object.
     */
    bind(): void;
    /**
     * Unbinds the buffer object.
     */
    unbind(): void;
    /**
     * Deletes the buffer object.
     */
    delete(): void;
    /**
     * Sets the contents of the buffer.
     * @param data - The data used to set the buffer contents.
     */
    setBuffer(data: TypedArray): void;
    /**
     * Sets the contents for a range of the buffer.
     * @param data - The data used to set the buffer contents.
     * @param dstOffset - The offset in bytes from the start of the buffer object. (Default: 0)
     * @param srcOffset - The offset in bytes from the start of the data array. (Default: 0)
     * @param length - The number of elements to set. (Default: data.length)
     */
    setSubBuffer(data: TypedArray, dstOffset: u32, srcOffset: u32, length: u32): void;
}

/**
 * Creates a WebGL buffer with some useful methods.
 * @param target - The target for the buffer object. (e.g. ARRAY_BUFFER, ELEMENT_ARRAY_BUFFER)
 * @param usage - The usage pattern of the buffer. (e.g. STATIC_DRAW, DYNAMIC_DRAW)
 */
export function createBufferObject(
    target: GLenum, 
    usage: GLenum
): BufferObject {
    // Create a WebGLBuffer
    const buf = _gl.createBuffer()!;
    if (!buf) {
        console.error(
            `Failed to create BufferObject using context: ${_gl}
            Target: ${target}
            Usage: ${usage}`
        );
    }

    return {
        buf,
        bind() {
            _gl.bindBuffer(target, buf);
        },
        unbind() {
            _gl.bindBuffer(target, null);
        },
        delete() {
            _gl.deleteBuffer(buf);
        },
        setBuffer(data: TypedArray) {
            _gl.bufferData(target, data, usage);
        },
        setSubBuffer(data: TypedArray, dstOffset: u32 = 0, srcOffset: u32 = 0, length: u32 = data.length) {
            _gl.bufferSubData(target, dstOffset, data, srcOffset, length);
        }
    };
}