import { BufferObject } from "./BufferObject";
import { _gl } from "./Context";
import { GLVertexComponents, u32, BufferObjectLike } from "./Types";

/**
 * TransformFeedback processes vertex data and writes the results to buffer objects.
 * It holds no data itself and relies on BufferObjects to input and output data.
 */
export class TransformFeedback {
    static readonly target = WebGL2RenderingContext.TRANSFORM_FEEDBACK;
    static readonly outputTarget = WebGL2RenderingContext.TRANSFORM_FEEDBACK_BUFFER;

    // The TransformFeedback object.
    private readonly tfbo: WebGLTransformFeedback;

    constructor() {
        // Create TransformFeedback object.
        this.tfbo = _gl.createTransformFeedback()!;
        if (!this.tfbo) {
            throw new Error(`Failed to create TransformFeedback using context: ${_gl}`);
        }
    }

    /**
     * Binds a range of each output buffer to the TransformFeedback target. 
     * These can be vertex, element, or uniform buffers.
     * @param outputBuffers - [BufferObjectLike, offset, length][]
     * 
     * @note The number of buffers should match the number of varyings in the TransformFeedback program.
     */
    public static bindOutputBuffers<T extends BufferObject>(
        outputBuffers: [BufferObjectLike<T>, u32, u32][]
    ): void {
        // Bind output buffers to the transform feedback target.
        for (let i = 0; i < outputBuffers.length; i++) {
            let [buffer, offset, length] = outputBuffers[i];
            _gl.bindBufferRange(TransformFeedback.outputTarget, i, buffer.buf, offset, length);
        }
    }
    
    /**
     * Binds the TransformFeedback.
     */
    public bind(): void {
        _gl.bindTransformFeedback(TransformFeedback.target, this.tfbo);
    }

    /**
     * Unbinds the TransformFeedback.
     */
    public unbind(): void {
        _gl.bindTransformFeedback(TransformFeedback.target, null);
    }

    /**
     * Begin transform feedback operation.
     * @param primitive - The primitive type to begin the transform feedback operation with (example: gl.POINTS)
     */
    public begin(primitive: GLVertexComponents): void {
        _gl.beginTransformFeedback(primitive);
    }

    /**
     * End transform feedback operation.
     */
    public end(): void {
        _gl.endTransformFeedback();
    }
}