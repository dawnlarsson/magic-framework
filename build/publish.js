import * as magic from "./settings.js";
import * as fs from "fs";
import * as path from "path";
import process from "process";

const cwd = process.cwd();
const configPath = path.join(cwd, "package.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

const version = config.version;

const registry = await fetch("https://registry.npmjs.org/magic-framework");

const registryJson = await registry.json();

const registryVersion = registryJson["dist-tags"].latest;

var publishType = "patch"

magic.print("Prepping to publish a " + publishType + " version!", magic.color.magenta);

if (process.argv.length > 2) {
    publishType = process.argv[2];
}

// Create the new version
var newVersion = version.split(".");
var newRegistryVersion = registryVersion.split(".");

// if this local version is greater than the registry version then just skip incrementing the version
if (newVersion[0] > newRegistryVersion[0] || newVersion[1] > newRegistryVersion[1] || newVersion[2] > newRegistryVersion[2]) {
    magic.error("Local version is greater than the registry version");
    process.exit(0);
}

if (publishType === "major") {
    newVersion[0] = parseInt(newVersion[0]) + 1;
    newVersion[1] = 0;
    newVersion[2] = 0;
}

if (publishType === "minor") {
    newVersion[1] = parseInt(newVersion[1]) + 1;
    newVersion[2] = 0;
}

if (publishType === "patch") {
    newVersion[2] = parseInt(newVersion[2]) + 1;
}

newVersion = newVersion.join(".");

magic.print("\ncurrent version: " + version + magic.color.green + "  ----> [ " + newVersion + " ] ", magic.color.magenta);

// Update the package.json
config.version = newVersion;

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

fs.writeFileSync(path.join(cwd, "build", "version.js"), "export const version = \"" + newVersion + "\";");