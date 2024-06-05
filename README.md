<br>
<div>
  <img align="left" src="./assets/mf_logo.svg" height="48px" alt="Magic Framework Logo" hspace="24">
    <a href="https://www.npmjs.com/package/magic-framework">
      <img align="right" src="https://img.shields.io/npm/v/magic-framework.svg" alt="npm version">
    </a>
</div>
<br>
<br><br><br>
<div align=center>
  <br>
  
  ```npx magic-framework new <folder-name>```
  <br><br>
  Bun runtime is currently only supported.
</div>

## 🔮 Features
### Core Functionality
- CLI & Project creation
- CLI <--> Client debug bridge, connection status overlay
- Assets & Project hot-reloading
- Project bundling

### Development Tools
- Data-driven per-instance state machine
- Input support (keyboard, mouse, mobile touch, controllers (Xbox))
- Binary static asset bundler

### Work In Progress
- Math utilities
- Audio capabilities
- Blazingly fast logging™

## ⚗️ TODOs
### Build and Asset Management
- Build step version of stateInstancer
- MOF: Magic 3D Object Format
- Mesh and material builder
- Use web workers to load/parse asset bundle
- Investigate: wasm module hot reload
- Investigate: image formats, custom wasm decoder?
- Investigate: Zig support (wasm)

### Audio Enhancements
- Volume control
- Pitch adjustment

### Blender Integration
- Find local version of Blender
- Overwrite MOF exporter script
- .blend hot-reload exporter

### Performance and Reloading
- Chunked hot reload (no full rebuild)
- WebGPU & WebGL integration

# 🪄 License
Magic Framework is licensed under MIT.

Logos and visual assets are created and copyright held by Alve Larsson, 2024.
