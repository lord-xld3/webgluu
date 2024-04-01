import { u32 } from "./Types";

export function init(
    canvas: HTMLCanvasElement | OffscreenCanvas, 
    options?: WebGLContextAttributes
): GluuContext {
    _gl = canvas.getContext('webgl2', options) as WebGL2RenderingContext;
    if (!_gl) {
        throw new Error('WebGL2 is not supported');
    }

    let resize: ResizeFunction = (canvas instanceof HTMLCanvasElement)? 
        (
            width: u32 = canvas.clientWidth,
            height: u32 = canvas.clientHeight,
            x: u32 = 0,
            y: u32 = 0,
        ): void => {
            canvas.width = width;
            canvas.height = height;
            _gl.viewport(x, y, width, height);
        }
    : (
        width: u32 = canvas.width,
        height: u32 = canvas.height,
        x: u32 = 0,
        y: u32 = 0,
    ): void => {
        canvas.width = width;
        canvas.height = height;
        _gl.viewport(x, y, width, height);
    }

    return {
        resize,
    };
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

interface GluuContext {
    resize: ResizeFunction;
}

export let _gl: WebGL2RenderingContext;
export let _program: WebGLProgram;

export function getContext(): WebGL2RenderingContext {
    return _gl;
}

export function getProgram(): WebGLProgram {
    return _program;
}

export function setContext(gl: WebGL2RenderingContext): void {
    _gl = gl;
}

export function setProgram(program: WebGLProgram): void {
    _program = program;
}