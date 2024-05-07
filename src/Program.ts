// Program.ts

import { _gl } from "./Context";
import { GLVertexTypes } from "./Types";

/**
 * A cache of compiled shaders.
 */
const _shaderCache = new Map<string, WebGLShader>();

/**
 * Information about an attribute queried from a shader program.
 * @note [location, size, type]
 */
export type AttributeInfo = [GLint, GLint, GLenum];

/**
 * A map of attribute information.
 * @note Map<attributeName, [location, size, type]>
 */
export type AttributeInfoMap = Map<string, AttributeInfo>;

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
    if (_shaderCache.has(source)) {
        return _shaderCache.get(source)!;
    }

    // Create shader
    const shader = _gl.createShader(type)!;
    if (!shader) {
        console.error(`Failed to create shader using context: ${_gl}`);
    }

    // Compile shader
    _gl.shaderSource(shader, source);
    _gl.compileShader(shader);
    if (!_gl.getShaderParameter(shader, _gl.COMPILE_STATUS)) {
        console.error(`Failed to compile shader: ${_gl.getShaderInfoLog(shader)}`);
    }

    // Cache and return shader
    _shaderCache.set(source, shader);
    return shader;
}

/**
 * Links a program with a pair of [vert, frag] shaders.
 * @param program The program to link.
 * @param vert The vertex shader source.
 * @param frag The fragment shader source.
 * @throws {Error} If the program can't be linked.
 */
function linkProgram(
    program: WebGLProgram,
    vert: string,
    frag: string,
): void {
    const vertShader = compileShader(_gl.VERTEX_SHADER, vert);
    const fragShader = compileShader(_gl.FRAGMENT_SHADER, frag);
    _gl.attachShader(program, vertShader);
    _gl.attachShader(program, fragShader);
    _gl.linkProgram(program);
    if (!_gl.getProgramParameter(program, _gl.LINK_STATUS)) {
        console.error(`Failed to link program: ${_gl.getProgramInfoLog(program)}`);
    }
}

/**
 * Creates a WebGL program.
 */
function createProgram(): WebGLProgram {
    const program = _gl.createProgram()!;
    if (!program) {
        console.error(`Failed to create program using context: ${_gl}`);
    }
    return program;
}

/**
 * Creates a WebGL program from a vertex and fragment shader source.
 * @param vert The vertex shader source.
 * @param frag The fragment shader source.
 */
export function createShaderProgram(
    vert: string,
    frag: string,
): WebGLProgram {
    const program = createProgram();
    linkProgram(program, vert, frag);
    return program;
}

/**
 * Creates an array of WebGL programs from an array of [vert, frag] shader pairs.
 * @param shaders An array of [vert, frag] shader pairs.
 */
export function createShaderPrograms(
    shaders: [string, string][]
): WebGLProgram[] {
    return shaders.map(([vert, frag]) => createShaderProgram(vert, frag));
}

/**
 * Deletes compiled shaders and clears the shader cache.
 */
export function cleanShaders(): void {
    _shaderCache.forEach(shader => _gl.deleteShader(shader));
    _shaderCache.clear();
}

/**
 * Creates a WebGL program from a vertex shader source and an array of varyings.
 * @param shader The vertex shader source.
 * @param varyings The varyings to output.
 * @param interleaved Whether the varyings are interleaved. (default: false)
 */
export function createTransformFeedbackProgram(
    shader: string,
    varyings: string[],
    interleaved: boolean = false,
): WebGLProgram {
    const program = createProgram();
    _gl.transformFeedbackVaryings(program, varyings, interleaved ? _gl.INTERLEAVED_ATTRIBS : _gl.SEPARATE_ATTRIBS);
    linkProgram(program, shader, `#version 300 es\nprecision highp float;\nvoid main() {}`);
    return program;
}

/**
 * Retrieves all attributes from a shader program.
 * 
 * @returns Map<attributeName, [location, size, type]>
 */
export function getAllAttributes(program: WebGLProgram): AttributeInfoMap{
    const attributeCount = _gl.getProgramParameter(program, _gl.ACTIVE_ATTRIBUTES);
    const attributeInfoMap = new Map<string, AttributeInfo>();
    for (let i = 0; i < attributeCount; i++) {
        const info = _gl.getActiveAttrib(program, i)!;
        const [size, type] = GLVertexTypes[info.type];
        if (!size || !type) {
            console.error(`Failed to get size or type for attribute type: ${info.type}`);
        }
        attributeInfoMap.set(
            info.name, // Attribute name
            [
                _gl.getAttribLocation(program, info.name), // Location
                size, // Size
                type, // Type
            ],
        );
    }
    return attributeInfoMap;
}