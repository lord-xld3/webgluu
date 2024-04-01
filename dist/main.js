/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./main.js":
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _index_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.ts */ \"./index.ts\");\n\nconst gl = _index_ts__WEBPACK_IMPORTED_MODULE_0__.createContext(document.getElementById('webgl-canvas'));\n_index_ts__WEBPACK_IMPORTED_MODULE_0__.useContext(gl);\n\nconst programs = _index_ts__WEBPACK_IMPORTED_MODULE_0__.createShaderPrograms([\n`#version 300 es\nattribute vec4 a_position;\nvoid main() {\ngl_Position = a_position;\n};`,\n`#version 300 es\nvoid main() {\ngl_FragColor = vec4(1, 0, 0, 1);\n};`\n]);\n\nconst program = programs[0];\n\nconst vao = new _index_ts__WEBPACK_IMPORTED_MODULE_0__.VertexArrayObject(\n    new _index_ts__WEBPACK_IMPORTED_MODULE_0__.VertexBufferObject(\n        program,\n        new Float32Array([\n            -0.5, -0.5,\n            0.5, -0.5,\n            0.0, 0.5\n        ]), \n        [{\n            attribute: 'a_position',\n            size: 2,\n        }]\n    )\n);\n\ngl.clearColor(1, 0, 0, 1);\ngl.clear(gl.COLOR_BUFFER_BIT);\nvao.bind();\ngl.drawArrays(gl.TRIANGLES, 0, 3);\n\n//# sourceURL=webpack:///./main.js?");

/***/ }),

/***/ "./style.css":
/*!*******************!*\
  !*** ./style.css ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack:///./style.css?");

/***/ }),

