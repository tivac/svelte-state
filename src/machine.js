import Emitter from "emittery";

const key = (state, name) => `${state}->${name}`;

class Machine {
    constructor(config) {
        this.config = config;

        this.emitter = this._setupEmitter();
        this.states = this._setupStates();
        this.transitions = this._setupTransitions();

        this.state = config.initial || config.states[0];
    }

    _setupEmitter() {
        const emitter = new Emitter();

        [ "on", "off", "once", "onAny", "offAny" ].forEach((fn) => {
            this[fn] = emitter[fn].bind(emitter);
        });

        return emitter;
    }

    _setupStates() {
        const states = new Map();
        const local = this.config.states.slice().sort();
        
        local.forEach((state) => {
            const parts = state.split("/").slice(1);

            parts.forEach((part, idx) => {
                const id = `/${parts.slice(0, idx + 1).join("/")}`;

                if(states.has(id)) {
                    return;
                }

                const parent = idx > 0 ? `/${parts.slice(0, idx).join("/")}` : null;

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

    _setupTransitions() {
        const transitions = new Map();
        const local = this.config.transitions;

        local.forEach(([ event, sources, dest ]) => {
            sources.forEach((source) => {
                const { children } = this.states.get(dest);

                // Iterators are ridiculous-looking, fyi
                const result = children.size ? children.values().next().value : dest;

                transitions.set(key(source, event), {
                    dest : result,
                });
            });
        });

        return transitions;
    }

    findTransition(event) {
        const { state, states, transitions } = this;

        let current = states.get(state);
        let id = key(current.state, event);
        let transition = transitions.get(id);

        while(!transition && current.parent) {
            current = states.get(current.parent);
            id = key(current.state, event);
            transition = transitions.get(id);
        }

        return transition;
    }

    // TODO: what are options?
    trigger(event, options) {
        const { state : state, emitter } = this;
        
        const transition = this.findTransition(event);

        if(!transition) {
            throw new Error(`Unknown transition: ${state} -> ${event}`);
        }

        const { dest : curr } = transition;

        const details = {
            prev : this.states.get(state),
            curr : this.states.get(curr),
        };

        emitter.emit(`exit`, details);
        emitter.emit(`exit:${state}`, details);
        emitter.emit(`enter`, details);
        emitter.emit(`enter:${curr}`, details);

        this.state = curr;
    }
}

export default Machine;
