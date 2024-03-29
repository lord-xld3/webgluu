import { gl } from "./Context";
import { GLVertexComponents, u32 } from './Types';

/**
 * A GL "BufferObject" has a valid buffer of data and describes how to use that buffer.
 */
abstract class BufferObject {
    protected readonly buf: WebGLBuffer;
    private readonly target: GLenum;
    private readonly usage: GLenum;
    
    /**
     * Creates a BufferObject.
     * @param target - Binding point of the BufferObject.
     * @param usage - Data usage pattern (default: gl.STATIC_DRAW).
     * @link
     * [bindBuffer()](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
     */
    constructor(
        target: GLenum, 
        usage: GLenum = gl.STATIC_DRAW
    ) {
        this.buf = gl.createBuffer() as WebGLBuffer;
        if (!this.buf) {
            throw new Error(`${this} Failed to create BufferObject using context: ${gl}`);
        }
        this.target = target;
        this.usage = usage;
    }

    /**
     * Binds the BufferObject with bindBuffer()
     */
    public bind(): void {
        gl.bindBuffer(this.target, this.buf);
    }

    /**
     * Unbinds the BufferObject with bindBuffer()
     */
    public unbind(): void {
        gl.bindBuffer(this.target, null);
    }

    /**
     * Set the contents of the buffer.
     * @param data - The data to be copied into the buffer.
     */
    public setBuffer(data: ArrayBufferView): void {
        gl.bufferData(this.target, data, this.usage);
    }

    /**
     * Updates a subset of the buffer's data store.
     * @param data - The data to be copied into the buffer.
     * @param dstOffset - The destination offset in bytes. Default: 0.
     * @param srcOffset - The source offset in bytes. Default: 0.
     * @param length - The length of the data to be copied in bytes. Default: data.byteLength.
     */
    public setSubBuffer(
        data: ArrayBufferView, 
        dstOffset: u32 = 0,
        srcOffset: u32 = 0,
        length: u32 = data.byteLength,
    ): void {
        gl.bufferSubData(
            this.target, 
            dstOffset, 
            data, 
            srcOffset, 
            length
        );
    }
}

/**
 * An Element BufferObject (EBO) targets gl.ELEMENT_ARRAY_BUFFER.
 */
export class ElementBufferObject extends BufferObject {
    static readonly target = gl.ELEMENT_ARRAY_BUFFER;
    /**
     * Creates a new ElementBufferObject.
     * @param data - The data buffer.
     * @param usage - Data usage pattern (default: gl.STATIC_DRAW).
     */
    constructor(
        data: ArrayBufferView,
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
 */
export type AttributePointerInfo = {
    attribute: string,
    size: GLVertexComponents,
    type: GLenum,
    normalized?: boolean,
    stride?: u32,
    offset?: u32,
};

/**
 * Internal representation of an attribute pointer.
 */
type AttributePointer = Required<AttributePointerInfo> & { index: GLint };

/**
 * Represents a Vertex Buffer Object (VBO) for storing and managing vertex attribute data.
 */
export class VertexBufferObject extends BufferObject{
    static readonly target = gl.ARRAY_BUFFER;
    private readonly ptrs: AttributePointer[];
    /**
     * Creates a new VertexBufferObject.
     * 
     * @param {WebGLProgram} program - The shader program associated with the VBO.
     * @param {ArrayBufferView} data - The data buffer.
     * @param {Object[]} attributes - Information about vertex attribute pointers.
     * @param {GLenum} [usage=gl.STATIC_DRAW] - Data usage pattern.
     */
    constructor(
        program: WebGLProgram,
        data: ArrayBufferView,
        attributes: AttributePointerInfo[],
        usage?: GLenum,
    ) {
        // Verify attributes and map default values to pointers.
        super(VertexBufferObject.target, usage);
        this.ptrs = attributes.map(ptr => {
            const index = gl.getAttribLocation(program, ptr.attribute);
            if (index === -1) {
                throw new Error(`Attribute "${ptr.attribute}" not found in program: ${program}`);
            }
            return {
                index,
                ...ptr,
                type: ptr.type ?? gl.FLOAT,
                normalized: ptr.normalized ?? false,
                stride: ptr.stride ?? 0,
                offset: ptr.offset ?? 0,
            } as AttributePointer;
        });
        

        // Bind VBO, copy data, and enable all attribute pointers.
        this.bind();
        this.setBuffer(data);
    }

    /**
     * Binds the VBO and binds all attribute pointers.
     */
    public override bind(): void {
        super.bind();
        this.ptrs.forEach(ptr => {
            gl.vertexAttribPointer(
                ptr.index,
                ptr.size,
                ptr.type,
                ptr.normalized,
                ptr.stride,
                ptr.offset
            );
        });
    }

    public modifyAttribute(attribute: string, enable?: boolean): void {
        const ptr = this.ptrs.find(p => p.attribute === attribute);
        if (!ptr) {
            throw new Error(`Attribute "${attribute}" not found in VBO: ${this}.`);
        }
        
        if (enable !== undefined) {
            if (enable) {
                gl.enableVertexAttribArray(ptr.index);
            } else {
                gl.disableVertexAttribArray(ptr.index);
            }
        }
    }
    
    
}

/**
 * A Uniform BufferObject (UBO) targets gl.UNIFORM_BUFFER.
 */
export class UniformBufferObject extends BufferObject {
    private readonly blockIndex: GLuint;
    static readonly target = gl.UNIFORM_BUFFER;

    /**
     * Creates a new UniformBufferObject.
     * @param program - The shader program associated with the UBO.
     * @param blockName - The name of the uniform block.
     * @param data - The data buffer.
     * @param binding - The binding index for the uniform block.
     * @param usage - Data usage pattern (default: gl.STATIC_DRAW).
     */
    constructor(
        program: WebGLProgram,
        blockName: string,
        data: ArrayBufferView,
        binding: GLuint,
        usage?: u32,
    ) {
        super(UniformBufferObject.target, usage);
        this.blockIndex = gl.getUniformBlockIndex(program, blockName);
        if (this.blockIndex === gl.INVALID_INDEX) {
            throw new Error(`Uniform block "${blockName}" not found in program: ${program}`);
        }

        this.bind();
        this.setBuffer(data);
        gl.uniformBlockBinding(program, this.blockIndex, binding);
    }

    public override bind(): void {
        super.bind();
        gl.bindBufferBase(UniformBufferObject.target, this.blockIndex, this.buf);
    }

    public override unbind(): void {
        gl.bindBufferBase(UniformBufferObject.target, this.blockIndex, null);
        super.unbind();
    }

    public override setBuffer(data: ArrayBufferView): void {
        // Workaround for alignment issues on some devices, pads buffer to 16 byte alignment.
        const alignedSize = (data.byteLength + 15) & ~15;
        const alignedBuffer = new (data.constructor as any)(alignedSize);
        alignedBuffer.set(data);
        super.setBuffer(alignedBuffer);
    }
}