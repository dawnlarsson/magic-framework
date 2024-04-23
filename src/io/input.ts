export const AXIS_DEADZONE = 0.6
export const THRESHOLD = 0.5

// TODO: cover more input types
// TODO: explore changing the map to a Float32Array and generate a key module
export var map = {
    mouseX: 0.0,
    mouseY: 0.0,
    forward: 0.0,
    left: 0.0,
    shift: 0.0,
    primary: 0.0,
    secondary: 0.0,
}

export function reset() {
    for (let key in map) {
        map[key] = 0.0
    }
}

export function button(val, impulse = 0.0) {
    if (impulse != 0.0) return impulse
    if (val <= THRESHOLD) return -1.0
    return 0.0
}

export function axis(val) {
    if (val > AXIS_DEADZONE) return -1.0
    if (val < -AXIS_DEADZONE) return 1.0
    return 0.0
}

export function down(key) {
    if (map[key] >= THRESHOLD) return true
    return false
}

export function up(key) {
    if (map[key] <= -THRESHOLD) return true
    return false
}

// updates a primary directional key
// this is todo
function set(e, val) {
    switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
            map.forward = val
            break
        case 'ArrowDown':
        case 'KeyS':
            map.forward = val
            break
        case 'ArrowLeft':
        case 'KeyA':
            map.left = val
            break
        case 'ArrowRight':
        case 'KeyD':
            map.left = -val
            break
        case 'ShiftLeft':
            map.shift = button(map.shift, val)
            break
    }
}

export function update() {
    navigator.getGamepads().forEach((gamepad) => {
        if (!gamepad) return

        map.primary = button(map.primary, gamepad.buttons[0].value + gamepad.buttons[7].value)
        map.secondary = button(map.secondary, gamepad.buttons[1].value + gamepad.buttons[6].value)
        map.left = axis(gamepad.axes[0])
        map.forward = axis(gamepad.axes[1])
    });
}

export function lateUpdate() {
    map.mouseX = 0.0
    map.mouseY = 0.0
}

export function vibrate(strength = 1, duration = 100) {
    if (window.magic_hook_vibrate) return window.magic_hook_vibrate(strength, duration)

    navigator.getGamepads().forEach((gamepad) => {
        if (!gamepad) return

        gamepad.vibrationActuator.playEffect('dual-rumble', {
            duration: duration,
            strongMagnitude: strength,
            weakMagnitude: strength
        })
    })
}

export function setup() {

    window.addEventListener('contextmenu', (e) => {
        e.preventDefault()
    })

    window.addEventListener('blur', (e) => {
        reset()
    })

    window.addEventListener('focusout', (e) => {
        reset()
    })

    window.addEventListener('focus', (e) => {
        reset()
    })

    window.addEventListener('keydown', (e) => {
        set(e, 1.0)
    })

    window.addEventListener('keyup', (e) => {
        set(e, 0.0)
    })

    window.addEventListener('pointerdown', (e) => {
        if (e.button == 0) {
            map.primary = button(map.primary, 1.0)
        }
        if (e.button == 2) {
            map.secondary = button(map.secondary, 1.0)
        }
    })

    window.addEventListener('pointerup', (e) => {
        if (e.button == 0) {
            map.primary = button(map.primary, 0.0)
        }
        if (e.button == 2) {
            map.secondary = button(map.secondary, 0.0)
        }
    })

    // Movment using pointer events
    window.addEventListener('pointermove', (e) => {
        map.mouseX = e.movementX
        map.mouseY = e.movementY
    })
}