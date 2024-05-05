import { _gl, _program } from "./Context";
import { u32, TypedArray } from "./Types";
import { BufferObject, createBufferObject } from "./BufferObject";
import { padNBytes } from "./Util";

/**
 * A Uniform Buffer Object manages uniform data.
 */
interface UniformBufferObject extends BufferObject {
    /**
     * Binds the uniform block to the specified binding point.
     * @param binding - The binding point for the uniform block.
     */
    bindBlock(binding: u32): void;
    /**
     * Binds the uniform buffer and uniform block binding point.
     */
    bind(): void;
    /**
     * Unbinds the uniform buffer and uniform block binding point.
     */
    unbind(): void;
}

/**
 * Creates a uniform buffer object and binds it.
 * @param blockName - The name of the uniform block in the shader program.
 * @param data - The data to be stored in the buffer.
 * @param binding - The binding point for the uniform block.
 * @param usage - The usage pattern of the buffer. (Default: STATIC_DRAW)
 */
export function createUniformBuffer(
    blockName: string,
    data: TypedArray,
    binding: GLintptr,
    usage: GLenum = _gl.STATIC_DRAW
): UniformBufferObject {
    
    // Retrieve the uniform block index
    const blockIndex = _gl.getUniformBlockIndex(_program, blockName);
    if (blockIndex === _gl.INVALID_INDEX) {
        throw new Error(`Uniform block "${blockName}" not found in program: ${_program}`);
    }

    // Create a buffer object with the target as UNIFORM_BUFFER
    const bufferObject = createBufferObject(_gl.UNIFORM_BUFFER, usage);
    
    // Bind the buffer
    bufferObject.bind();

    // Pad the data to 16 bytes
    const _buffer = padNBytes(data, 16);
    
    // Set the buffer data
    bufferObject.setBuffer(_buffer);
    
    // Bind the uniform block
    bindBlock(binding);

    function bindBlock(binding: u32) {
        _gl.uniformBlockBinding(_program, blockIndex, binding);
    }

    // Return an object with the desired methods and properties
    return {
        ...bufferObject,
        bindBlock,
        bind() {
            bufferObject.bind();
            _gl.bindBufferBase(_gl.UNIFORM_BUFFER, blockIndex, bufferObject.buf);
        },
        unbind() {
            _gl.bindBufferBase(_gl.UNIFORM_BUFFER, blockIndex, null);
            bufferObject.unbind();
        },
        // Overwrite the setBuffer method to use internal padded buffer.
        setBuffer(data: TypedArray) {
            // Update the internal buffer
            _buffer.set(data);
            bufferObject.setBuffer(_buffer);
        },
    };
}