/***/ "./BufferObject.ts":
/*!*************************!*\
  !*** ./BufferObject.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ElementBufferObject: () => (/* binding */ ElementBufferObject),\n/* harmony export */   UniformBufferObject: () => (/* binding */ UniformBufferObject),\n/* harmony export */   VertexBufferObject: () => (/* binding */ VertexBufferObject)\n/* harmony export */ });\n/* harmony import */ var _Context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Context */ \"./Context.ts\");\nvar __extends = (undefined && undefined.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        if (typeof b !== \"function\" && b !== null)\n            throw new TypeError(\"Class extends value \" + String(b) + \" is not a constructor or null\");\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nvar __assign = (undefined && undefined.__assign) || function () {\n    __assign = Object.assign || function(t) {\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\n            s = arguments[i];\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\n                t[p] = s[p];\n        }\n        return t;\n    };\n    return __assign.apply(this, arguments);\n};\n\n/**\n * A GL \"BufferObject\" has a valid buffer of data and describes how to use that buffer.\n */\nvar BufferObject = /** @class */ (function () {\n    /**\n     * Creates a BufferObject.\n     * @param target - Binding point of the BufferObject.\n     * @param usage - Data usage pattern (default: gl.STATIC_DRAW).\n     * @link\n     * [bindBuffer()](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)\n     */\n    function BufferObject(target, usage) {\n        if (usage === void 0) { usage = _Context__WEBPACK_IMPORTED_MODULE_0__.gl.STATIC_DRAW; }\n        this.buf = _Context__WEBPACK_IMPORTED_MODULE_0__.gl.createBuffer();\n        if (!this.buf) {\n            throw new Error(\"\".concat(this, \" Failed to create BufferObject using context: \").concat(_Context__WEBPACK_IMPORTED_MODULE_0__.gl));\n        }\n        this.target = target;\n        this.usage = usage;\n    }\n    /**\n     * Binds the BufferObject with bindBuffer()\n     */\n    BufferObject.prototype.bind = function () {\n        _Context__WEBPACK_IMPORTED_MODULE_0__.gl.bindBuffer(this.target, this.buf);\n    };\n    /**\n     * Unbinds the BufferObject with bindBuffer()\n     */\n    BufferObject.prototype.unbind = function () {\n        _Context__WEBPACK_IMPORTED_MODULE_0__.gl.bindBuffer(this.target, null);\n    };\n    /**\n     * Set the contents of the buffer.\n     * @param data - The data to be copied into the buffer.\n     */\n    BufferObject.prototype.setBuffer = function (data) {\n        _Context__WEBPACK_IMPORTED_MODULE_0__.gl.bufferData(this.target, data, this.usage);\n    };\n    /**\n     * Updates a subset of the buffer's data store.\n     * @param data - The data to be copied into the buffer.\n     * @param dstOffset - The destination offset in bytes. Default: 0.\n     * @param srcOffset - The source offset in bytes. Default: 0.\n     * @param length - The length of the data to be copied in bytes. Default: data.byteLength.\n     */\n    BufferObject.prototype.setSubBuffer = function (data, dstOffset, srcOffset, length) {\n        if (dstOffset === void 0) { dstOffset = 0; }\n        if (srcOffset === void 0) { srcOffset = 0; }\n        if (length === void 0) { length = data.byteLength; }\n        _Context__WEBPACK_IMPORTED_MODULE_0__.gl.bufferSubData(this.target, dstOffset, data, srcOffset, length);\n    };\n    return BufferObject;\n}());\n/**\n * An Element BufferObject (EBO) targets gl.ELEMENT_ARRAY_BUFFER.\n */\nvar ElementBufferObject = /** @class */ (function (_super) {\n    __extends(ElementBufferObject, _super);\n    /**\n     * Creates a new ElementBufferObject.\n     * @param data - The data buffer.\n     * @param usage - Data usage pattern (default: gl.STATIC_DRAW).\n     */\n    function ElementBufferObject(data, usage) {\n        var _this = _super.call(this, ElementBufferObject.target, usage) || this;\n        _this.bind();\n        _this.setBuffer(data);\n        return _this;\n    }\n    ElementBufferObject.target = _Context__WEBPACK_IMPORTED_MODULE_0__.gl.ELEMENT_ARRAY_BUFFER;\n    return ElementBufferObject;\n}(BufferObject));\n\n/**\n * Represents a Vertex Buffer Object (VBO) for storing and managing vertex attribute data.\n */\nvar VertexBufferObject = /** @class */ (function (_super) {\n    __extends(VertexBufferObject, _super);\n    /**\n     * Creates a new VertexBufferObject.\n     *\n     * @param {WebGLProgram} program - The shader program associated with the VBO.\n     * @param {ArrayBufferView} data - The data buffer.\n     * @param {Object[]} attributes - Information about vertex attribute pointers.\n     * @param {GLenum} [usage=gl.STATIC_DRAW] - Data usage pattern.\n     */\n    function VertexBufferObject(program, data, attributes, usage) {\n        // Verify attributes and map default values to pointers.\n        var _this = _super.call(this, VertexBufferObject.target, usage) || this;\n        _this.ptrs = attributes.map(function (ptr) {\n            var _a, _b, _c, _d;\n            var index = _Context__WEBPACK_IMPORTED_MODULE_0__.gl.getAttribLocation(program, ptr.attribute);\n            if (index === -1) {\n                throw new Error(\"Attribute \\\"\".concat(ptr.attribute, \"\\\" not found in program: \").concat(program));\n            }\n            return __assign(__assign({ index: index }, ptr), { type: (_a = ptr.type) !== null && _a !== void 0 ? _a : _Context__WEBPACK_IMPORTED_MODULE_0__.gl.FLOAT, normalized: (_b = ptr.normalized) !== null && _b !== void 0 ? _b : false, stride: (_c = ptr.stride) !== null && _c !== void 0 ? _c : 0, offset: (_d = ptr.offset) !== null && _d !== void 0 ? _d : 0 });\n        });\n        // Bind VBO, copy data, and enable all attribute pointers.\n        _this.bind();\n        _this.setBuffer(data);\n        return _this;\n    }\n    /**\n     * Binds the VBO and binds all attribute pointers.\n     */\n    VertexBufferObject.prototype.bind = function () {\n        _super.prototype.bind.call(this);\n        this.ptrs.forEach(function (ptr) {\n            _Context__WEBPACK_IMPORTED_MODULE_0__.gl.vertexAttribPointer(ptr.index, ptr.size, ptr.type, ptr.normalized, ptr.stride, ptr.offset);\n        });\n    };\n    VertexBufferObject.prototype.modifyAttribute = function (attribute, enable) {\n        var ptr = this.ptrs.find(function (p) { return p.attribute === attribute; });\n        if (!ptr) {\n            throw new Error(\"Attribute \\\"\".concat(attribute, \"\\\" not found in VBO: \").concat(this, \".\"));\n        }\n        if (enable !== undefined) {\n            if (enable) {\n                _Context__WEBPACK_IMPORTED_MODULE_0__.gl.enableVertexAttribArray(ptr.index);\n            }\n            else {\n                _Context__WEBPACK_IMPORTED_MODULE_0__.gl.disableVertexAttribArray(ptr.index);\n            }\n        }\n    };\n    VertexBufferObject.target = _Context__WEBPACK_IMPORTED_MODULE_0__.gl.ARRAY_BUFFER;\n    return VertexBufferObject;\n}(BufferObject));\n\n/**\n * A Uniform BufferObject (UBO) targets gl.UNIFORM_BUFFER.\n */\nvar UniformBufferObject = /** @class */ (function (_super) {\n    __extends(UniformBufferObject, _super);\n    /**\n     * Creates a new UniformBufferObject.\n     * @param program - The shader program associated with the UBO.\n     * @param blockName - The name of the uniform block.\n     * @param data - The data buffer.\n     * @param binding - The binding index for the uniform block.\n     * @param usage - Data usage pattern (default: gl.STATIC_DRAW).\n     */\n    function UniformBufferObject(program, blockName, data, binding, usage) {\n        var _this = _super.call(this, UniformBufferObject.target, usage) || this;\n        _this.blockIndex = _Context__WEBPACK_IMPORTED_MODULE_0__.gl.getUniformBlockIndex(program, blockName);\n        if (_this.blockIndex === _Context__WEBPACK_IMPORTED_MODULE_0__.gl.INVALID_INDEX) {\n            throw new Error(\"Uniform block \\\"\".concat(blockName, \"\\\" not found in program: \").concat(program));\n        }\n        _this.bind();\n        _this.setBuffer(data);\n        _Context__WEBPACK_IMPORTED_MODULE_0__.gl.uniformBlockBinding(program, _this.blockIndex, binding);\n        return _this;\n    }\n    UniformBufferObject.prototype.bind = function () {\n        _super.prototype.bind.call(this);\n        _Context__WEBPACK_IMPORTED_MODULE_0__.gl.bindBufferBase(UniformBufferObject.target, this.blockIndex, this.buf);\n    };\n    UniformBufferObject.prototype.unbind = function () {\n        _Context__WEBPACK_IMPORTED_MODULE_0__.gl.bindBufferBase(UniformBufferObject.target, this.blockIndex, null);\n        _super.prototype.unbind.call(this);\n    };\n    UniformBufferObject.prototype.setBuffer = function (data) {\n        // Workaround for alignment issues on some devices, pads buffer to 16 byte alignment.\n        var alignedSize = (data.byteLength + 15) & ~15;\n        var alignedBuffer = new data.constructor(alignedSize);\n        alignedBuffer.set(data);\n        _super.prototype.setBuffer.call(this, alignedBuffer);\n    };\n    UniformBufferObject.target = _Context__WEBPACK_IMPORTED_MODULE_0__.gl.UNIFORM_BUFFER;\n    return UniformBufferObject;\n}(BufferObject));\n\n\n\n//# sourceURL=webpack:///./BufferObject.ts?");

