import { gl } from './Context';

/**
 * Compiles a shader from source code.
 * @param {string} source - The source code of the shader.
 * @param {GLenum} type - The type of shader (VERTEX_SHADER or FRAGMENT_SHADER).
 * @returns {WebGLShader} The compiled shader.
 */
function compileShader(source: string, type: GLenum): WebGLShader {
    const shader = gl.createShader(type) as WebGLShader;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(`Failed to compile shader: ${gl.getShaderInfoLog(shader)}`);
    }
    return shader;
}

/**
 * Creates a shader program from vertex and fragment shaders.
 * @param {WebGLShader} vert - The vertex shader.
 * @param {WebGLShader} frag - The fragment shader.
 * @returns {WebGLProgram} The shader program.
 */
function linkProgram(vert: WebGLShader, frag: WebGLShader): WebGLProgram {
    const program = gl.createProgram() as WebGLProgram;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(`Failed to link program: ${gl.getProgramInfoLog(program)}`);
    }
    return program;
}

/**
 * Creates shader programs from vertex and fragment shader sources.
 * @param {Array<[string, string]>} shaders - Array of vertex and fragment shader source pairs.
 * @returns {WebGLProgram[]} An array of compiled shader programs.
 * @throws If any program throws.
 */
export function createShaderPrograms(shaders: [string, string][]): WebGLProgram[] {
    return shaders.map(([vert, frag]) => {
        const vertShader = compileShader(vert, gl.VERTEX_SHADER);
        const fragShader = compileShader(frag, gl.FRAGMENT_SHADER);
        return linkProgram(vertShader, fragShader);
    });
}