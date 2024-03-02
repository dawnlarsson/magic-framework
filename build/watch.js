import * as settings from "./settings.js";
import * as log from "./log.js";
import * as fs from "fs";
import * as path from "path";
import * as build from "./build.js";
import process from "process";

var watchers = [];
var watchInterval;
var active = false;

export function watch() {

    for (let watcher of watchers) {
        watcher.close();
    }

    watchers = [];

    if (watchInterval) {
        clearInterval(watchInterval);
    }

    const config = path.join(settings.projectPath, settings.CONFIG_PATH);

    if (!fs.existsSync(config)) {
        log.error("No magic.config file found");
        process.exit(1);
    }

    if (!active) log.print("🔄   Starting development mode");
    active = true;
    log.flush();

    watchers.push(fs.watch(config, (eventType, filename) => {
        log.print("✨   Magic config changed...", log.MAGENTA);
        settings.load();
        watch();
    }));

    const assetsDir = path.join(settings.projectPath, settings.config.assets);

    if (fs.existsSync(assetsDir)) {
        watchers.push(fs.watch(assetsDir, { recursive: true }, (eventType, filename) => {
            log.print("🔥  Asset changed: " + filename, log.YELLOW);
            build.build();
            log.flush();
        }));
    } else {
        log.warn("No Assets directory found...");
    }

    const systemsDir = path.join(settings.projectPath, settings.config.systems);

    if (fs.existsSync(systemsDir)) {
        watchers.push(fs.watch(systemsDir, { recursive: true }, (eventType, filename) => {
            log.print("🔥  System changed: " + filename, log.YELLOW);
            build.build();
            log.flush();
        }));
    } else {
        log.warn("No Systems directory found...");
    }


    watchInterval = setInterval(() => { }, 1000);
}