#!/usr/bin/env node
'use strict';

console.time("magic total runtime");

import * as settings from "./build/settings.js";

async function main() {
    settings.print("Magic Framework ✨", settings.color.magenta);
    settings.warn("Magic is in a early work in progress state, expect bugs & todos!");

    await settings.load();

    const args = process.argv.slice(2);
    settings.parse(args);

    console.timeEnd("magic total runtime");
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(settings.color.red + "[FATAL MAGIC]: " + settings.color.yellow + e + settings.color.reset);
        process.exit(1);
    });