/***/ }),

/***/ "./Context.ts":
/*!********************!*\
  !*** ./Context.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createContext: () => (/* binding */ createContext),\n/* harmony export */   gl: () => (/* binding */ gl),\n/* harmony export */   useContext: () => (/* binding */ useContext)\n/* harmony export */ });\n/**\n * The current GluuContext.\n */\nvar gl = {};\n/**\n * Sets the current GluuContext.\n * @param context - The GluuContext to use.\n */\nfunction useContext(context) {\n    gl = context;\n}\n/**\n * Creates a WebGL2 context with extended functionality.\n * @param canvas - The canvas element to associate with the GL context.\n * @throws If it fails to get a WebGL2 context, throws an error.\n */\nfunction createContext(canvas) {\n    var gl = canvas.getContext(\"webgl2\");\n    if (!gl) {\n        throw new Error(\"Failed to get WebGL2 context\");\n    }\n    gl.resize = (canvas instanceof HTMLCanvasElement) ?\n        function (width, height, x, y) {\n            if (width === void 0) { width = canvas.clientWidth; }\n            if (height === void 0) { height = canvas.clientHeight; }\n            if (x === void 0) { x = 0; }\n            if (y === void 0) { y = 0; }\n            gl.viewport(x, y, width, height);\n        }\n        : function (width, height, x, y) {\n            if (width === void 0) { width = 0; }\n            if (height === void 0) { height = 0; }\n            if (x === void 0) { x = 0; }\n            if (y === void 0) { y = 0; }\n            gl.viewport(x, y, width, height);\n        };\n    return gl;\n}\n\n\n//# sourceURL=webpack:///./Context.ts?");

/***/ }),

