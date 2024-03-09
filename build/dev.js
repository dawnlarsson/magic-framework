// Watcher
const local = window.location;
var ws;
var lostConnection = false;
const maxLogLength = 1000;
var logs = [];

watch();

function watch() {
    ws = new WebSocket('ws://' + local.hostname + ':3000');
    ws.onmessage = (message) => {
        console.log(message);
        if (message.data === 'reload') {
            window.location.reload();
        }


    };

    ws.onclose = () => {
        ws.close();
        watch();
        lostConnection = true;
        update();
    };

    ws.onerror = (error) => {
        ws.close();
        update();
    }

    ws.onopen = () => {
        console.log('✨  Connected to Magic');
        lostConnection = false;
        update();
    };
}

// Intercept all console logs
const intercept_logfn = console.log
const intercept_warnfn = console.warn
const intercept_errfn = console.error

console.log = function () {
    logs.push(arguments)
    update()
    intercept_logfn(...arguments)
}

console.warn = function () {
    logs.push(arguments)
    update()
    intercept_warnfn(...arguments)
}

console.error = function () {
    logs.push(arguments)
    update()
    report(arguments)
    intercept_errfn(...arguments)
}

// Sends error reports to the server and device type/vendor name
function report(error) {
    if (ws) {
        if (ws.readyState === WebSocket.OPEN) {
            console.log('Sending error report to server')
            console.log(error)
            ws.send(JSON.stringify({ error: error }));
        }
    }
}

// Apend the animation css
const style = document.createElement('style')
style.innerHTML = `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; }}`
style.innerHTML += `@keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.1; } 100% { opacity: 1; }}`
document.head.appendChild(style)

// Styles
const bg = "background-color: #00000070; color: #ffffff; align-items: center; padding: 10px; -webkit-backdrop-filter: blur(5px); backdrop-filter: blur(5px); margin: 15px;"
const uibox = "position: fixed; top: 0; left: 0; display: flex; z-index: 999999;"

// Icons
const iconDisconnected = `<svg width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="m21.8 4.2.9 1.2 4.1 6L28 13H16.2l1-1.5 3.8-6 .8-1.3Zm0 3.6-2 3.2h4.3l-2.2-3.2Zm-8 18.2A10 10 0 0 0 6 18.2V26h7.8Zm2.2 2h7A19 19 0 0 0 4 9v19h12ZM6 16.2v-5A17 17 0 0 1 20.9 26h-5A12 12 0 0 0 6 16.2Z" fill="#FF005C"/></svg>`

const uicontainer = document.createElement('div')
uicontainer.style = uibox
uicontainer.style.display = 'none'
document.body.appendChild(uicontainer)

const containerDisconnected = document.createElement('div')
containerDisconnected.style = bg
uicontainer.appendChild(containerDisconnected)

const imageDisconnected = document.createElement('div')
imageDisconnected.innerHTML = iconDisconnected
imageDisconnected.style.animation = 'blink 1s infinite cubic-bezier(0.5, 0, 1, 1)'
containerDisconnected.appendChild(imageDisconnected)

const overlay = document.createElement('div')
overlay.style.position = 'fixed'
overlay.style.top = '0'
overlay.style.left = '0'
overlay.style.width = '100%'
overlay.style.height = '100%'
overlay.style.backgroundColor = 'rgba(0,0,0,0.5)'
overlay.style.zIndex = '100000'
overlay.style.display = 'none'

const logContainer = document.createElement('div')
logContainer.style.position = 'absolute'
logContainer.style.top = '0'
logContainer.style.left = '0'
logContainer.style.width = '100%'
logContainer.style.height = '100%'
logContainer.style.overflow = 'auto'
logContainer.style.padding = '20px'
logContainer.style.color = 'white'
logContainer.style.fontFamily = 'monospace'
logContainer.style.whiteSpace = 'pre-wrap'
logContainer.style.zIndex = '100000'
overlay.appendChild(logContainer)

overlay.style.animation = 'fadeIn 0.5s'
overlay.style.animationFillMode = 'forwards'
uicontainer.style.animation = 'fadeIn 0.5s'
uicontainer.style.animationFillMode = 'forwards'

document.body.appendChild(overlay)

function update() {
    let logString = ''
    for (let i = 0; i < logs.length; i++) {
        logString += logs[i] + '\n'
    }
    logContainer.innerText = logString

    if (lostConnection) {
        overlay.style.display = 'none'
        uicontainer.style.display = 'flex'
    } else {
        overlay.style.display = 'none'
        uicontainer.style.display = 'none'
        logs = [];
    }

    if (logs.length > maxLogLength) {
        logs = logs.slice(logs.length - maxLogLength)
    }

    logContainer.scrollTop = logContainer.scrollHeight
}

