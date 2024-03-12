import * as settings from "./settings.js";
import * as log from "./log.js";
import * as fs from "fs";
import * as path from "path";
import * as build from "./build.js";
import * as bundle from "./bundle.js";

import process from "process";
import WebSocket from "ws";

// Only used for local development on magic itself
const DEV_MODE = true;

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
    applyChange(true, "watch_start");

    watchers.push(fs.watch(config, (eventType, filename) => {
        log.print("✨   Magic config changed...", log.MAGENTA);
        settings.load();
        watch();
    }));

    if (DEV_MODE) {
        log.print("✨   MAGIC MODULE DEVELOPMENT MODE ACTIVE... ", log.MAGENTA);

        watchers.push(fs.watch(path.join(settings.projectPath, "node_modules/magic-framework"), { recursive: true }, (eventType, filename) => {
            log.print("🔥  Magic framework changed: " + filename, log.YELLOW);
            applyChange(true, "watch_magic_config");
        }));
    }

    const srcDir = path.join(settings.projectPath, settings.config.src);

    if (fs.existsSync(srcDir)) {
        watchers.push(fs.watch(srcDir, { recursive: true }, (eventType, filename) => {

            if (filename == "assets.js") {
                return;
            }

            log.print("🔥  Source changed: " + filename, log.YELLOW);
            console.trace();

            applyChange(false, "watch_src");
        }));
    }

    const assetsDir = path.join(settings.projectPath, settings.config.assets);

    if (fs.existsSync(assetsDir)) {
        watchers.push(fs.watch(assetsDir, { recursive: true }, (eventType, filename) => {
            log.print("🔥  Asset changed: " + filename, log.YELLOW);
            applyChange(true, "watch_assets");
        }));
    } else {
        log.warn("No Assets directory found...");
    }

    watchInterval = setInterval(() => { }, 1000);
}

function applyChange(buildAssets = true, orgin = "not_set") {

    if (buildAssets) build.build();

    var result = bundle.bundle(args);

    if (!result) {
        reportError(result);
        return;
    }

    reload(orgin);
    log.flush();
}

function watchServer() {
    if (ws) {
        return;
    }

    ws = new WebSocket.Server({ port: 3000 });

    ws.onmessage = (message) => {

        log.print("___ Report: " + message.data, log.YELLOW);
        log.flush();

    };

    ws.on("connection", (socket) => {
        log.print("🔥   Client connected >? " + socket.protocol, log.YELLOW);
        log.flush();
    });

    ws.on("close", () => { log.print("🔥   Client disconnected", log.YELLOW); log.flush(); });

    ws.on("error", (error) => { log.error(error); log.flush(); });


    return ws;
}

export function reportError(error) {
    if (error === true || error === undefined) { return; }
    if (ws) {
        ws.clients.forEach((client) => {
            client.send(JSON.stringify({ error: error }));
        });
    }
}

export function reload() {

    // The delay here is necessary to ensure that the server has time reload before the client
    // TODO: propper fix, No time out :3
    setTimeout(() => {
        if (ws) {
            ws.clients.forEach((client) => {
                client.send("reload");
            });
        }
    }, 50);
}