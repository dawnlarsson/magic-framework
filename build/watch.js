import * as fs from "fs";
import * as path from "path";
import process from "process";

import * as settings from "./settings.js";
import * as log from "./log.js";
import * as build from "./build.js";
import * as bundle from "./bundle.js";

// Only used for local development on magic itself
const DEV_MODE = true;

var watchers = [];
var watchInterval;
var active = false;

var args
var server

export function watch(cliArgs) {

    args = cliArgs;

    for (let watcher of watchers) {
        watcher.close();
    }

    watchers = [];

    if (watchInterval) {
        clearInterval(watchInterval);
    }

    const config = path.join(settings.projectPath, settings.CONFIG_PATH);

    if (!fs.existsSync(config)) {
        log.error("No magic.config file found at path: " + config);
        process.exit(1);
    }

    active = true;

    settings.triggerWatchMode();
    watchServer();
    applyChange(true, "watch_start");

    watchers.push(fs.watch(config, (eventType, filename) => {
        settings.load();
        watch();
    }));

    if (DEV_MODE) {
        watchers.push(fs.watch(path.join(settings.projectPath, "node_modules/magic-framework"), { recursive: true }, (eventType, filename) => {
            log.print("Magic framework changed: " + filename, log.YELLOW);
            applyChange(true, "watch_magic_config");
        }));
    }

    const srcDir = path.join(settings.projectPath, settings.config.src);

    if (fs.existsSync(srcDir)) {
        watchers.push(fs.watch(srcDir, { recursive: true }, (eventType, filename) => {

            if (filename == "assets.js") {
                return;
            }

            log.print("Source changed: " + filename, log.YELLOW);

            applyChange(false, "watch_src");
        }));
    }

    const assetsDir = path.join(settings.projectPath, settings.config.assets);

    if (fs.existsSync(assetsDir)) {
        watchers.push(fs.watch(assetsDir, { recursive: true }, (eventType, filename) => {
            log.print("Asset changed: " + filename, log.YELLOW);
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
    if (server) {
        return;
    }

    server = Bun.serve({
        hostname: "127.0.0.1",
        port: settings.config.port,
        fetch(req, server) {
            if (server.upgrade(req)) {
                return;
            }
            return new Response("WS failed upgrade", { status: 500 });
        },
        websocket: {
            open(ws) {
                ws.send(JSON.stringify({ message: "connected" }));
                ws.subscribe("reload");
                ws.subscribe("error");
                ws.subscribe("shutdown");
            },

            message(message) {
                console.log(message);
            },

            close(ws, code, message) {
                ws.unsubscribe("reload");
                ws.unsubscribe("error");
                ws.unsubscribe("shutdown");
            }
        }, // handlers
    });
}

export function reportError(error) {
    if (server) {
        server.publish("error", error);
    }
}

export function reload() {
    if (server) {
        setTimeout(() => {
            server.publish("reload", "reload");
        }, 60);
    }
}

process.on("exit", () => {
    if (server) {
        server.publish("shutdown", "shutdown");
    }
});