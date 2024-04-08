// Watcher
const local = window.location;
var ws;
var lostConnection = false;
const maxLogLength = 1000;
var logs = [];

const MAGIC_SERVER = window.location.protocol === "https:" ? 'wss://' : 'ws://' + local.hostname + ':' + MAGIC_PORT;

// Intercept all console logs
const logfn = console.log
const warnfn = console.warn
const errfn = console.error

function watch() {
    ws = new WebSocket(MAGIC_SERVER);
    console.log(ws.readyState)
    ws.onmessage = (message) => {
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
        lostConnection = false;
        update();
    };
}

var hasBufferdReports = false;
var reportBuffer = [];

function report(rep) {

    if (ws.readyState !== 1) {
        hasBufferdReports = true;
        reportBuffer.push(rep);
        return;
    }

    ws.send(rep);
}


watch();

/*
console.log = function (log) {
    logs.push(log)
    update()
}

console.warn = function (w) {
    logs.push("WARN#" + w)
    update()
}
*/

console.error = function (err) {
    errfn(err)
    logs.push("ERR#" + err)
    update()
    report(err)
}

// Icons
const ICON_DISCONNECTED = `<svg class="magic-blink" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="m21.8 4.2.9 1.2 4.1 6L28 13H16.2l1-1.5 3.8-6 .8-1.3Zm0 3.6-2 3.2h4.3l-2.2-3.2Zm-8 18.2A10 10 0 0 0 6 18.2V26h7.8Zm2.2 2h7A19 19 0 0 0 4 9v19h12ZM6 16.2v-5A17 17 0 0 1 20.9 26h-5A12 12 0 0 0 6 16.2Z" fill="#FF406C"/></svg>`

const MAGIC_STYLE = `<style>
#magic-layer{
position: fixed;
display: flex;
flex-direction: column;
top: 0;
left: 0;
width: 100%;
height: 100%;
margin: 16px;
z-index: 9999999;
font-family: monospace;
animation: fadeIn 0.5s;
pointer-events: none;
gap: 16px;
animation: magic-fadeIn 1s 1 ease-in-out;
}
.magic-bg {
background-color: #00000050;
width: fit-content;
height: fit-content;
max-width: 100%;
max-height: 100%;
color: #ffffff;
align-items: center;
padding: 10px;
-webkit-backdrop-filter: blur(5px);
backdrop-filter: blur(5px);
transition: opacity 0.5s;
}
.magic-red{
background-color: #30000060;
}
.magic-blink {
animation: magic-blink 0.9s infinite cubic-bezier(0.4, 0, 0.2, 1);
}
#magic-logs {
max-height: 80%;
overflow-y: auto;
animation: magic-fadein 1.5s 1;
}
#magic-log-list {
display: flex;
flex-direction: column;
gap: 8px;
}
#magic-log-list div:nth-child(even) {
opacity: 0.8;
}
.hidden {
    display:block;
    opacity: 0 !important;
}
.magic-err {
color: #FF508C;
}
.magic-err::before {
content: "⛔ "
};
.magic-itm::before {
color: #ffffff;
content: "  ";
}
@keyframes magic-fadeIn { 0% { opacity: 0; } 100% { opacity: 1; }}
@keyframes magic-blink { 0% { opacity: 1; } 50% { opacity: 0.1; } 100% { opacity: 1; }}
</style>`;

const MAGIC_LAYER = `
<div id="magic-layer">
    <div id="magic-disconnect" class="magic-bg magic-red hidden">${ICON_DISCONNECTED}</div>
    <div id="magic-logs" class="magic-bg">
        <div id="magic-log-list">
        </div>
    </div>
</div>
` + MAGIC_STYLE;

document.body.insertAdjacentHTML('beforeend', MAGIC_LAYER)
const overlay = document.getElementById('magic_layer')

const disconnect = document.getElementById('magic-disconnect');
const logList = document.getElementById('magic-log-list');

function update() {
    if (lostConnection) {
        disconnect.classList.remove('hidden');
    } else {
        disconnect.classList.add('hidden');
    }

    if (logs.length > maxLogLength) {
        logs.shift();
    }

    logList.innerHTML = logs.map((log) => {

        let error = log.includes('ERR#');
        if (error) {
            log = log.replace('ERR#', '');
        }

        return `<div class="${error ? 'magic-err' : 'magic-itm'}">${log}</div>`;


    }).join('');

    report("Test error message")

    if (hasBufferdReports) {
        if (ws.readyState === 1) {
            hasBufferdReports = false;

            var copyBuffer = reportBuffer;
            reportBuffer = [];

            copyBuffer.forEach(report);
        }
    }

}
