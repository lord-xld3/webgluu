import { _gl } from './Context';

// Compiled shader cache
const shaderCache: Map<string, WebGLShader> = new Map();

/**
 * Compiles a shader from source code.
 * @param {string} source - The source code of the shader.
 * @param {GLenum} type - The type of shader (VERTEX_SHADER or FRAGMENT_SHADER).
 * @returns {WebGLShader} The compiled shader.
 */
function compileShader(source: string, type: GLenum): WebGLShader {
    // Check if the shader has already been compiled
    if (shaderCache.has(source)) {
        return shaderCache.get(source)!;
    }

    const shader = _gl.createShader(type) as WebGLShader;
    _gl.shaderSource(shader, source);
    _gl.compileShader(shader);
    if (!_gl.getShaderParameter(shader, _gl.COMPILE_STATUS)) {
        throw new Error(`Failed to compile shader: ${_gl.getShaderInfoLog(shader)}`);
    }

    // Cache the compiled shader
    shaderCache.set(source, shader);
    return shader;
}

/**
 * Creates a shader program from vertex and fragment shaders.
 * @param {WebGLShader} vert - The vertex shader.
 * @param {WebGLShader} frag - The fragment shader.
 * @returns {WebGLProgram} The shader program.
 */
function linkProgram(vert: WebGLShader, frag: WebGLShader): WebGLProgram {
    const program = _gl.createProgram() as WebGLProgram;
    _gl.attachShader(program, vert);
    _gl.attachShader(program, frag);
    _gl.linkProgram(program);
    if (!_gl.getProgramParameter(program, _gl.LINK_STATUS)) {
        throw new Error(`Failed to link program: ${_gl.getProgramInfoLog(program)}`);
    }
    
    // Clean up shaders
    _gl.deleteShader(vert);
    _gl.deleteShader(frag);
    return program;
}

/**
 * Creates shader programs from vertex and fragment shader sources.
 * @param {Array<[string, string]>} shaders - Array of vertex and fragment shader source pairs.
 * @returns {WebGLProgram[]} An array of compiled shader programs.
 * @throws If any program throws.
 */
export function createShaderPrograms(
    shaders: { vert: string, frag: string }[]
): WebGLProgram[] {
    return shaders.map(({ vert, frag }) => {
        const vertShader = compileShader(vert, _gl.VERTEX_SHADER);
        const fragShader = compileShader(frag, _gl.FRAGMENT_SHADER);
        return linkProgram(vertShader, fragShader);
    });
}