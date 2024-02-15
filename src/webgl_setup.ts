// TODO!
import * as Matrix from './math/matrix';
import * as Utils from './utils';
import * as Input from './io/input';

export var canvas: HTMLCanvasElement;
export var gl: WebGL2RenderingContext;

export var aspect: number;
export var projectionMatrix: Matrix.Matrix;

export async function init(updateCallback: (delta: number) => void, renderCallback: () => void) {
    canvas = document.getElementById('c') as HTMLCanvasElement;
    gl = canvas.getContext('webgl2') as WebGL2RenderingContext;

    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;

    Input.setup();

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