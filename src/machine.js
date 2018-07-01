const key = (state, name) => `${state}->${name}`;

class Machine {
    constructor(config) {
        this.config = config;

        this.states = this.setupStates();
        this.transitions = this.setupTransitions();
        this.state = config.initial || config.states[0];
    }

    setupStates() {
        const states = new Map();
        const local = this.config.states.slice().sort();
        
        local.forEach((state) => {
            const parts = state.split("/").slice(1);

            parts.forEach((part, idx) => {
                const id = `/${part}`;

                if(states.has(id)) {
                    return;
                }

                const parent = parts[idx - 1] ? `/${parts[idx - 1]}` : null;

                if(parent) {
                    const { children } = states.get(parent);

                    children.add(id);
                }

                states.set(id, {
                    state,
                    parent,
                    children : new Set(),
                });
            });
        });

        return states;
    }

    setupTransitions() {
        const transitions = new Map();
        const local = this.config.transitions;

        local.forEach(([ event, sources, dest ]) => {
            sources.forEach((source) => {
                const { children } = map.get(dest);

                // Iterators are ridiculous-looking, fyi
                const result = children.size ? children.values().next().value : dest;

                transitions.set(key(source, event), {
                    dest : result,
                });
            });
        });

        return transitions;
    }

    // TODO: handle options
    trigger(event, options) {
        let current = this.states.get(this.state);
        let id = key(current.state, event);
        let transition = this.transitions.get(id);

        while(!transition && current.parent) {
            current = this.states.get(current.parent);
            id = key(current.state, event);
            transition = this.transitions.get(id);
        }

        if(!transition) {
            throw new Error(`Unknown transition: ${this.state} -> ${event}`);
        }

        this.state = transition.dest;
    }
}

export default Machine;
