var gamepads = navigator.getGamepads();

// TODO: cover more input types
// TODO: explore changeing the map to a Float32Array and generate a key moduel
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

function keyReset() {
    map.mouseX = 0.0
    map.mouseY = 0.0
    map.mouseXDiff = 0.0
    map.mouseYDiff = 0.0
    map.forward = 0.0
    map.backward = 0.0
    map.left = 0.0
    map.right = 0.0
    map.shift = false
    map.primary = false
    map.primaryDown = false
    map.primaryUp = false
    map.secondary = false
    map.secondaryDown = false
    map.secondaryUp = false
}

function keydown(e) {
    switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
            map.forward = 1.0
            break
        case 'ArrowDown':
        case 'KeyS':
            map.backward = 1.0
            break
        case 'ArrowLeft':
        case 'KeyA':
            map.left = 1.0
            break
        case 'ArrowRight':
        case 'KeyD':
            map.right = 1.0
            break
        case 'ShiftLeft':
            map.shift = true
            break
    }
}

function keyup(e) {
    switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
            map.forward = 0.0
            break
        case 'ArrowDown':
        case 'KeyS':
            map.backward = 0.0
            break
        case 'ArrowLeft':
        case 'KeyA':
            map.left = 0.0
            break
        case 'ArrowRight':
        case 'KeyD':
            map.right = 0.0
            break
        case 'ShiftLeft':
            map.shift = false
            break
    }
}

export function update() {

    for (let i = 0; i < gamepads.length; i++) {
        const gamepad = gamepads[i];
        if (!gamepad) {
            break;
        }

        if (gamepad.buttons[0].pressed || gamepad.buttons[7].pressed) {
            if (!map.primaryDown) {
                map.primary = true
                map.primaryDown = true
            }
        } else {
            if (map.primaryDown) map.primaryUp = true
            map.primaryDown = false
        }

        if (gamepad.buttons[1].pressed || gamepad.buttons[6].pressed) {
            if (!map.secondaryDown) {
                map.secondary = true
                map.secondaryDown = true
            }
        } else {
            if (map.secondaryDown) map.secondaryUp = true
            map.secondaryDown = false
        }

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
    }
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
        keyReset()
    })

    window.addEventListener('focusout', (e) => {
        keyReset()
    })

    window.addEventListener('focus', (e) => {
        keyReset()
    })

    window.addEventListener('keydown', (e) => {
        keydown(e)
    })

    window.addEventListener('keyup', (e) => {
        keyup(e)
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
        keyReset()
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