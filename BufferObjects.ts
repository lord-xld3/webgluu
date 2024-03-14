import { gl } from "./Context";
import { u32 } from './Types';

/**
 * A GL "BufferObject" has a valid buffer of data and describes how to use that buffer.
 */
abstract class BufferObject {
    private readonly buf: WebGLBuffer;
    private readonly target: GLintptr;
    private readonly usage: GLenum;
    
    /**
     * Creates a BufferObject.
     * @param target - Binding point of the BufferObject.
     * @param usage - Data usage pattern (default: gl.STATIC_DRAW).
     * @link
     * [bindBuffer()](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
     */
    constructor(target: GLintptr, usage: GLenum = gl.STATIC_DRAW) {
        this.buf = gl.createBuffer() as WebGLBuffer;
        if (!this.buf) {
            throw new Error(`Failed to create BufferObject using context: ${gl}`);
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
     * @param dstOffset - The destination offset in bytes.
     * @param srcOffset - The source offset in bytes.
     * @param length - The length of the data to be copied in bytes.
     */
    public setSubBuffer(
        data: ArrayBufferView, 
        dstOffset: u32 = 0,
        srcOffset: u32 = 0,
        length?: u32
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
    /**
     * Creates a new ElementBufferObject.
     * @param data - The data buffer.
     * @param usage - Data usage pattern (default: gl.STATIC_DRAW).
     */
    constructor(
        data: ArrayBufferView,
        usage?: u32,
    ) {
        super(gl.ELEMENT_ARRAY_BUFFER, usage);
        this.bind();
        this.setBuffer(data);
        this.unbind();
    }
}

/**
 * Vertex attribute pointer info.
 * @link
 * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
 */
interface PointerInfo {
    size: u32;
    type: u32;
    normalized: boolean;
    stride: u32;
    offset: u32;
}

/**
 * Describes a vertex attribute pointer.
 */
interface AttributePointerInfo extends PointerInfo {
    attribute: string;
}

/**
 * Internal representation of a vertex attribute pointer.
 */
interface AttributePointer extends AttributePointerInfo {
    index: number;
}

/**
 * Represents a Vertex Buffer Object (VBO) for storing and managing vertex attribute data.
 */
export class VertexBufferObject extends BufferObject {
    private ptrs: AttributePointer[];
    
    /**
     * Creates a new VertexBufferObject.
     * @param program - The shader program associated with the VBO.
     * @param data - The data buffer.
     * @param attributes - Information about vertex attribute pointers.
     * @param usage - Data usage pattern (default: gl.STATIC_DRAW).
     */
    constructor(
        program: WebGLProgram,
        data: ArrayBufferView,
        attributes: AttributePointerInfo[],
        usage?: number,
    ) {
        super(gl.ARRAY_BUFFER, usage);
        this.ptrs = attributes.map(ptr => {
            const index = gl.getAttribLocation(program, ptr.attribute);
            if (index === -1) throw new Error(
                `Attribute "${ptr.attribute}" not found in program: ${program}`
            );
            
            return { 
                index, 
                ...ptr, 
                type: ptr.type, 
                normalized: ptr.normalized, 
                stride: ptr.stride, 
                offset: ptr.offset 
            } as AttributePointer;
        });
        this.bind();
        this.setBuffer(data);
        this.ptrs.forEach(ptr => {
            gl.enableVertexAttribArray(ptr.index);
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

    /**
     * Enable or disable the vertex attribute.
     * @param attribute - The name of the attribute.
     * @param enable - (default: false).
     */
    public toggleAttribute(attribute: string, enable: boolean = false): void {
        const ptr = this.ptrs.find(p => p.attribute === attribute);
        if (!ptr) throw new Error(
            `Attribute "${attribute}" not found in VBO: ${this}.`
        );
        enable ? 
            gl.enableVertexAttribArray(ptr.index) 
        : gl.disableVertexAttribArray(ptr.index);
    }
}