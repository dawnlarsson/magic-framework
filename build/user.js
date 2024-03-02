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

    if (!fs.existsSync(CONFIG_PATH)) return;

    config = settings.loadConfig(CONFIG_PATH);

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