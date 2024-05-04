import { _gl, _program } from "./Context";
import { u32, TypedArray } from "./Types";
import { BufferObject } from "./BufferObject";
import { padNBytes } from "./Util";

/**
 * A Uniform BufferObject (UBO) holds uniform data.
 */

export class UniformBufferObject extends BufferObject {
    private readonly blockIndex: GLuint;
    static readonly target = WebGL2RenderingContext.UNIFORM_BUFFER;
    private dataBuffer: TypedArray; // Internal buffer so we only have to pad once.

    /**
     * Creates a new UniformBufferObject.
     * @param blockName - The name of the uniform block.
     * @param data - The data buffer.
     * @param binding - The binding index for the uniform block (default: 0).
     * @param usage - Data usage pattern (default: gl.STATIC_DRAW).
     */
    constructor(
        blockName: string,
        data: TypedArray,
        binding: GLuint = 0,
        usage: u32 = WebGL2RenderingContext.STATIC_DRAW,
    ) {
        super(UniformBufferObject.target, usage);
        this.blockIndex = _gl.getUniformBlockIndex(_program, blockName);
        if (this.blockIndex === WebGL2RenderingContext.INVALID_INDEX) {
            throw new Error(`Uniform block "${blockName}" not found in program: ${_program}`);
        }

        this.bind();

        // Pad the data to 16 bytes for consistency on all platforms.
        this.dataBuffer = padNBytes(data, 16);
        super.setBuffer(this.dataBuffer);
        _gl.uniformBlockBinding(_program, this.blockIndex, binding);
    }

    public override bind(): void {
        super.bind();
        _gl.bindBufferBase(UniformBufferObject.target, this.blockIndex, this.buf);
    }

    public override unbind(): void {
        _gl.bindBufferBase(UniformBufferObject.target, this.blockIndex, null);
        super.unbind();
    }

    // We only need to override setBuffer since it overwrites the whole buffer AS IS and needs padding.
    // setSubBuffer writes to the existing buffer.
    public override setBuffer(data: TypedArray): void {
        // dataBuffer is already padded, set data and copy to GPU.
        this.dataBuffer.set(data);
        super.setBuffer(this.dataBuffer);
    }
}
