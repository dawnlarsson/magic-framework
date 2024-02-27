/// TODO: make a "static" runtime version of this as a build step

var instances: any[] = [];
var previousState: Uint16Array[] = [];
var transFunctions: Uint8Array[] = [];

export var totalInstances = 0;

export function init(instList: any[]) {

    instances = instList;

    for (let i = 0; i < instances.length; i++) {
        var stateCount = instances[i].states.length;
        totalInstances += instances[i].BUDGET;

        previousState.push(new Uint16Array(instances[i].BUDGET).fill(-1));
        transFunctions.push(new Uint8Array(stateCount * 2).fill(0));

        for (let s = 0; s < stateCount; s++) {

            // Check if the instance has a first_(state) function
            if (instances[i]['first_' + instances[i].state[s]]) {
                transFunctions[i][s] = 1;
            }

            if (instances[i]['last_' + instances[i].state[s]]) {
                transFunctions[i][s + 1] = 1;
            }
        }
    }

}

export function update(delta: number) {
    for (let i = 0; i < instances.length; i++) {

        for (let s = 0; s < instances[i].BUDGET; s++) {
            instances[i].update(s, delta);

            if (instances[i].state[s] !== previousState[i][s]) {

                if (transFunctions[i][instances[i].state[s + 1]]) {
                    instances[i]['last_' + instances[i].state[s]](s);
                }

                previousState[i][s] = instances[i].state[s];

                if (transFunctions[i][instances[i].state[s]]) {
                    instances[i]['first_' + instances[i].state[s]](s);
                }
            }

            instances[i].states[instances[i].state[s]](s);
        }

    }
}