/// TODO: make a "static" runtime version of this as a build step

var instances: any[] = [];
var previousState: Uint16Array[] = [];
var transFunctions: Uint8Array[] = [];

export var totalInstances = 0;

export function init(instList: any[], params: any = {}) {

    instances = instList;

    for (let i = 0; i < instances.length; i++) {
        var stateCount = instances[i].states.length;
        totalInstances += instances[i].BUDGET;

        previousState.push(new Uint16Array(instances[i].BUDGET).fill(-1));
        transFunctions.push(new Uint8Array(2 + (stateCount * 2)).fill(0));

        if (instances[i]['pre_update']) {
            transFunctions[i][0] = 1;
        }

        if (instances[i]['post_update']) {
            transFunctions[i][1] = 1;
        }

        for (let s = 0 + 2; s < (stateCount - 2); s++) {

            // Check if the instance has a first_(state) function
            if (instances[i]['first_' + instances[i].state[s]]) {
                transFunctions[i][s] = 1;
            }

            if (instances[i]['last_' + instances[i].state[s]]) {
                transFunctions[i][s + 1] = 1;
            }
        }

        if (instances[i]['init']) {
            instances[i]['init'](params);
        }

    }

}

export function update(delta: number) {
    for (let i = 0; i < instances.length; i++) {

        if (transFunctions[i][0]) {
            instances[i]['pre_update'](delta);
        }

        for (let s = 0; s < instances[i].BUDGET; s++) {

            if (instances[i].state[s] !== previousState[i][s]) {

                if (transFunctions[i][2 + instances[i].state[s + 1]] == 1) {
                    instances[i]['last_' + instances[i].state[s]](s, delta);
                }

                previousState[i][s] = instances[i].state[s];

                if (transFunctions[i][2 + instances[i].state[s]] == 1) {
                    instances[i]['first_' + instances[i].state[s]](s, delta);
                }
            }

            instances[i].states[instances[i].state[s]](s, delta);

            instances[i].update(s, delta);
        }

        if (transFunctions[i][1]) {
            instances[i]['post_update'](delta);
        }

    }
}