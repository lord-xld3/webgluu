import { _gl, _program } from "./Context";
import { u32, TypedArray, GLVertexComponents } from "./Types";
import { createBufferObject, BufferObject } from "./BufferObject";

/**
 * A VertexBufferObject manages the attribute state and vertex data.
 */
export interface VertexBufferObject extends BufferObject {
    /**
     * Enables all attributes in the buffer.
     */
    enableAllAttributes(): void;
    /**
     * Enables specific attributes in the buffer.
     * @param attributes - An array of attribute names to enable.
     */
    enableAttributes(attributes: string[]): void;
    /**
     * Disables all attributes in the buffer.
     */
    disableAllAttributes(): void;
    /**
     * Disables specific attributes in the buffer.
     * @param attributes - An array of attribute names to disable.
     */
    disableAttributes(attributes: string[]): void;
    /**
     * Sets the buffer data for a specific attribute.
     * @param attribute - The name of the attribute in the shader program.
     * @param data - The data to be stored in the buffer.
     */
    setAttributeBuffer(attribute: string, data: TypedArray): void;
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
 * Creates a VertexBufferObject and binds it.
 * @param {TypedArray} data - The data to be stored in the buffer.
 * @param {AttributePointerInfo[]} attributes - Information about the vertex attributes.
 * @param {GLenum} [usage=gl.STATIC_DRAW] - The usage pattern of the buffer.
 */
export function createVertexBuffer(
    data: TypedArray,
    attributes: AttributePointerInfo[],
    usage: GLenum = _gl.STATIC_DRAW,
): VertexBufferObject {
    const buffer = createBufferObject(_gl.ARRAY_BUFFER, usage);
    const ptrs: AttributePointer[] = new Array(attributes.length);
    const attributeMap: Map<string, AttributePointer> = new Map();

    // Verify attributes exist and map them.
    for (let i = 0; i < attributes.length; i++) {
        const attrib: AttributePointerInfo = attributes[i];
        
        // Check if attribute exists in shader program.
        const loc = _gl.getAttribLocation(_program, attrib.attribute);
        if (loc === -1) {
            throw new Error(
                `Attribute "${attrib.attribute}" not found in program: ${_program}
                Buffer: ${buffer}`
            );
        }

        // Map attribute with default values.
        ptrs[i] = {
            index: loc,
            size: attrib.size,
            type: attrib.type || _gl.FLOAT,
            normalized: attrib.normalized || false,
            stride: attrib.stride || 0,
            offset: attrib.offset || 0,
            divisor: attrib.divisor || 0,
        };
        attributeMap.set(attrib.attribute, ptrs[i]);
    }

    // Bind VBO and set buffer data.
    buffer.bind();
    buffer.setBuffer(data);

    return {
        ...buffer,
        enableAllAttributes(): void {
            for (let i = 0; i < ptrs.length; i++) {
                enablePointer(ptrs[i]);
            }
        },
        enableAttributes(attributes: string[]): void {
            for (let i = 0; i < attributes.length; i++) {
                enablePointer(findPointer(attributes[i]));
            }
        },
        disableAllAttributes(): void {
            for (let i = 0; i < ptrs.length; i++) {
                _gl.disableVertexAttribArray(ptrs[i].index);
            }
        },
        disableAttributes(attributes: string[]): void {
            for (let i = 0; i < attributes.length; i++) {
                _gl.disableVertexAttribArray(findPointer(attributes[i]).index);
            }
        },
        setAttributeBuffer(attribute: string, data: TypedArray): void {
            const ptr = findPointer(attribute);
            
            // Calculate the stride and offset
            const stride = ptr.stride != 0 ? ptr.stride : ptr.size;
            const offset = ptr.offset;
        
            // Copy the data into the buffer at the specified offset and stride
            for (let i = 0; i < data.length; i++) {
                // Calculate the index in the buffer
                const index = i * stride + offset;
        
                // Create a view for the attribute buffer at the specified offset and stride
                const bufferView = new (data.constructor as any)(this.buf, index * data.BYTES_PER_ELEMENT, ptr.size);
                
                // Copy the data from the provided data array to the buffer view
                bufferView.set(data.slice(i * ptr.size, i * ptr.size + ptr.size));
            }
        }
    };

    // Function to lookup an attribute pointer from the map.
    function findPointer(attribute: string): AttributePointer {
        const ptr = attributeMap.get(attribute);
        if (!ptr) {
            throw new Error(`Attribute "${attribute}" not found.`);
        }
        return ptr;
    }    
}

// Function to enable an attribute pointer.
function enablePointer(ptr: AttributePointer): void {
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