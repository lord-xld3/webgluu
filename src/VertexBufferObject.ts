import { _gl, _program } from "./Context";
import { u32, TypedArray, GLVertexComponents } from "./Types";
import { createBufferObject, BufferObject } from "./BufferObject";
import { AttributeInfoMap} from "./Program";

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
    /**
     * Maps attributes to the buffer.
     * @param attributes - An array of [AttributeInfoMap, AttributePointerInfo[]] pairs.
     */
    mapAttributes(attributes: [AttributeInfoMap, AttributePointerInfo[]][]): void;
}

/**
 * Information about a vertex attribute pointer.
 * @param {string} attribute - The name of the attribute in the shader program.
 * @param {boolean} [normalized=false] - Whether integer data values should be normalized.
 * @param {u32} [stride=0] - The byte offset between consecutive generic vertex attributes.
 * @param {u32} [offset=0] - The offset of the first component in the vertex attribute array.
 * @param {u32} [divisor=0] - The number of instances that will pass between updates of the attribute.
 */
export type AttributePointerInfo = {
    attribute: string;
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


const _attributeMap: Map<string, AttributePointer> = new Map();
const _ptrs: AttributePointer[] = [];

/**
 * Creates a VertexBufferObject and binds it.
 * @param {TypedArray} data - The data to be stored in the buffer.
 * @param {GLenum} [usage=gl.STATIC_DRAW] - The usage pattern of the buffer.
 */
export function createVertexBuffer(
    data: TypedArray,
    usage: GLenum = _gl.STATIC_DRAW,
): VertexBufferObject {
    const buffer = createBufferObject(_gl.ARRAY_BUFFER, usage);

    // Bind VBO and set buffer data.
    buffer.bind();
    buffer.setBuffer(data);

    return {
        ...buffer,
        enableAllAttributes(): void {
            for (let i = 0; i < _ptrs.length; i++) {
                enablePointer(_ptrs[i]);
            }
        },
        enableAttributes(attributes: string[]): void {
            for (let i = 0; i < attributes.length; i++) {
                enablePointer(findPointer(attributes[i]));
            }
        },
        disableAllAttributes(): void {
            for (let i = 0; i < _ptrs.length; i++) {
                _gl.disableVertexAttribArray(_ptrs[i].index);
            }
        },
        disableAttributes(attributes: string[]): void {
            for (let i = 0; i < attributes.length; i++) {
                _gl.disableVertexAttribArray(findPointer(attributes[i]).index);
            }
        },
        // This copies data to the attribute whether its interleaved or not.
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
                const bufferView = new (data.constructor as any)(buffer, index * data.BYTES_PER_ELEMENT, ptr.size);
                
                // Copy the data from the provided data array to the buffer view
                bufferView.set(data.slice(i * ptr.size, i * ptr.size + ptr.size));
            }
        },
        mapAttributes(attributes: [AttributeInfoMap, AttributePointerInfo[]][]): void {
            for (let i = 0; i < attributes.length; i++) {
                const [infoMap, ptrInfos] = attributes[i];

                // Extend the _ptrs array to accommodate the new pointers
                const currentLength = _ptrs.length;
                _ptrs.length += ptrInfos.length;
                
                for (let j = 0; j < ptrInfos.length; j++) {
                    
                    // Map default values
                    const { attribute, normalized = false, stride = 0, offset = 0, divisor = 0 } = ptrInfos[j];
                    
                    // Retrieve the attribute info from the map
                    const info = infoMap.get(attribute)!;
                    if (!info) {
                        console.error(`Attribute "${attribute}" not found in AttributeInfoMap: ${infoMap}`);
                    }
                    const [index, size, type] = info;
                    
                    // Store pointer info in this VBO
                    const ptr = { index, size, type, normalized, stride, offset, divisor };
                    _attributeMap.set(attribute, ptr);
                    _ptrs[j + currentLength] = ptr;
                }
            }
        },
    };
}

/**
 * Enables an attribute pointer.
 * @param ptr - The AttributePointer to enable.
 */
function enablePointer(ptr: AttributePointer): void {
    _gl.enableVertexAttribArray(ptr.index);
    _gl.vertexAttribPointer(
        ptr.index,
        ptr.size,
        ptr.type,
        ptr.normalized,
        ptr.stride,
        ptr.offset
    );
    if (ptr.divisor) {
        _gl.vertexAttribDivisor(ptr.index, ptr.divisor);
    }
}

/**
 * Locates the attribute pointer in the _attributeMap for this VBO.
 * @param attribute - The name of the attribute.
 * @returns AttributePointer
 */
function findPointer(attribute: string): AttributePointer {
    const ptr = _attributeMap.get(attribute)!;
    if (!ptr) {
        console.error(
            `Attribute "${attribute}" not found in Vertex Buffer Object. 
            Verify attribute is mapped before enabling.`
        );
    }
    return ptr;
}