#!/usr/bin/env node
'use strict';

import * as settings from "./build/settings.js";
import * as log from "./build/log.js";
import * as user from "./build/user.js";

console.time(log.TIMER_SIG);
process.on('exit', () => { console.timeEnd(log.TIMER_SIG) });

async function main() {
    log.write(log.MAGENTA + "✨   Magic Framework" + log.RESET + "\nMagic is in a early work in progress state, expect bugs & todos!\n\n");

    user.load();
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
