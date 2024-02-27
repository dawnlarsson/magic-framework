// TODO!
import * as Matrix from './math/matrix';
import * as Utils from './utils';
import * as Input from './io/input';

export var canvas: HTMLCanvasElement;
export var gl: WebGL2RenderingContext;

export var aspect: number;
export var projectionMatrix: Matrix.Matrix;

export function refreshSizes() {
    gl.viewport(0, 0, canvas.width, canvas.height);
}

export async function init(updateCallback: (delta: number) => void, renderCallback: () => void) {
    canvas = document.getElementById('c') as HTMLCanvasElement;
    gl = canvas.getContext('webgl2') as WebGL2RenderingContext;

    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;

    Input.setup();

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    refreshSizes();

    var startTime = performance.now();
    var oldTime = 0.0;
    var elapsedTime = 0.0;


    function frame(newTime) {

        const currentWidth = canvas.clientWidth * devicePixelRatio;
        const currentHeight = canvas.clientHeight * devicePixelRatio;

        if (
            (currentWidth !== canvas.width || currentHeight !== canvas.height) &&
            currentWidth &&
            currentHeight
        ) {
            canvas.width = currentWidth;
            canvas.height = currentHeight;
            projectionMatrix[5] = currentWidth / currentHeight;
        }

        window.requestAnimationFrame(frame);

        var deltaTime = 0.0;
        deltaTime = (newTime - oldTime) / 1000;
        deltaTime = Utils.clamp(deltaTime, 0.000, 0.3);
        oldTime = newTime;
        elapsedTime += deltaTime;

        Utils.update(deltaTime);
        Input.update();

        // Callback to consumer
        updateCallback(deltaTime);

        renderCallback();
    }

    window.requestAnimationFrame(frame);
}