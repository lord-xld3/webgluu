import { TypedArray } from "./Types";
import { BufferObject } from "./BufferObject";

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
        usage: GLenum = WebGL2RenderingContext.STATIC_DRAW
    ) {
        super(ElementBufferObject.target, usage);
        this.bind();
        this.setBuffer(data);
    }
}