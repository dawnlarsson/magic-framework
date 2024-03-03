const audioContext = new AudioContext()

var buffers = []

export async function load(id, arrayBuffer) {

    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

    buffers[id] = audioBuffer

    return buffers.length
}

export function play(type) {
    const source = audioContext.createBufferSource()
    source.buffer = buffers[type]
    source.connect(audioContext.destination)
    source.start()
}