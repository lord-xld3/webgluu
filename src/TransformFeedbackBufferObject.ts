import { BufferObject } from "./BufferObject";
import { _gl } from "./Context";
import { GLVertexComponents, u32, BufferObjectLike } from "./Types";

/**
 * A TransformFeedbackBufferObject (TFBO) processes vertex data and writes the results to buffer objects.
 * It holds no data itself and relies on BufferObjects to input and output data.
 */
export class TransformFeedbackBufferObject<T extends BufferObject> {
    private readonly buf: WebGLTransformFeedback;
    static readonly target = WebGL2RenderingContext.TRANSFORM_FEEDBACK;
    static readonly outputTarget = WebGL2RenderingContext.TRANSFORM_FEEDBACK_BUFFER;

    /**
     * Creates a new TransformFeedbackBufferObject.
     * @param outputBuffers - [BufferObjectLike, offset, size][]
     */
    constructor(
        outputBuffers: [BufferObjectLike<T>, u32, u32][]
    ) {
        this.buf = _gl.createTransformFeedback()!;
        if (!this.buf) {
            throw new Error(`Failed to create TransformFeedbackBufferObject using context: ${_gl}`);
        }

        this.bind();

        // Bind output buffers to the transform feedback object.
        for (let i = 0; i < outputBuffers.length; i++) {
            let [buffer, offset, size] = outputBuffers[i];
            _gl.bindBufferRange(TransformFeedbackBufferObject.outputTarget, i, buffer.buf, offset, size);
        }
    }
    
    /**
     * Binds the TransformFeedbackBufferObject.
     */
    public bind(): void {
        _gl.bindTransformFeedback(TransformFeedbackBufferObject.target, this.buf);
    }

    /**
     * Unbinds the TransformFeedbackBufferObject.
     */
    public unbind(): void {
        _gl.bindTransformFeedback(TransformFeedbackBufferObject.target, null);
    }

    /**
     * Begin transform feedback operation.
     * @param primitive - The primitive type to begin the transform feedback operation with (example: gl.POINTS)
     */
    public begin(primitive: GLVertexComponents): void {
        this.bind();
        _gl.beginTransformFeedback(primitive);
    }

    /**
     * Ends a transform feedback operation and unbinds the TransformFeedbackBufferObject.
     */
    public end(): void {
        _gl.endTransformFeedback();
        this.unbind();
    }
}