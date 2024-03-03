const audioContext = new AudioContext()

var buffers = []

export async function load(id, data) {

    const buffer = new Uint8Array(data).buffer;
    const audioBuffer = await audioContext.decodeAudioData(buffer)

    buffers[id] = audioBuffer

    return buffers.length
}