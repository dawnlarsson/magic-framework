#!/usr/bin/env node
'use strict';

import * as settings from "./build/settings.js";
import * as log from "./build/log.js";

console.time(log.timer);

async function main() {
    log.print("✨   Magic Framework", log.magenta);
    log.warn("Magic is in a early work in progress state, expect bugs & todos!\n");

    settings.load();
    const target = await settings.parse(process.argv.slice(2));

    console.timeEnd("parse");

    if (target == null) return;

    target();
}

main()
    .then(() => end(0))
    .catch((e) => {
        log.error(e);
        end(1);
    });

function end(c) {
    log.flush();
    console.timeEnd(log.timer);
    process.exit(c);
}