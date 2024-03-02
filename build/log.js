import process from "process";

export var buffer = "";

export const
    RED = "\x1b[91m",
    GREEN = "\x1b[92m",
    YELLOW = "\x1b[93m",
    BLUE = "\x1b[94m",
    MAGENTA = "\x1b[95m",
    CYAN = "\x1b[96m",
    RESET = "\x1b[0m",
    WHITE = "\x1b[97m";

export const COLORS = [RED, GREEN, YELLOW, BLUE, MAGENTA, CYAN];
export const TIMER_SIG = GREEN + "⌛️   Magic total runtime" + RESET;

export function print(message, color) {
    if (!color) color = RESET;
    buffer += color + message + RESET + "\n";
}

export function success(message) { buffer += GREEN + "✅   " + message + RESET + "\n" }
export function warn(message) { buffer += YELLOW + "⚠️    " + message + RESET + "\n" }
export function error(message) { buffer += RED + "🛑   Error: " + RESET + message + "\n" }

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