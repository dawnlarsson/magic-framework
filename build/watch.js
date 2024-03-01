import * as settings from "./settings.js";
import * as log from "./log.js";
import * as fs from "fs";
import * as path from "path";
import process from "process";

var watchers = [];
var watchInterval;

export async function watch(path) {
    log.print("🔄   Starting development mode 🔥✨");

    for (let watcher of watchers) {
        watcher.close();
    }

    if (watchInterval) {
        clearInterval(watchInterval);
    }

    if (fs.existsSync(settings.config.assets)) {
        watchers.push(fs.watch(settings.config.assets, { recursive: true }, (eventType, filename) => {
            log.print("🔥  Asset changed: " + filename, log.yellow);
            build.build();
            log.print("🔥  Watching for changes...");
        }));
    } else {
        log.warn("No Assets directory found...");
    }

    if (fs.existsSync(settings.config.systems)) {
        watchers.push(fs.watch(settings.config.systems, { recursive: true }, (eventType, filename) => {
            log.print("🔥  System changed: " + filename, log.yellow);
            build.build();
            log.print("🔥  Watching for changes...");
        }));
    } else {
        log.warn("No Systems directory found...");
    }

    watchers.push(fs.watch("magic.config", (eventType, filename) => {
        log.print("🔄  " + log.green + "config changed ✨ Restarting... \n");
        load();
        watch();
        log.print("🔥  Watching for changes...");
    }));

    log.print("");
    log.print("🔥  Watching for changes...");

    watchInterval = await new Promise(() => {
        setInterval(() => { }, 1000);
    });
}