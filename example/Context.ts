export class GluuContext {
    private readonly canvas: HTMLCanvasElement; // Add property declaration for 'canvas'
    private readonly gl: WebGL2RenderingContext;
    
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        let gl = canvas.getContext('webgl2') as WebGL2RenderingContext;
        if (!gl) {
            throw new Error('WebGL2 is not supported');
        }
        this.gl = gl;
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    public getGL(): WebGL2RenderingContext {
        return this.gl;
    }

    public resize(
        width: number = this.canvas.clientWidth,
        height: number = this.canvas.clientHeight,
        x: number = 0,
        y: number = 0,
    ): void {
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl.viewport(x, y, width, height);
    }
}