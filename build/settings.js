import fs from "fs";
import path from "path";
import process from "process";
import { execSync } from "child_process";

import * as build from "./build.js";
import * as bundle from "./bundle.js";
import * as log from "./log.js";
import * as user from "./user.js";

import { VERSION } from "./version.js";
import * as watch from "./watch.js";

export var projectPath = ""; // TODO: Nuke me
export var development_mode = false;
export var watchMode = false;

export const CONFIG_PATH = "magic.config";
export const MAGIC_DIR = ".magic";
export const validCWD = isValidProject(".");
export const COMMAND_SPACING = 20;

export const DEFAULT_PORT = 2370;

const NEW_CFG = { name: "magic-project", version: "0.0.1", scripts: { dev: "magic dev", build: "magic build", magic: "bun --bun magic-framework" }, dependencies: { "magic-framework": "^" + VERSION } };
const NEW_README = "# Magic project\nBun is currently only supported.\nUse `bun run magic dev` to start the development server." 
const NEW_INDEXJS = "import * as magic from 'magic-framework';\n";

export var config = {
    dist: "dist",
    src: "src",
    assets: "assets",
    entry: "index.ts",
    port: DEFAULT_PORT,
};

export const ASSET_TYPES = [
    'mesh',
    'textures',
    'sound',
];

export const COMMANDS = [
    // Info
    { type: "info", name: "help", function: help, description: "Show this help message" },
    { type: "info", name: "version", function: version, description: "Show the version number and exit" },

    // Project actions
    // takes path expects the next argument
    { type: "act", name: "new", function: project, description: "Create a new project at the path" },
    { type: "act", name: "setup", function: setup, description: "Setup a config file in the current directory" },
    { type: "act", cwdOkay: true, name: "dev", function: watch.watch, description: "Start development mode" },
    { type: "act", cwdOkay: true, name: "build", function: build.build, description: "Build the project" },
    { type: "act", cwdOkay: true, name: "bundle", function: bundle.bundle, description: "Bundle the project" },

    // User config
    // { type: "flag", name: "s", description: "Disable verbose logging", function: () => { log.verbose = false; } },
    // { type: "flag", name: "debug", description: "Enable debugging mode", function: () => { log.verbose = false; } },
];

const PROJECT_STRUCTURE = [
    { type: "dir", name: config.src },
    { type: "dir", name: config.dist },
    { type: "dir", name: config.assets },
    ...genAssetSubDirs(),
    { type: "dir", name: MAGIC_DIR },
    { type: "file", name: `${config.src}/${config.entry}`, content: NEW_INDEXJS },
    { type: "file", name: "README.md", content: NEW_README, optional: true },
    { type: "file", name: CONFIG_PATH, content: dumpConfig(config) },
    { type: "file", name: ".gitignore", content: MAGIC_DIR + "\nnode_modules\n*.lockb" },
    { type: "file", name: "package.json", content: JSON.stringify(NEW_CFG, null, 2) },
    { type: "file", name: user.CONFIG_PATH, content: dumpConfig(user.config) },
];

function genAssetSubDirs() {
    var content = []
    for (let type of ASSET_TYPES) {
        content.push({ type: "dir", name: `${config.assets}/${type}` })
    };

    return content;
}

export function parse(args) {
    if (args.length === 0) return null;

    var action = null;

    for (let argument of args) {
        for (let command of COMMANDS) {
            if (argument !== command.name) continue;

            action = command.function;
            args.shift();

            if (command.type !== "act") break;

            if (args.length === 0) {
                if (!command.cwdOkay) {
                    log.error("No path provided for: " + command.name);
                    return null;
                }

                // Ducktape don't mind me
                args.push(".");
            }

            projectPath = args[0];

            break;
        }
    }

    if (!action) return null;

    return { function: action, arguments: args };
}

// Loads the config at the root of the project
export function load() {
    const filePath = path.join(projectPath, CONFIG_PATH);

    if (!fs.existsSync(filePath)) {
        return;
    }

    config = loadConfig(filePath);
}


export function help() {
    var buffer = "Usage: magic [command] [options]\n\nMagic commands:\n\n";

    var i = 0;
    for (let command of COMMANDS) {
        buffer += `${log.COLORS[i % log.COLORS.length]}${command.name} ${log.RESET}`.padEnd(COMMAND_SPACING) + `-- ${command.description}\n`;
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
    const buffer = dumpConfig(config);

    fs.writeFileSync(CONFIG_PATH, buffer);

    log.success("Config file created at " + projectPath);
    log.print("\nwith default options:", log.YELLOW);
}

export function project(path) {

    if (path.length === 0) {
        log.error("No path provided for new project");
        return;
    }

    const projectDirectory = path[0];

    if (fs.existsSync(projectDirectory)) {
        if (fs.readdirSync(projectDirectory).length > 0) {
            log.error("The directory is not empty");
        } else {
            log.error("The directory already exists");
        }

        return;
    }

    log.print("Creating a new project at " + projectDirectory, log.GREEN);

    fs.mkdirSync(projectDirectory, { recursive: true });

    for (let item of PROJECT_STRUCTURE) {

        if (item.type === "file") {
            fs.writeFileSync(path + "/" + item.name, item.content);
        }

        if (item.type === "dir") {
            fs.mkdirSync(path +
                "/" + item.name, { recursive: true });
        }

    }


    log.print("Running 'bun i' in the project directory: " + projectDirectory, log.GREEN);
    log.flush();

    execSync("bun i", { cwd: projectDirectory });
}

function promptNewProject() {
    log.warn("No magic.config file found in this directory...");
    log.print("✨   Would you like to create a new project here? (y/n)" + log.MAGENTA + "     > " + projectPath, log.CYAN);
    log.flush();

    var userInput = false;

    process.stdin.on('data', function (data) {
        data = data.toString().trim();

        if (data === "y" || data === "yes" || data === "Y" || data === "Yes") {
            process.stdin.end();
            project(projectPath);
        }

        userInput = true;
    });

    while (!userInput) {
        setTimeout(resolve, 300);
    }
}

export function isValidProject(project) {
    if (!project) {
        log.error("No project path provided");
        return false;
    }

    const config = path.join(process.cwd(), project, CONFIG_PATH);

    if (!fs.existsSync(config)) return false;

    const magicDir = path.join(process.cwd(), project, MAGIC_DIR);

    if (!fs.existsSync(magicDir)) {
        log.write("Initializing magic directory...");

        fs.mkdirSync(magicDir, { recursive: true });
    }

    return true;
}

export function loadConfig(p) {
    let data;
    try {
        data = fs.readFileSync(p, 'utf8');
    } catch (err) {
        log.error("ON CONFIG LOAD: " + p + " 🛑  Error reading the file: " + err);
        return;
    }

    var output = config;

    const lines = data.split(/\r?\n/); // Handles both \n and \r\n

    for (let line of lines) {
        let parts = line.split(" ");
        let key = parts[0].trim();

        let value = parts.slice(1).join(" ").trim();

        output[key] = value;
    }

    return output;
}


export function version() {
    log.print(VERSION);
}

export function devMode() {
    development_mode = true;
}

export function triggerWatchMode() {
    watchMode = true;
}