#!/usr/bin/env node
'use strict';

import * as settings from "./build/settings.js";
import * as log from "./build/log.js";
import * as user from "./build/user.js";

console.time(log.TIMER_SIG);
process.on('exit', () => { console.timeEnd(log.TIMER_SIG) });

async function main() {
    user.load();

    log.write(log.MAGENTA + "✨   Magic Framework" + log.RESET + "\nMagic is in a early work in progress state, expect bugs & todos!\n\n");

    var args = process.argv.slice(2);
    if (args.length !== 0) {
        if (args[0] === "#DEV") {
            settings.devMode();
            args.shift();
        }
    }

    const target = settings.parse(args);
    settings.load();

    if (target == null) {
        settings.help();
        return;
    }

    target();
}

main()
    .catch((e) => {
        log.error(e);
        process.exit(1);
    });
