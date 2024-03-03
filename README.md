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

<hr>

### Current roster
- Data driven per instance state machine
- Input (keyboard, mouse, mobile touch, controllers (Xbox))
- Binary static asset bundler
- Math stuff (WIP)
- Audio (WIP)

### TODOs:
- GYRO input support
- Build step version if stateInstancer
- Audio: volume, pitch
- MOF: Magic 3D Object Format
- Mesh and material builder
- Use web workers to load/parse asset bundle
- Support bun bun
- Blender: Find local version
- Blender: overwrite MOF exporter script
- Blender: .blend hot-reload exporter
- Chunked hot reload (no full rebuild)
- Webgpu & WebGL stuff
- Investigate: in-browser hot-reloading
- Investigate: wasm module hot reload