/***/ "./Program.ts":
/*!********************!*\
  !*** ./Program.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createShaderPrograms: () => (/* binding */ createShaderPrograms)\n/* harmony export */ });\n/* harmony import */ var _Context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Context */ \"./Context.ts\");\n\n/**\n * Compiles a shader from source code.\n * @param {string} source - The source code of the shader.\n * @param {GLenum} type - The type of shader (VERTEX_SHADER or FRAGMENT_SHADER).\n * @returns {WebGLShader} The compiled shader.\n */\nfunction compileShader(source, type) {\n    var shader = _Context__WEBPACK_IMPORTED_MODULE_0__.gl.createShader(type);\n    _Context__WEBPACK_IMPORTED_MODULE_0__.gl.shaderSource(shader, source);\n    _Context__WEBPACK_IMPORTED_MODULE_0__.gl.compileShader(shader);\n    if (!_Context__WEBPACK_IMPORTED_MODULE_0__.gl.getShaderParameter(shader, _Context__WEBPACK_IMPORTED_MODULE_0__.gl.COMPILE_STATUS)) {\n        throw new Error(\"Failed to compile shader: \".concat(_Context__WEBPACK_IMPORTED_MODULE_0__.gl.getShaderInfoLog(shader)));\n    }\n    return shader;\n}\n/**\n * Creates a shader program from vertex and fragment shaders.\n * @param {WebGLShader} vert - The vertex shader.\n * @param {WebGLShader} frag - The fragment shader.\n * @returns {WebGLProgram} The shader program.\n */\nfunction linkProgram(vert, frag) {\n    var program = _Context__WEBPACK_IMPORTED_MODULE_0__.gl.createProgram();\n    _Context__WEBPACK_IMPORTED_MODULE_0__.gl.attachShader(program, vert);\n    _Context__WEBPACK_IMPORTED_MODULE_0__.gl.attachShader(program, frag);\n    _Context__WEBPACK_IMPORTED_MODULE_0__.gl.linkProgram(program);\n    if (!_Context__WEBPACK_IMPORTED_MODULE_0__.gl.getProgramParameter(program, _Context__WEBPACK_IMPORTED_MODULE_0__.gl.LINK_STATUS)) {\n        throw new Error(\"Failed to link program: \".concat(_Context__WEBPACK_IMPORTED_MODULE_0__.gl.getProgramInfoLog(program)));\n    }\n    return program;\n}\n/**\n * Creates shader programs from vertex and fragment shader sources.\n * @param {Array<[string, string]>} shaders - Array of vertex and fragment shader source pairs.\n * @returns {WebGLProgram[]} An array of compiled shader programs.\n * @throws If any program throws.\n */\nfunction createShaderPrograms(shaders) {\n    return shaders.map(function (_a) {\n        var vert = _a[0], frag = _a[1];\n        var vertShader = compileShader(vert, _Context__WEBPACK_IMPORTED_MODULE_0__.gl.VERTEX_SHADER);\n        var fragShader = compileShader(frag, _Context__WEBPACK_IMPORTED_MODULE_0__.gl.FRAGMENT_SHADER);\n        return linkProgram(vertShader, fragShader);\n    });\n}\n\n\n//# sourceURL=webpack:///./Program.ts?");

