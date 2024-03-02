import * as magic from "./settings.js";
import * as log from "./log.js";
import * as fs from "fs";
import * as path from "path";
import process from "process";

const CONFIG_PATH = path.join(process.cwd(), "package.json");
const CONFIG = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));

const REGISTRY_URL = await fetch("https://registry.npmjs.org/magic-framework");
const REGISTRY_JSON = await REGISTRY_URL.json();

var publishType = "patch"

log.print("Prepping to publish a " + publishType + " version!", log.MAGENTA);

if (process.argv.length > 2) {
    publishType = process.argv[2];
}

// Create the new version
var newVersion = CONFIG.version.split(".");
const REGISTRY_VERSION = REGISTRY_JSON["dist-tags"].latest.split(".");

// if this local version is greater than the registry version then just skip incrementing the version
if (newVersion[0] > REGISTRY_VERSION[0] || newVersion[1] > REGISTRY_VERSION[1] || newVersion[2] > REGISTRY_VERSION[2]) {
    log.error("Local version is greater than the registry version");
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

log.print("\ncurrent version: " + CONFIG.version + log.GREEN + "  ----> [ " + newVersion + " ] ", log.MAGENTA);

// Update the package.json
CONFIG.version = newVersion;

fs.writeFileSync(CONFIG_PATH, JSON.stringify(CONFIG, null, 2));

fs.writeFileSync(path.join(cwd, "build", "version.js"), "export const VERSION = \"" + newVersion + "\";");