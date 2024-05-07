import { BufferObject } from "./BufferObject"
import { _gl } from "./Context";
import { ElementBufferObject } from "./ElementBufferObject";
import { FeedbackBufferObject } from "./FeedbackBufferObject";
import { VertexBufferObject } from "./VertexBufferObject";

// Valid output types for TransformFeedback.
export type FeedbackBufferLike = BufferObject | VertexBufferObject | ElementBufferObject | FeedbackBufferObject;

export type u8 = number;
export type i8 = number;
export type u16 = number;
export type i16 = number;
export type u32 = number;
export type i32 = number;
export type f32 = number;

export type GLVertexComponents = number;

export type TypedArray = 
Int8Array | Uint8Array | 
Int16Array | Uint16Array | 
Int32Array | Uint32Array | 
Float32Array // | Float64Array is not supported by WebGL2 with only 32-bit float support.

/**
 * Indexing into the GLVertexTypes object with an attribute type will return the attribute info of [size, type(as scalar)].
 * @returns [size, scalar]
 */
export const GLVertexTypes: Record<number, [number, number]> = {
    [0x1401]: [1, 0x1401], // UNSIGNED_BYTE
    [0x1402]: [1, 0x1402], // SHORT
    [0x1403]: [1, 0x1403], // UNSIGNED_SHORT
    [0x1404]: [1, 0x1404], // INT
    [0x1405]: [1, 0x1405], // UNSIGNED_INT
    [0x1406]: [1, 0x1406], // FLOAT
    [0x8B50]: [2, 0x1406], // FLOAT_VEC2
    [0x8B51]: [3, 0x1406], // FLOAT_VEC3
    [0x8B52]: [4, 0x1406], // FLOAT_VEC4
    [0x8B53]: [2, 0x1404], // INT_VEC2
    [0x8B54]: [3, 0x1404], // INT_VEC3
    [0x8B55]: [4, 0x1404], // INT_VEC4
    [0x8B57]: [2, 0x1401], // BOOL_VEC2
    [0x8B58]: [3, 0x1401], // BOOL_VEC3
    [0x8B59]: [4, 0x1401], // BOOL_VEC4
    [0x8B5A]: [4, 0x1406], // FLOAT_MAT2
    [0x8B5B]: [9, 0x1406], // FLOAT_MAT3
    [0x8B5C]: [16, 0x1406], // FLOAT_MAT4
    [0x8DC6]: [2, 0x1405], // UNSIGNED_INT_VEC2
    [0x8DC7]: [3, 0x1405], // UNSIGNED_INT_VEC3
    [0x8DC8]: [4, 0x1405], // UNSIGNED_INT_VEC4
};