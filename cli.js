#!/usr/bin/env node
'use strict';

console.time("Magic runtime");

import * as log from "./build/log.js";
import * as settings from "./build/settings.js";
import * as user from "./build/user.js";

async function main() {
    const args = process.argv.slice(2);
    
    user.load();

    const command = settings.parse(args);
    settings.load();

    if(!command) {
        settings.help();
        return;
    }

    command.function(command.arguments);
}

main()
    .catch((e) => {
        log.error(e);
        process.exit(1);
    });
