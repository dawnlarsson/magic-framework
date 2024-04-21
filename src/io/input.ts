var gamepads = navigator.getGamepads();

// TODO: cover more input types
// TODO: explore changing the map to a Float32Array and generate a key module
export var map = {
    mouseX: 0.0,
    mouseY: 0.0,
    mouseXDiff: 0.0,
    mouseYDiff: 0.0,
    forward: 0.0,
    backward: 0.0,
    left: 0.0,
    right: 0.0,
    shift: false,
    primary: false,
    primaryDown: false,
    primaryUp: false,
    secondary: false,
    secondaryDown: false,
    secondaryUp: false
}

export function reset() {
    for (let key in map) {
        map[key] = 0.0
    }
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
            map.backward = val
            break
        case 'ArrowLeft':
        case 'KeyA':
            map.left = val
            break
        case 'ArrowRight':
        case 'KeyD':
            map.right = val
            break
        case 'ShiftLeft':
            map.shift = false
            break
    }
}

export function update() {
    gamepads.forEach((gamepad) => {
        if (!gamepad) return

        map.primary = map.primary || (gamepad.buttons[0] || gamepad.buttons[7])
        map.secondary = map.secondary || (gamepad.buttons[1] || gamepad.buttons[6])

        if (gamepad.axes[0] > 0.6) {
            map.right = gamepad.axes[0]
        } else {
            map.right = 0.0
        }

        if (gamepad.axes[0] < -0.6) {
            map.left = gamepad.axes[0]
        } else {
            map.left = 0.0
        }
    });
}

export function lateUpdate() {
    map.primary = false
    map.secondary = false
    map.primaryUp = false
    map.secondaryUp = false
    map.mouseXDiff = 0.0
    map.mouseYDiff = 0.0
}

export function vibrate(strength = 1, duration = 100) {
    gamepads.forEach((gamepad) => {
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

    window.addEventListener('gamepadconnected', (e) => { gamepads = navigator.getGamepads() })
    window.addEventListener('gamepaddisconnected', (e) => { gamepads = navigator.getGamepads() })

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

    var lastMouseX: number = 0
    var lastMouseY: number = 0
    window.addEventListener('mousemove', (e) => {
        map.mouseX = e.movementX
        map.mouseY = e.movementY

        map.mouseXDiff = map.mouseX - lastMouseX
        map.mouseYDiff = map.mouseY - lastMouseY

        lastMouseX = e.movementX
        lastMouseY = e.movementY
    })

    window.addEventListener('touchstart', (e) => {
    })

    window.addEventListener('touchend', (e) => {
        reset()
    })

    var lastTouchX: number = 0
    var lastTouchY: number = 0
    window.addEventListener('touchmove', (e) => {
        map.mouseX = e.touches[0].clientX
        map.mouseY = e.touches[0].clientY

        map.mouseXDiff = map.mouseX - lastTouchX
        map.mouseYDiff = map.mouseY - lastTouchY

        lastTouchX = map.mouseX
        lastTouchY = map.mouseY
    })

    window.addEventListener('mousedown', (e) => {
        if (e.button == 0) {
            map.primary = true
            map.primaryDown = true
        }
        if (e.button == 2) {
            map.secondary = true
            map.secondaryDown = true
        }
    }
    )

    window.addEventListener('mouseup', (e) => {
        if (e.button == 0) {
            if (map.primaryDown) map.primaryUp = true
            map.primaryDown = false
        }
        if (e.button == 2) {
            if (map.secondaryDown) map.secondaryUp = true
            map.secondaryDown = false
        }
    }
    )
}