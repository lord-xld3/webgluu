import { _gl, _program } from "./Context";
import { u32, TypedArray, GLVertexComponents } from "./Types";
import { BufferObject } from "./BufferObject";

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
    attribute: string;
    size: GLVertexComponents;
    type?: GLenum;
    normalized?: boolean;
    stride?: u32;
    offset?: u32;
    divisor?: u32;
};
/**
 * Internal representation of an attribute pointer.
 */
type AttributePointer = {
    index: GLint; // The "location" of the attribute in the shader program.
    size: GLVertexComponents;
    type: GLenum;
    normalized: boolean;
    stride: u32;
    offset: u32;
    divisor: u32;
};
/**
 * A Vertex BufferObject (VBO) holds vertex data.
 */

export class VertexBufferObject extends BufferObject {
    static readonly target = WebGL2RenderingContext.ARRAY_BUFFER;

    // We keep both a flat array, and a map for quick lookups. These cannot be modified after creation.
    private readonly ptrs: AttributePointer[] = [];
    private readonly attributeMap: Map<string, AttributePointer> = new Map();

    /**
     * Creates a new VertexBufferObject, binds it, and sets the buffer data.
     * @param {TypedArray} data - The data buffer.
     * @param {AttributePointerInfo[]} attributes - Information about vertex attribute pointers.
     * @param {GLenum} [usage=gl.STATIC_DRAW] - Data usage pattern (default: gl.STATIC_DRAW).
     */
    constructor(
        data: TypedArray,
        attributes: AttributePointerInfo[],
        usage: GLenum = WebGL2RenderingContext.STATIC_DRAW
    ) {
        // Verify attributes and map default values to pointers.
        super(VertexBufferObject.target, usage);
        for (let i = 0; i < attributes.length; i++) {
            const attrib = attributes[i];

            // Check if attribute exists in shader program.
            const loc = _gl.getAttribLocation(_program, attrib.attribute);
            if (loc === -1) {
                throw new Error(
                    `Attribute "${attrib.attribute}" not found in program: ${_program}
                    Buffer: ${this.buf}`
                );
            }

            // Map attribute names and pointers.
            this.ptrs[i] = {
                index: loc,
                size: attrib.size,
                type: attrib.type || _gl.FLOAT,
                normalized: attrib.normalized || false,
                stride: attrib.stride || 0,
                offset: attrib.offset || 0,
                divisor: attrib.divisor || 0,
            };
            this.attributeMap.set(attrib.attribute, this.ptrs[i]);
        }

        // Bind VBO and set buffer data.
        this.bind();
        this.setBuffer(data);
    }

    // Static method to enable a pointer.
    private static enablePointer(ptr: AttributePointer): void {
        _gl.vertexAttribPointer(
            ptr.index,
            ptr.size,
            ptr.type,
            ptr.normalized,
            ptr.stride,
            ptr.offset
        );
        _gl.enableVertexAttribArray(ptr.index);
        _gl.vertexAttribDivisor(ptr.index, ptr.divisor);
    }

    /**
     * Enable specified attribute pointers.
     * @param {string[]} attributes - The names of the attributes.
     */
    public enableAttributes(attributes: string[]): void {
        for (let i = 0; i < attributes.length; i++) {
            const ptr = this.findAttribute(attributes[i]);
            VertexBufferObject.enablePointer(ptr);
        }
    }

    /**
     * Disable specified attribute pointers.
     * @param {string[]} attributes - The names of the attributes.
     */
    public disableAttributes(attributes: string[]): void {
        for (let i = 0; i < attributes.length; i++) {
            const ptr = this.findAttribute(attributes[i]);
            _gl.disableVertexAttribArray(ptr.index);
        }
    }

    /**
     * Enable all attribute pointers.
     */
    public enableAllAttributes(): void {
        for (let i = 0; i < this.ptrs.length; i++) {
            const ptr = this.ptrs[i];
            VertexBufferObject.enablePointer(ptr);
        }
    }

    /**
     * Disable all attribute pointers.
     */
    public disableAllAttributes(): void {
        for (let i = 0; i < this.ptrs.length; i++) {
            _gl.disableVertexAttribArray(this.ptrs[i].index);
        }
    }

    /**
     * Find an attribute pointer by name.
     * @param attribute - The name of the attribute.
     * @returns The attribute pointer.
     * @throws {Error} If the attribute is not found.
     */
    public findAttribute(attribute: string): AttributePointer {
        const ptr = this.attributeMap.get(attribute);
        if (ptr) {
            return ptr;
        } else {
            throw new Error(`Attribute "${attribute}" not found in VBO.`);
        }
    }

    /**
     * Set the contents of the buffer for a specific attribute.
     * @param data - The data to be copied into the buffer.
     * @param attribute - The name of the attribute.
     */
    public setAttributeBuffer(data: TypedArray, attribute: string): void {
        const ptr = this.findAttribute(attribute);
    
        // Calculate the stride and offset
        const stride = ptr.stride != 0 ? ptr.stride : ptr.size;
        const offset = ptr.offset;
    
        // Copy the data into the buffer
        for (let i = 0; i < data.length; i++) {
            // Calculate the index in the buffer
            const index = i * stride + offset;
    
            // Create a view for the attribute buffer at the specified offset and stride
            const bufferView = new (data.constructor as any)(this.buf, index * data.BYTES_PER_ELEMENT, ptr.size);
            
            // Copy the data from the provided data array to the buffer view
            bufferView.set(data.slice(i * ptr.size, i * ptr.size + ptr.size));
        }

    }
}