/***/ }),

/***/ "./Types.ts":
/*!******************!*\
  !*** ./Types.ts ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\n\n\n//# sourceURL=webpack:///./Types.ts?");

/***/ }),

/***/ "./VertexArrayObject.ts":
/*!******************************!*\
  !*** ./VertexArrayObject.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   VertexArrayObject: () => (/* binding */ VertexArrayObject)\n/* harmony export */ });\n/* harmony import */ var _Context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Context */ \"./Context.ts\");\n\n/**\n * A Vertex Array Object (VAO) encapsulates a vertex buffer object (VBO) and an optional element buffer object (EBO).\n */\nvar VertexArrayObject = /** @class */ (function () {\n    /**\n     * Creates a new VertexArrayObject.\n     * @param draw - The draw function.\n     * @param vbo - The VertexBufferObject to encapsulate.\n     * @param ebo - The ElementBufferObject to encapsulate (optional).\n     */\n    function VertexArrayObject(vbo, ebo) {\n        this.vao = _Context__WEBPACK_IMPORTED_MODULE_0__.gl.createVertexArray();\n        this.bind();\n        vbo.bind();\n        ebo === null || ebo === void 0 ? void 0 : ebo.bind();\n        this.unbind();\n        ebo === null || ebo === void 0 ? void 0 : ebo.unbind();\n    }\n    /**\n     * Binds the VertexArrayObject.\n     */\n    VertexArrayObject.prototype.bind = function () {\n        _Context__WEBPACK_IMPORTED_MODULE_0__.gl.bindVertexArray(this.vao);\n        _Context__WEBPACK_IMPORTED_MODULE_0__.gl.enableVertexAttribArray(0);\n    };\n    /**\n     * Unbinds the VertexArrayObject.\n     */\n    VertexArrayObject.prototype.unbind = function () {\n        _Context__WEBPACK_IMPORTED_MODULE_0__.gl.bindVertexArray(null);\n    };\n    return VertexArrayObject;\n}());\n\n\n\n//# sourceURL=webpack:///./VertexArrayObject.ts?");

/***/ }),

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ElementBufferObject: () => (/* reexport safe */ _BufferObject__WEBPACK_IMPORTED_MODULE_3__.ElementBufferObject),\n/* harmony export */   UniformBufferObject: () => (/* reexport safe */ _BufferObject__WEBPACK_IMPORTED_MODULE_3__.UniformBufferObject),\n/* harmony export */   VertexArrayObject: () => (/* reexport safe */ _VertexArrayObject__WEBPACK_IMPORTED_MODULE_2__.VertexArrayObject),\n/* harmony export */   VertexBufferObject: () => (/* reexport safe */ _BufferObject__WEBPACK_IMPORTED_MODULE_3__.VertexBufferObject),\n/* harmony export */   createContext: () => (/* reexport safe */ _Context__WEBPACK_IMPORTED_MODULE_0__.createContext),\n/* harmony export */   createShaderPrograms: () => (/* reexport safe */ _Program__WEBPACK_IMPORTED_MODULE_1__.createShaderPrograms),\n/* harmony export */   gl: () => (/* reexport safe */ _Context__WEBPACK_IMPORTED_MODULE_0__.gl),\n/* harmony export */   useContext: () => (/* reexport safe */ _Context__WEBPACK_IMPORTED_MODULE_0__.useContext)\n/* harmony export */ });\n/* harmony import */ var _Context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Context */ \"./Context.ts\");\n/* harmony import */ var _Program__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Program */ \"./Program.ts\");\n/* harmony import */ var _VertexArrayObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VertexArrayObject */ \"./VertexArrayObject.ts\");\n/* harmony import */ var _BufferObject__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./BufferObject */ \"./BufferObject.ts\");\n/* harmony import */ var _Types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Types */ \"./Types.ts\");\n\n\n\n\n\n\n\n//# sourceURL=webpack:///./index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	__webpack_require__("./main.js");
/******/ 	var __webpack_exports__ = __webpack_require__("./style.css");
/******/ 	
/******/ })()
;