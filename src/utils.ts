export function update(dt) {
    delta = dt
}

export function lerp(start, end, t) {
    return (1 - t) * start + t * end;
}

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function fovToRadians(fovInDegrees) {
    return fovInDegrees * (Math.PI / 180);
}

const BUDGET_TICKERS = 300;
var delta = 0.0
var tickFrequency = new Float32Array(BUDGET_TICKERS)
var tickTime = new Float32Array(BUDGET_TICKERS)
var tickIndex = 0

export function ticker(frequency) {

    if (tickIndex >= BUDGET_TICKERS) {
        console.error("Ticker budget exceeded")
        return -1
    }

    tickFrequency[tickIndex] = frequency
    tickTime[tickIndex] = 0.0
    tickIndex++

    return tickIndex - 1
}

export function setFrequency(id, frequency) {
    tickFrequency[id] = frequency
}

export function tick(id, reset = false) {
    if (reset) {
        tickTime[id] = 0.0
    }

    if (tickTime[id] >= tickFrequency[id]) {
        tickTime[id] = 0.0
        return true
    }

    tickTime[id] = tickTime[id] + delta
    return false
}
