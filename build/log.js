var verbose = true;

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

export function print(message, color) {
    if (!verbose) return;
    if (!color) color = reset;
    console.log(color + message + reset);
}

export function success(message) {
    console.log(green + "✅   " + message + reset);
}

export function warn(message) {
    console.log(yellow + "⚠️    " + message + reset);
}

export function error(message) {
    console.log(red + "🛑   Error: " + reset + message);
}