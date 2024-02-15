import * as Matrix from './math/matrix';
import * as Utils from './utils';
import * as Input from './io/input';

export var canvas: HTMLCanvasElement;
export var context: GPUCanvasContext;

export var adapter: GPUAdapter;
export var device: GPUDevice;
export var renderPassDescriptor: GPURenderPassDescriptor;
export var depthTexture: GPUTexture;
export var sampler: GPUSampler;

export var aspect: number;
export var projectionMatrix: Matrix.Matrix;

export function refreshRenderPass(device) {

    depthTexture = device.createTexture({
        size: [canvas.width, canvas.height],
        format: 'depth24plus',
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });

    renderPassDescriptor = {
        colorAttachments: [
            {
                view: undefined, // Assigned later

                clearValue: { r: 0.0, g: 0.0, b: 0.1, a: 1.0 },
                loadOp: 'clear',
                storeOp: 'store',
            },
        ],
        depthStencilAttachment: {
            view: depthTexture.createView(),

            depthClearValue: 1.0,
            depthLoadOp: 'clear',
            depthStoreOp: 'store',
        },
    };

    aspect = canvas.width / canvas.height;
    projectionMatrix = Matrix.perspective(Matrix.identity(),
        (2 * Math.PI) / 5,
        aspect,
        1,
        100.0
    );

}

export async function init(updateCallback: (delta: number) => void, renderCallback: (device: GPUDevice, passEncoder: any) => void) {
    canvas = document.getElementById('c') as HTMLCanvasElement;
    context = canvas.getContext('webgpu');

    if (!device) {
        console.error('WebGPU is not supported on this device');
        return;
    }

    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

    context.configure({
        device,
        format: presentationFormat,
        alphaMode: 'premultiplied',
    });

    sampler = device.createSampler({
        magFilter: 'nearest',
        minFilter: 'nearest',
    });

    refreshRenderPass(device);

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

            refreshRenderPass(device);
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

        renderPassDescriptor.colorAttachments[0].view = context
            .getCurrentTexture()
            .createView();

        const commandEncoder = device.createCommandEncoder();
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

        renderCallback(device, passEncoder);

        passEncoder.end();
        device.queue.submit([commandEncoder.finish()]);
    }

    window.requestAnimationFrame(frame);
}