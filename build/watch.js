import * as settings from "./settings.js";
import * as log from "./log.js";
import * as fs from "fs";
import * as path from "path";
import * as build from "./build.js";
import * as bundle from "./bundle.js";

import process from "process";
import WebSocket from "ws";

var watchers = [];
var watchInterval;
var active = false;

var ws;
var args;

export function watch(cliArgs) {

    if (cliArgs) {
        args = cliArgs;
    }

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

    if (!active) log.print("✨   Running development mode, watching for changes...", log.MAGENTA);
    active = true;

    settings.triggerWatchMode();
    watchServer();
    applyChange(true);

    watchers.push(fs.watch(config, (eventType, filename) => {
        log.print("✨   Magic config changed...", log.MAGENTA);
        settings.load();
        watch();
    }));

    const srcDir = path.join(settings.projectPath, settings.config.src);

    if (fs.existsSync(srcDir)) {
        watchers.push(fs.watch(srcDir, { recursive: true }, (eventType, filename) => {

            if (filename == "assets.js") {
                return;
            }

            log.print("🔥  Source changed: " + filename, log.YELLOW);
            applyChange(false);
        }));
    }

    const assetsDir = path.join(settings.projectPath, settings.config.assets);

    if (fs.existsSync(assetsDir)) {
        watchers.push(fs.watch(assetsDir, { recursive: true }, (eventType, filename) => {
            log.print("🔥  Asset changed: " + filename, log.YELLOW);
            applyChange(true);
        }));
    } else {
        log.warn("No Assets directory found...");
    }

    const systemsDir = path.join(settings.projectPath, settings.config.systems);

    if (fs.existsSync(systemsDir)) {
        watchers.push(fs.watch(systemsDir, { recursive: true }, (eventType, filename) => {
            log.print("🔥  System changed: " + filename, log.YELLOW);
            applyChange(false);
        }));
    } else {
        log.warn("No Systems directory found...");
    }

    watchInterval = setInterval(() => { }, 1000);
}

function applyChange(buildAssets = true) {

    if (buildAssets) build.build();

    var result = bundle.bundle(args);

    if (result != null) {
        reportError(result);
        return;
    }

    reload();
    log.flush();
}

function watchServer() {
    if (ws) {
        return;
    }

    ws = new WebSocket.Server({ port: 3000 });

    ws.on("connection", (socket) => { });
    ws.on("error", (error) => { log.error(error); log.flush(); });

    ws.onmessage = (message) => {
        log.print(message, log.RED);
        log.flush();
    };

    return ws;
}

export function reportError(error) {
    if (error === true || error === undefined) { return; }
    if (ws) {
        ws.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ error: error }));
            }
        });
    }
}

export function reload() {
    // The delay here is necessary to ensure that the server has time reload before the client
    // TODO: propper fix, No time out :3
    setTimeout(() => {
        if (ws) {
            ws.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send("reload");
                }
            });
        }
    }, 50);
}