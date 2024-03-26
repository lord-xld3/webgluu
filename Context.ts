import { u32 } from "./Types";

/**
 * A WebGL2 context with extended functionality.
 */
interface GluuContext extends WebGL2RenderingContext {
    /**
     * Resizes the canvas/viewport to match client size.
     * @note
     * On an OffscreenCanvas, everything defaults to 0.
     */
    resize(): void;
    /**
     * Resizes the canvas/viewport to given dimensions.
     * @param width - The width of the viewport.
     * @param height - The height of the viewport.
     * @throws Viewport dimensions must be positive.
     */
    resize(width?: u32, height?: u32): void;
    /**
     * Resizes the canvas/viewport to given dimensions.
     * @param width - The width of the viewport.
     * @param height - The height of the viewport.
     * @param x - The horizontal coordinate for the lower left corner of the viewport origin. Default: 0.
     * @param y - The vertical coordinate for the lower left corner of the viewport origin. Default: 0.
     * @throws Viewport dimensions must be positive.
     */
    resize(width?: u32, height?: u32, x?: u32, y?: u32): void;
}

/**
 * The current GluuContext.
 */
export var gl: GluuContext;

/**
 * Sets the current GluuContext.
 * @param context - The GluuContext to use.
 */
export function useContext(
    context: GluuContext,
): void {
    gl = context;
}

/**
 * Creates a WebGL2 context with extended functionality.
 * @param canvas - The canvas element to associate with the GL context.
 * @throws If it fails to get a WebGL2 context, throws an error.
 */
export function createContext(
    canvas: HTMLCanvasElement | OffscreenCanvas,
): GluuContext {
    const gl = canvas.getContext("webgl2") as GluuContext;
    if (!gl) {
        throw new Error("Failed to get WebGL2 context");
    }

    if (canvas instanceof HTMLCanvasElement) {
        gl.resize = function (
            width?: u32, 
            height?: u32, 
            x: u32 = 0, 
            y: u32 = 0,
        ) {
            canvas.width = width ?? canvas.clientWidth;
            canvas.height = height ?? canvas.clientHeight;
            gl.viewport(x, y, canvas.width, canvas.height);
        }
    } else {
        gl.resize = function (
            width: u32 = 0, 
            height: u32 = 0, 
            x: u32 = 0, 
            y: u32 = 0,
        ) {
            canvas.width = width;
            canvas.height = height;
            gl.viewport(x, y, canvas.width, canvas.height);
        }
    }

    return gl;
}