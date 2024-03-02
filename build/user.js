import fs from "fs";
import path from "path";
import process from "process";

import * as log from "./log.js";
import * as blender from "./blender.js";
import * as settings from "./settings.js";

export const CONFIG_PATH = ".magic/you.config";

// ? = unknown
// ! = error - Tried but failed
// * = warning
export var config = {
    blender_path: "?",
    verbose_log: true
};

export function load() {

    if (!fs.existsSync(CONFIG_PATH)) {
        return;
    }

    fs.readFileSync(CONFIG_PATH, "utf8").split("\n").forEach((line) => {
        let parts = line.split(" ");
        let key = parts[0].trim();
        let value = parts.slice(1).join(" ").trim();
        config[key] = value;
    });

    if (config.blender_path === "?") {
        blender.initialSetup();
    }

    if (config.verbose_log === "false") {
        log.disableVerbose();
    }
}

export function set(key, value) {
    config[key] = value;
    save();
}

export function save() {
    if (!fs.existsSync(CONFIG_PATH)) {
        log.warn("TODO: no config file found");
        return; // TODO:
    }

    var data = settings.dumpConfig(config);

    fs.writeFileSync(CONFIG_PATH, data)
}