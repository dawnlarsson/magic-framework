import * as settings from "./settings.js";
import * as log from "./log.js";
import * as fs from "fs";
import * as path from "path";
import * as build from "./build.js";
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

    if (!path) path = "";
    if (path.length > 0 && path[path.length - 1] !== "/") path += "/";

    if (fs.existsSync(path + settings.config.assets)) {
        watchers.push(fs.watch(path + settings.config.assets, { recursive: true }, (eventType, filename) => {
            log.print("🔥  Asset changed: " + filename, log.yellow);
            build.build();
            log.print("🔥  Watching for changes...");
            log.flush();
        }));
    } else {
        log.warn("No Assets directory found...");
    }

    if (fs.existsSync(path + settings.config.systems)) {
        watchers.push(fs.watch(path + settings.config.systems, { recursive: true }, (eventType, filename) => {
            log.print("🔥  System changed: " + filename, log.yellow);
            build.build();
            log.print("🔥  Watching for changes...");
            log.flush();
        }));
    } else {
        log.warn("No Systems directory found...");
    }

    watchers.push(fs.watch(path + "magic.config", (eventType, filename) => {
        log.print("🔄  " + log.green + "config changed ✨ Restarting... \n");
        load();
        watch();
        log.print("🔥  Watching for changes...");
        log.flush();
    }));

    log.print("\n🔥  Watching for changes...");
    log.flush();

    console.timeEnd(log.timer);
    console.time(log.timer);

    watchInterval = await new Promise(() => {
        setInterval(() => { }, 1000);
    });
}