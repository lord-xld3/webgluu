import { _gl } from "./Context";
import { GLVertexComponents, u32 } from "./Types";
import { VertexBufferObject } from "./VertexBufferObject";

/**
 * A TransformFeedbackBufferObject (TFBO) processes vertex data and writes the results to buffer objects.
 * It holds no data itself and relies on VertexBufferObjects to input and output data.
 */
export class TransformFeedbackBufferObject {
    private readonly buf: WebGLTransformFeedback;
    static readonly target = WebGL2RenderingContext.TRANSFORM_FEEDBACK;
    static readonly outputTarget = WebGL2RenderingContext.TRANSFORM_FEEDBACK_BUFFER;

    /**
     * Creates a new TransformFeedbackBufferObject.
     * @param outputBuffers - An array of tuples where each tuple contains a VertexBufferObject
     *                        and a binding point (as a number). The VertexBufferObject will store
     *                        the output data from the transform feedback operation.
     * 
     * @note The outputBuffers array must be in the same order as the varyings specified in the shader.
     * @note The outputBuffers should be created with the usage pattern gl.STATIC_COPY.
     * @note The outputBuffers should have the appropriate size for the data being written to them.
     * 
     * @throws {Error} Throws an error if the WebGL context fails to create a transform feedback object.
     */
    constructor(
        outputBuffers: [VertexBufferObject, u32][]
    ) {
        this.buf = _gl.createTransformFeedback()!;
        if (!this.buf) {
            throw new Error(`Failed to create TransformFeedbackBufferObject using context: ${_gl}`);
        }

        this.bind();

        // Bind output buffers to the transform feedback object.
        for (let i = 0; i < outputBuffers.length; i++) {
            let [buffer, binding] = outputBuffers[i];
            _gl.bindBufferBase(TransformFeedbackBufferObject.outputTarget, binding, buffer);
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
     * Start transform feedback operation.
     * @param primitive - The primitive type to start the transform feedback operation with (example: gl.POINTS)
     */
    public start(primitive: GLVertexComponents): void {
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