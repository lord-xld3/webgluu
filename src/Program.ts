// Program.ts

import { _gl } from "./Context";

const shaderCache: Map<string, WebGLShader> = new Map();

/**
 * Compiles a shader from source.
 * @param type The type of shader to compile.
 * @param source The source of the shader.
 * @throws {Error} If the shader can't be created or compiled.
*/
function compileShader(
    type: number, 
    source: string
): WebGLShader {

    // Check if the shader has already been compiled
    if (shaderCache.has(source)) {
        return shaderCache.get(source)!;
    }

    // Create shader
    const shader = _gl.createShader(type);
    if (!shader) {
        throw new Error(`Failed to create shader using context: ${_gl}`);
    }

    // Compile shader
    _gl.shaderSource(shader, source);
    _gl.compileShader(shader);
    if (!_gl.getShaderParameter(shader, _gl.COMPILE_STATUS)) {
        throw new Error(`Failed to compile shader: ${_gl.getShaderInfoLog(shader)}`);
    }

    // Cache and return shader
    shaderCache.set(source, shader);
    return shader;
}

function linkProgram(
    program: WebGLProgram,
    [vert, frag]: [string, string],
): void {
    const vertShader = compileShader(_gl.VERTEX_SHADER, vert);
    const fragShader = compileShader(_gl.FRAGMENT_SHADER, frag);
    _gl.attachShader(program, vertShader);
    _gl.attachShader(program, fragShader);
    _gl.linkProgram(program);
    if (!_gl.getProgramParameter(program, _gl.LINK_STATUS)) {
        throw new Error(`Failed to link program: ${_gl.getProgramInfoLog(program)}`);
    }
}

function createProgram(): WebGLProgram {
    const program = _gl.createProgram();
    if (!program) {
        throw new Error(`Failed to create program using context: ${_gl}`);
    }
    return program;
}

/**
 * Creates a WebGL program from a pair [vert, frag] shaders.
 * @param shaders A pair of [vert, frag] shaders.
 */
export function createShaderProgram(
    [vert, frag]: [string, string],
): WebGLProgram {
    const program = createProgram();
    linkProgram(program, [vert, frag]);
    return program;
}


/**
 * Creates an array of WebGL programs from an array of [vert, frag] shader pairs.
 * @param shaders An array of [vert, frag] shader pairs.
 */
export function createShaderPrograms(
    shaders: [string, string][]
): WebGLProgram[] {
    return shaders.map(([vert, frag]) => createShaderProgram([vert, frag]));
}

/**
 * Deletes compiled shaders and clears the shader cache.
 */
export function cleanShaders(): void {
    shaderCache.forEach(shader => _gl.deleteShader(shader));
    shaderCache.clear();
}

/**
 * Creates a WebGL program from a pair [vert, frag] shaders with transform feedback varyings.
 * @param shaders A pair of [vert, frag] shaders.
 * @param varyings The transform feedback varyings.
 * @param interleaved Whether the output buffers are interleaved or separate.
 */
export function createTFBOProgram(
    [vert, frag]: [string, string],
    varyings: string[],
    interleaved: boolean = false,
): WebGLProgram {
    const program = createProgram();
    _gl.transformFeedbackVaryings(program, varyings, interleaved ? _gl.INTERLEAVED_ATTRIBS : _gl.SEPARATE_ATTRIBS);
    linkProgram(program, [vert, frag]);
    return program;
}