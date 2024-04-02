import { u32 } from "./Types";

/**
 * Initializes a WebGL2 context with extended functionality.
 * @param canvas - The canvas element to use.
 * @param options - The WebGL context attributes to use.
 * @returns GluuContext - A custom WebGL2 context.
 */
export function init(
    canvas: HTMLCanvasElement | OffscreenCanvas, 
    options?: WebGLContextAttributes
): GluuContext {
    const gl = canvas.getContext('webgl2', options) as GluuContext;
    if (!gl) {
        throw new Error(`Failed to get WebGL2 context on canvas: ${canvas}, with options: ${options}`);
    }

    // Appropriate use of a ternary.
    gl.resize = (canvas instanceof HTMLCanvasElement) ? 
        (
            width: u32 = canvas.clientWidth,
            height: u32 = canvas.clientHeight,
            x: u32 = 0,
            y: u32 = 0,
        ): void => {
            canvas.width = width;
            canvas.height = height;
            gl.viewport(x, y, width, height);
        }
    : (
        width: u32 = canvas.width,
        height: u32 = canvas.height,
        x: u32 = 0,
        y: u32 = 0,
    ): void => {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(x, y, width, height);
    }
    
    // yeah so we're assigning a GluuContext to a WebGL2RenderingContext...
    // but it just works... for now.
    
    // UNSAFE: Not sure if anything requires a specific "instanceof WebGL2RenderingContext", but if so, this could break.
    _gl = gl;
    return gl;
}

type ResizeFunction = {
    /**
     * Resizes the viewport & canvas to match client dimensions.
     */
    (): void;

    /**
     * Resizes the viewport & canvas to the specified dimensions.
     * @param width - The new width.
     * @param height - The new height.
     */
    (width: u32, height: u32): void;

    /**
     * Resizes the viewport & canvas to the specified dimensions and position.
     * @param width - The new width.
     * @param height - The new height.
     * @param x - The new x position.
     * @param y - The new y position.
     */
    (width: u32, height: u32, x: u32, y: u32): void;
}

interface GluuContext extends WebGL2RenderingContext {
    resize: ResizeFunction;
}

/**
 * Global context. Use getContext() or setContext() to access.
 */
export let _gl: WebGL2RenderingContext;

/**
 * Global program. Use getProgram() or setProgram() to access.
 */
export let _program: WebGLProgram;

/**
 * Returns the global WebGL2 context.
 */
export function getContext(): WebGL2RenderingContext {
    return _gl;
}

/**
 * Returns the global program.
 */
export function getProgram(): WebGLProgram {
    return _program;
}

/**
 * Sets the global WebGL2 context.
 * @param gl - The WebGL2 context to set.
 */
export function setContext(gl: WebGL2RenderingContext): void {
    _gl = gl;
}

/**
 * Sets the global program.
 * @param program - The program to set.
 */
export function setProgram(program: WebGLProgram): void {
    _program = program;
}