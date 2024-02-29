#!/usr/bin/env node
'use strict';

console.time("⌛️   Magic total runtime");

import * as settings from "./build/settings.js";

async function main() {
    console.log("");
    settings.print("✨   Magic Framework", settings.color.magenta);
    settings.warn("Magic is in a early work in progress state, expect bugs & todos!");
    console.log("");

    settings.load();

    const args = process.argv.slice(2);
    await settings.parse(args);

    console.log(settings.color.green);
    console.timeEnd("⌛️   Magic total runtime");
    console.log(settings.color.reset);
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        settings.error(e);
        process.exit(1);
    });