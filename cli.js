#!/usr/bin/env node
'use strict';

import * as settings from "./build/settings.js";
import * as log from "./build/log.js";

console.time(log.timer);
process.on('exit', () => { console.timeEnd(log.timer) });

async function main() {
    log.write(log.magenta + "✨   Magic Framework" + log.reset + "\nMagic is in a early work in progress state, expect bugs & todos!\n\n");

    settings.load();
    const target = await settings.parse(process.argv.slice(2));

    if (target == null) return;

    target();
}

main()
    .catch((e) => {
        log.error(e);
        process.exit(1);
    });
