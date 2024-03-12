import { COMMANDS, COMMAND_SPACING } from "./settings.js";
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
} else {

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

    fs.writeFileSync(path.join("build", "version.js"), "export const VERSION = \"" + newVersion + "\";");
}

const README_PATH = path.join(process.cwd(), "README.md");
const README = fs.readFileSync(README_PATH, "utf8");

var buffer = "## Commands\n";
var flags = "## Flags\n";

for (let command of COMMANDS) {
    if (command.type === "flag") {
        flags += `- \`${command.name}\``.padEnd(COMMAND_SPACING) + `  ${command.description}\n`;
    } else {
        buffer += `- \`${command.name} ${command.takesPath ? "<path>" : ""}\``.padEnd(COMMAND_SPACING) + `  ${command.description}\n`;
    }
}

const newReadme = README.replace(/## Commands[\s\S]*##/, buffer + "\n##");

fs.writeFileSync(README_PATH, newReadme);

const WATCH_PATH = path.join(process.cwd(), "build", "watch.js");
const WATCH = fs.readFileSync(WATCH_PATH, "utf8");

const newWatch = WATCH.replace("const DEV_MODE = true;", "const DEV_MODE = false;");
fs.writeFileSync(WATCH_PATH, newWatch);