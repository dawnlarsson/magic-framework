import process from "process";

export var buffer = "";

export const
    red = "\x1b[91m",
    green = "\x1b[92m",
    yellow = "\x1b[93m",
    blue = "\x1b[94m",
    magenta = "\x1b[95m",
    cyan = "\x1b[96m",
    reset = "\x1b[0m",
    white = "\x1b[97m";

export const colors = [red, green, yellow, blue, magenta, cyan];
export const timer = green + "⌛️   Magic total runtime" + reset;

export function print(message, color) {
    if (!color) color = reset;
    buffer += color + message + reset + "\n";
}

export function success(message) { buffer += green + "✅   " + message + reset + "\n" }
export function warn(message) { buffer += yellow + "⚠️    " + message + reset + "\n" }
export function error(message) { buffer += red + "🛑   Error: " + reset + message + "\n" }

export function write(content) {
    buffer += content;
}

export function flush() {
    console.log(buffer);
    buffer = "";
}

export function disableVerbose() {
    buffer += "🔇   Verbose mode disabled\n";
    print = () => { }
}

process.on('exit', flush);