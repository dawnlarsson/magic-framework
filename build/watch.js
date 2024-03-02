import * as settings from "./settings.js";
import * as log from "./log.js";
import * as fs from "fs";
import * as path from "path";
import * as build from "./build.js";
import process from "process";

var watchers = [];
var watchInterval;

export function watch() {
    log.print("🔄   Starting development mode 🔥✨");

    for (let watcher of watchers) {
        watcher.close();
    }

    if (watchInterval) {
        clearInterval(watchInterval);
    }

    const assetsDir = path.join(settings.projectPath, settings.config.assets);

    if (fs.existsSync(assetsDir)) {
        watchers.push(fs.watch(assetsDir, { recursive: true }, (eventType, filename) => {
            log.print("🔥  Asset changed: " + filename, log.YELLOW);
            build.build();
            log.print("🔥  Watching for changes...");
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
            log.print("🔥  Watching for changes...");
            log.flush();
        }));
    } else {
        log.warn("No Systems directory found...");
    }

    const config = path.join(settings.projectPath, settings.CONFIG_PATH);

    watchers.push(fs.watch(config, (eventType, filename) => {
        log.print("🔄  " + log.GREEN + "config changed ✨ Restarting... \n");
        settings.load();
        watch();
        log.print("🔥  Watching for changes...");
        log.flush();
    }));

    log.print("\n🔥  Watching for changes...");
    log.flush();

    console.timeEnd(log.TIMER_SIG);
    console.time(log.TIMER_SIG);

    watchInterval = new Promise(() => {
        setInterval(() => { }, 1000);
    });
}