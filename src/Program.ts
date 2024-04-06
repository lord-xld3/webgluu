// Program.ts

import { _gl } from "./Context";

const shaderCache: Map<string, WebGLShader> = new Map();

function compileShader(
    type: number, 
    source: string
): WebGLShader {
    if (shaderCache.has(source)) {
        return shaderCache.get(source)!;
    }

    const shader = _gl.createShader(type)!;
    _gl.shaderSource(shader, source);
    _gl.compileShader(shader);
    if (!_gl.getShaderParameter(shader, _gl.COMPILE_STATUS)) {
        throw new Error(`Failed to compile shader: ${_gl.getShaderInfoLog(shader)}`);
    }

    shaderCache.set(source, shader);
    return shader;
}

/**
 * Creates a WebGL program from a [vert, frag] shader pair.
 * @returns The compiled WebGL program.
 * @throws {Error} If the program fails to link or compile.
 */
export function createProgram(
    [vert, frag]: [string, string]
): WebGLProgram {
    const program = _gl.createProgram()!;
    const vertShader = compileShader(_gl.VERTEX_SHADER, vert);
    const fragShader = compileShader(_gl.FRAGMENT_SHADER, frag);
    _gl.attachShader(program, vertShader);
    _gl.attachShader(program, fragShader);
    _gl.linkProgram(program);
    if (!_gl.getProgramParameter(program, _gl.LINK_STATUS)) {
        throw new Error(`Failed to link program: ${_gl.getProgramInfoLog(program)}`);
    }
    return program;
}

/**
 * Creates an array of WebGL programs from an array of [vert, frag] shader pairs.
 * @param shaders An array of [vert, frag] shader pairs.
 */
export function createPrograms(
    shaders: [string, string][]
): WebGLProgram[] {
    const programs = [];

    for (let i=0; i<shaders.length; i++) {
        try {
            programs.push(createProgram(shaders[i]));
        } catch (e) {
            console.error(e);
        }
    }

    return programs;
}

/**
 * Deletes compiled shaders and clears the shader cache.
 */
export function cleanShaders(): void {
    shaderCache.forEach(shader => _gl.deleteShader(shader));
    shaderCache.clear();
}