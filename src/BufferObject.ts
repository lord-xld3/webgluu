import { _gl } from "./Context";
import { u32, TypedArray } from "./Types";

/**
 * A GL "BufferObject" holds a WebGLBuffer and describes how to use it.
 */
export class BufferObject {
    public readonly buf: WebGLBuffer; // This is THE buffer.
    private readonly target: GLenum;
    private readonly usage: GLenum;
    
    /**
     * Creates a BufferObject.
     * @param {GLenum} target - Binding point of the BufferObject.
     * @param {GLenum} usage - Data usage pattern.
     * @link
     * see [bindBuffer()](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer) 
     * and [bufferData()](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData)
     */
    constructor(
        target: GLenum, 
        usage: GLenum,
    ) {
        this.buf = _gl.createBuffer()!;
        if (!this.buf) {
            throw new Error(
                `Failed to create BufferObject using context: ${_gl}
                Target: ${target}
                Usage: ${usage}`
            );
        }
        this.target = target;
        this.usage = usage;
    }

    /**
     * Binds the BufferObject with bindBuffer()
     */
    public bind(): void {
        _gl.bindBuffer(this.target, this.buf);
    }

    /**
     * Unbinds the BufferObject with bindBuffer()
     */
    public unbind(): void {
        _gl.bindBuffer(this.target, null);
    }

    /**
     * Set the contents of the buffer.
     * @param data - The data to be copied into the buffer.
     */
    public setBuffer(data: TypedArray): void {
        _gl.bufferData(this.target, data, this.usage);
    }

    /**
     * Updates a subset of the buffer's data.
     * @param data - The data to be copied into the buffer.
     * @param dstOffset - The destination offset in bytes. Default: 0.
     * @param srcOffset - The source offset in bytes. Default: 0.
     * @param length - The number of elements in the array. Default: data.length.
     */
    public setSubBuffer(
        data: TypedArray, 
        dstOffset: u32 = 0,
        srcOffset: u32 = 0,
        length: u32 = data.length,
    ): void {
        _gl.bufferSubData(
            this.target, 
            dstOffset, 
            data, 
            srcOffset, 
            length
        );
    }
}