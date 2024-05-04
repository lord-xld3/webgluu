import { TypedArray, u32 } from "./Types";

/**
 * Pads a TypedArray to the next multiple of n bytes.
 * @param data - An TypedArray to pad.
 * @param n - The number of bytes to pad to.
 * @returns - A new TypedArray with the data padded to n bytes.
 */
export function padNBytes(data: TypedArray, n: u32): TypedArray {
    
    // (length + n - 1) AND NOT(n - 1) 
    const alignedSize = (data.byteLength + n - 1) & ~(n - 1);
    
    // call the constructor of the TypedArray to create the same type
    const alignedBuffer = new (data.constructor as any)(alignedSize);
    
    // set the data in the newly padded buffer
    alignedBuffer.set(data);
    return alignedBuffer;
}