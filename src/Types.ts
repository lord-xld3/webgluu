import { BufferObject } from "./BufferObject"

// Anything that extends BufferObject will have some common properties and methods.
export type BufferObjectLike<T extends BufferObject> = T;

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
Float32Array // | Float64Array is not supported by WebGL with only 32-bit float support.