# Magic Framework
<a href="https://www.npmjs.com/package/magic-framework">
  <img src="https://img.shields.io/npm/v/magic-framework.svg" alt="npm version">
</a>

A collection of utils and implementations for web games,
with the goal of making web games concerned about speed and bundle size easy.
some parts are ported from my private Zig engine.

Written in Typescript (mostly)

## New magic project
```npx magic-framework new <folder-name>```

## Commands
- `help `             Show this help message
- `version `          Show the version number and exit
- `new <path>`        Create a new project at the path
- `dev <path>`        Start development mode
- `build <path>`      Build the project
- `setup <path>`      Setup a config file in the current directory
- `bundle <path>`     Bundle the project

## TODOs:
- Build step version if stateInstancer
- Audio: volume, pitch
- MOF: Magic 3D Object Format
- Mesh and material builder
- Use web workers to load/parse asset bundle
- Blender: Find local version
- Blender: overwrite MOF exporter script
- Blender: .blend hot-reload exporter
- Chunked hot reload (no full rebuild)
- Webgpu & WebGL stuff
- Investigate: in-browser hot-reloading
- Investigate: wasm module hot reload
- Investigate: Image formats, custom wasm decoder? 
- Investigate: Zig support (wasm)