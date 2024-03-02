import fs from "fs";
import process from "process";
import * as log from "./log.js";

import { execSync } from "child_process";

// Default blender install path
var blenderPath = {
    win32: ["C:/Program Files/Blender Foundation/Blender/blender.exe", blenderWindows],
    darwin: ["/Applications/Blender.app/Contents/MacOS/Blender", blenderMac],
    linux: ["/usr/bin/blender", blenderLinux]
};

export async function initialSetup() {
    let command;

    switch (process.platform) {
        case 'win32': // Windows
            command = 'C:\\Windows\\System32\\tasklist.exe';
            break;
        case 'darwin': // macOS
            command = 'ps -ax | grep Blender';
            break;
        case 'linux': // Linux
            command = 'ps -aux | grep Blender';
            break;
        default:
            throw new Error(`Unsupported platform: ${process.platform}`);
    }

    log.print("target >>>>>> " + command);

    setInterval(() => {
        log.print("Checking for Blender process...");
        log.flush();
        getBlenderProcess(command);
    }, 400);
}

function getBlenderProcess(command) {
    try {
        const output = execSync(command).toString();
        const lines = output.split('\n');
        const blenderLines = lines.filter(line => line.toLowerCase().includes('blender'));
        return blenderLines.length > 0 ? blenderLines : 'Blender process not found.';
    } catch (error) {
        log.error(`Error fetching Blender process: ${error.message}`);
    }
}

function blenderWindows() {


}

function blenderMac() {
    log.error("TODO: Blender suppprt for MacOS is not yet implemented.")
}

function blenderLinux() {
    log.error("TODO: Blender suppprt for Linux is not yet implemented.")
}