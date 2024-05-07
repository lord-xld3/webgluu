import * as Gluu from '../index';
import { mat4 } from 'gl-matrix';

function main() {
    const gl = Gluu.init(document.getElementById('canvas') as HTMLCanvasElement);

    const tfbProgram = Gluu.createTransformFeedbackProgram(
        // Transform feedback shader
        `#version 300 es
        precision highp float;

        in vec2 t_position;
        in vec2 t_velocity;

        uniform float u_time;
        uniform vec2 u_resolution;

        out vec2 t_outPosition;

        vec2 canvasModulo(vec2 n, vec2 m) {
            return mod(mod(n, m) + m, m);
        }

        void main() {
            t_outPosition = canvasModulo(
                t_position + t_velocity * u_time, 
                u_resolution
            );
        }`,

        ['t_outPosition']
    );

    const shaderProgram = Gluu.createShaderProgram(
        // Vertex shader
        `#version 300 es
        precision highp float;

        in vec4 v_position;

        uniform mat4 u_matrix;

        void main() {
            gl_Position = u_matrix * v_position;
            gl_PointSize = 10.0;
        }`,

        // Fragment shader
        `#version 300 es
        precision highp float;

        out vec4 color;

        void main() {
            color = vec4(1, 0, 0, 1);
        }`
    );

    // Get the attribute information from the programs
    const tfbInfoMap = Gluu.getAllAttributes(tfbProgram);
    const shaderInfoMap = Gluu.getAllAttributes(shaderProgram);

    gl.resize(); // Resize the canvas to get canvas dimensions

    // Particle data
    const numParticles = 1000;
    const velocityRange = [-100, 100]; // [min, max]

    // Create the position and velocity data
    const positionData = new Float32Array(numParticles * 2);
    const velocityData = new Float32Array(numParticles * 2);
    {    
        const [min, max] = velocityRange;
        const range = max - min;

        const [width, height] = [gl.canvas.width, gl.canvas.height];

        for (let i = 0; i < numParticles * 2; i+=2) {
            
            positionData[i] = Math.random() * width;
            positionData[i + 1] = Math.random() * height;

            velocityData[i] = Math.random() * range + min;
            velocityData[i + 1] = Math.random() * range + min;
        }
    }

    // Setup buffers (the fun part!)
    const positionBuffer1 = Gluu.createVertexBuffer(positionData, gl.DYNAMIC_DRAW);
    positionBuffer1.mapAttributes([
        [
            tfbInfoMap, 
            [
                { attribute: 't_position' }
            ]
        ],
        [
            shaderInfoMap,
            [
                { attribute: 'v_position' }
            ]
        ]
    ]);
    
    const positionBuffer2 = Gluu.createVertexBuffer(positionData, gl.DYNAMIC_DRAW);
    positionBuffer2.mapAttributes([
        [
            tfbInfoMap, 
            [
                { attribute: 't_position' }
            ]
        ],
        [
            shaderInfoMap,
            [
                { attribute: 'v_position' }
            ]
        ]
    ]);

    const velocityBuffer = Gluu.createVertexBuffer(velocityData, gl.STATIC_DRAW);
    velocityBuffer.mapAttributes([
        [
            tfbInfoMap,
            [
                { attribute: 't_velocity' }
            ]
        ]
    ]);

    const tfVAO1 = Gluu.createVertexArray([
        [positionBuffer1, ['t_position']],
        [velocityBuffer, ['t_velocity']],
    ]);

    const tfVAO2 = Gluu.createVertexArray([
        [positionBuffer2, ['t_position']],
        [velocityBuffer, ['t_velocity']],
    ]);

    const drawVAO1 = Gluu.createVertexArray([
        [positionBuffer1, ['v_position']],
    ]);

    const drawVAO2 = Gluu.createVertexArray([
        [positionBuffer2, ['v_position']],
    ]);
}

main();