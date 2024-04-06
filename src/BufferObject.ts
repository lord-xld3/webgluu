import { _gl, _program } from "./Context";
import { GLVertexComponents, u32, TypedArray } from "./Types";

/**
 * A GL "BufferObject" holds a WebGLBuffer and describes how to use it.
 */
abstract class BufferObject {
    protected readonly buf: WebGLBuffer; // UBO & TFBO need to access this for bindBufferBase().
    private readonly target: GLenum;
    private readonly usage: GLenum;
    
    /**
     * Creates a BufferObject.
     * @param {GLenum} target - Binding point of the BufferObject.
     * @param {GLenum} [usage=gl.STATIC_DRAW] - Data usage pattern (default: gl.STATIC_DRAW).
     * @link
     * [bindBuffer()](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
     */
    constructor(
        target: GLenum, 
        usage: GLenum = _gl.STATIC_DRAW,
    ) {
        this.buf = _gl.createBuffer()!;
        if (!this.buf) {
            throw new Error(`${this} Failed to create BufferObject using context: ${_gl}`);
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

/**
 * An Element BufferObject (EBO) holds vertex indices.
 */
export class ElementBufferObject extends BufferObject {
    static readonly target = WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER;
    /**
     * Creates a new ElementBufferObject.
     * @param {TypedArray} data - The data buffer.
     * @param {GLenum} [usage=gl.STATIC_DRAW] - Data usage pattern (default: gl.STATIC_DRAW).
     */
    constructor(
        data: TypedArray,
        usage?: GLenum,
    ) {
        super(ElementBufferObject.target, usage);
        this.bind();
        this.setBuffer(data);
    }
}

/**
 * Information about a vertex attribute pointer.
 * @param {string} attribute - The name of the attribute in the shader program.
 * @param {GLVertexComponents} size - The number of components per vertex attribute.
 * @param {GLenum} [type=gl.FLOAT] - The data type of each component.
 * @param {boolean} [normalized=false] - Whether integer data values should be normalized.
 * @param {u32} [stride=0] - The byte offset between consecutive generic vertex attributes.
 * @param {u32} [offset=0] - The offset of the first component in the vertex attribute array.
 * @param {u32} [divisor=0] - The number of instances that will pass between updates of the attribute.
 */
export type AttributePointerInfo = {
    attribute: string,
    size: GLVertexComponents,
    type?: GLenum,
    normalized?: boolean,
    stride?: u32,
    offset?: u32,
    divisor?: u32,
};

/**
 * Internal representation of an attribute pointer.
 */
type AttributePointer = Required<AttributePointerInfo> & { index: GLint };

/**
 * A Vertex BufferObject (VBO) holds vertex data.
 */
export class VertexBufferObject extends BufferObject{
    static readonly target = WebGL2RenderingContext.ARRAY_BUFFER;
    private readonly ptrs: AttributePointer[];
    
    /**
     * Creates a new VertexBufferObject.
     * @param {TypedArray} data - The data buffer.
     * @param {Object[]} attributes - Information about vertex attribute pointers.
     * @param {GLenum} [usage=gl.STATIC_DRAW] - Data usage pattern (default: gl.STATIC_DRAW).
     */
    constructor(
        data: TypedArray,
        attributes: AttributePointerInfo[],
        usage?: GLenum,
    ) {
        // Verify attributes and map default values to pointers.
        super(VertexBufferObject.target, usage);
        this.ptrs = attributes.map(ptr => {
            const index = _gl.getAttribLocation(_program, ptr.attribute);
            if (index === -1) {
                throw new Error(`Attribute "${ptr.attribute}" not found in program: ${_program}`);
            }
            return {
                index,
                ...ptr,
                type: ptr.type ?? _gl.FLOAT,
                normalized: ptr.normalized ?? false,
                stride: ptr.stride ?? 0,
                offset: ptr.offset ?? 0,
                divisor: ptr.divisor ?? 0,
            } as AttributePointer;
        });
        

        // Bind VBO, copy data, and enable all attribute pointers.
        this.bind();
        this.setBuffer(data);
    }

    /**
     * Binds the VBO and enables all attribute pointers.
     */
    public override bind(): void {
        super.bind();
        this.ptrs.forEach(ptr => {
            _gl.enableVertexAttribArray(ptr.index);
            _gl.vertexAttribPointer(
                ptr.index,
                ptr.size,
                ptr.type,
                ptr.normalized,
                ptr.stride,
                ptr.offset
            );
            _gl.vertexAttribDivisor(ptr.index, ptr.divisor);
        });
    }   
}

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
        usage?: u32,
    ) {
        super(UniformBufferObject.target, usage);
        this.blockIndex = _gl.getUniformBlockIndex(_program, blockName);
        if (this.blockIndex === _gl.INVALID_INDEX) {
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

    // We only need to override setBuffer since it writes the whole buffer and needs padding.
    // setSubBuffer doesn't write the whole buffer.

    public override setBuffer(data: TypedArray): void {
        // dataBuffer is already padded, set data and copy to GPU.
        this.dataBuffer.set(data);
        super.setBuffer(this.dataBuffer);
    }
}

/**
 * Pads an TypedArray to n bytes.
 * @param data - An TypedArray to pad.
 * @param n - The number of bytes to pad to.
 * @returns - A new TypedArray with the data padded to n bytes.
 */
function padNBytes(data: TypedArray, n: u32): TypedArray {
    const alignedSize = (data.byteLength + n - 1) & ~(n - 1);
    const alignedBuffer = new (data.constructor as any)(alignedSize);
    alignedBuffer.set(data);
    return alignedBuffer;
}