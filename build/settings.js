import * as build from "./build.js";
import * as log from "./log.js";
import * as user from "./user.js";
import fs from "fs";
import path from "path";
import process from "process";
import { version as ver } from "./version.js";
import * as watch from "./watch.js";

// TODO: find a neater way instead 2 arrays for itterating over
export var config = {
    dist: "public",
    src: "src",
    assets: "assets",
    systems: "systems"
};

export const assetTypes = [
    'mesh',
    'textures',
    'sound',
];

export const commands = [
    { type: "act", name: "help", description: "Show this help message", function: help },
    { type: "act", name: "new", description: "Create a new project at the path", function: project },
    { type: "act", name: "dev", description: "Start development mode", function: watch.watch },
    { type: "act", name: "build", description: "Build the project", function: build.build },
    { type: "act", name: "version", description: "Show the version number and exit", function: version },
    { type: "act", name: "setup", description: "Setup a config file in the current directory", function: setup },
    { type: "act", name: "verbose", description: "Toggle verbose logging", function: () => { user.set(user.config.verbose_log, !user.config.verbose_log) } },
    // { type: "mod", name: "s", description: "Disable verbose logging", function: () => { log.verbose = false; } },
];

const newProject = [
    { type: "dir", name: config.dist },
    { type: "dir", name: config.assets },
    { type: "dir", name: config.systems },
    ...genAssetSubDirs(),
    { type: "dir", name: ".magic" },
    { type: "file", name: "magic.config", content: () => dumpConfig(config) },
    { type: "file", name: ".gitignore", content: () => { return ".magic/" } },
    { type: "file", name: user.CONFIG_PATH, content: () => dumpConfig(user.config) },
];

function genAssetSubDirs() {
    var content = []
    for (let type of assetTypes) {
        content.push({ type: "dir", name: `${config.assets}/${type}` })
    };

    return content;
}

export async function parse(args) {
    var action = null;

    if (args.length === 0) help();

    for (let arg of args) {
        for (let command of commands) {

            if (command.name !== arg) continue;

            // Remove the argument from the list
            args = args.filter((item) => item !== arg);

            if (command.type === "act") {
                action = command.function;
                continue;
            }

            if (command.type === "mod") {
                command.function();
                continue;
            }
        }
    }

    if (!action) return null;

    return () => { action(args) };
}

export function help() {
    var buffer = "Usage: magic [command] [options]\nMagic commands:\n";

    var i = 0;
    for (let command of commands) {
        buffer += `${log.colors[i % log.colors.length]}${command.name} ${log.reset}  ${command.description}\n`;
        i += 1;
    }

    log.write(buffer);
}

export function dumpConfig(data) {
    var content = "";

    const len = Object.keys(data).length;
    var i = 0;
    for (const [key, value] of Object.entries(data)) {
        content += key + " " + value + (i < len - 1 ? "\n" : "");
        i += 1;
    }

    return content;
}

export function setup() {
    const config = dumpConfig(config);

    fs.writeFileSync("magic.config", config);

    log.success("Config file created at " + process.cwd());
    log.print("\nwith default options:", log.yellow);
}

export function project(path) {

    if (path.length === 0) {
        log.error("No path provided! usage: magic new <path>");
        return;
    }


    if (fs.existsSync(path[0])) {
        if (fs.readdirSync(path[0]).length > 0) {
            log.error("The directory is not empty");
        } else {
            log.error("The directory already exists");
        }

        return;
    }

    log.print("Creating a new project at " + path[0], log.green);

    fs.mkdirSync(path[0], { recursive: true });

    for (let item of newProject) {

        if (item.type === "file") {
            fs.writeFileSync(path + "/" + item.name, item.content());
        }

        if (item.type === "dir") {
            fs.mkdirSync(path +
                "/" + item.name, { recursive: true });
        }

    }
}

var userInput = false;
async function promptNewProject() {
    log.warn("No magic.config file found in this directory...");
    log.print("✨   Would you like to create a new project here? (y/n)" + log.magenta + "     > " + process.cwd(), log.cyan);
    log.flush();

    process.stdin.on('data', function (data) {
        data = data.toString().trim();

        if (data === "y" || data === "yes" || data === "Y" || data === "Yes" || data === "tuta och kör") {
            process.stdin.end();
            project(process.cwd());
        }

        userInput = true;
    });

    while (!userInput) {
        await new Promise(resolve => setTimeout(resolve, 300));
    }
}

// Loads the config at the root of the project
export async function load() {

    const filePath = path.join(process.cwd(), "magic.config");

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        return; // Assume default values
    }

    let data;
    try {
        data = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        log.error("Error reading the file: " + err);
        return;
    }

    const lines = data.split(/\r?\n/); // Handles both \n and \r\n

    for (let line of lines) {
        let parts = line.split(" ");
        let key = parts[0].trim();

        let value = parts.slice(1).join(" ").trim();

        config[key] = value;
    }
}


export function version() {
    log.print(ver);
}