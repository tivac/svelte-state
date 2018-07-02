const name = (state, event) => `${state}->${event}`;

class Machine {
    constructor(config) {
        this.config = config;

        this.emitter = this._setupEmitter();
        this.states = this._setupStates();
        this.transitions = this._setupTransitions();

        // Provide an easy way to grab a state from outside
        this.get = this.states.get.bind(this.states);
    }

    _setupEmitter() {
        const { emitter } = this.config;

        [ "on", "off", "once", "onAny", "offAny" ].forEach((fn) => {
            this[fn] = emitter[fn].bind(emitter);
        });

        return emitter;
    }

    _setupStates() {
        const states = new Map();
        const keys = Object.keys(this.config.states).sort();
        
        keys.forEach((key) => {
            if(states.has(key)) {
                throw new Error(`Duplicate state added: ${key}`);
            }

            states.set(key, Object.assign(
                Object.create(null),
                {
                    state    : key,
                    parent   : false,
                    children : new Set(),
                },
                this.config.states[key]
            ));

            const parts = key.split("/").slice(1);

            if(parts.length === 1) {
                return;
            }

            // Walk downwards through the states updating values
            parts.reduce((parent, part, idx) => {
                const state = `/${parts.slice(0, idx + 1).join("/")}`;

                if(!parent) {
                    return state;
                }

                // Add this state to children array on its parent
                const { children } = states.get(parent);

                children.add(state);

                // Update this state w/ the name of its parent
                const current = states.get(state);
                
                current.parent = parent;

                states.set(state, current);

                return state;
            }, false);
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

                transitions.set(name(source, event), {
                    dest : result,
                });
            });
        });

        return transitions;
    }

    _findTransition(event) {
        const { state, states, transitions } = this;

        let current = states.get(state);
        let id = name(current.state, event);
        let transition = transitions.get(id);

        while(!transition && current.parent) {
            current = states.get(current.parent);
            id = name(current.state, event);
            transition = transitions.get(id);
        }

        return transition;
    }

    // TODO: what are options?
    trigger(event, options) {
        const { state, emitter } = this;
        
        const transition = this._findTransition(event);

        if(!transition) {
            throw new Error(`Unknown transition: ${state} -> ${event}`);
        }

        const { dest : curr } = transition;

        const details = {
            event,
            options,
            prev : this.states.get(state),
            curr : this.states.get(curr),
        };

        emitter.emit(`exit`, details);
        emitter.emit(`exit:${state}`, details);
        emitter.emit(`enter`, details);
        emitter.emit(`enter:${curr}`, details);

        this.state = curr;
    }

    // TODO: This shares a lot of code w/ trigger(), worth combining somehow?
    start() {
        const { config, emitter, states } = this;

        let curr;

        if(config.initial) {
            curr = config.initial;
        } else {
            curr = Object.keys(config.states)[0];
        }

        const details = {
            curr : states.get(curr),
        };

        emitter.emit(`enter`, details);
        emitter.emit(`enter:${curr}`, details);

        this.state = curr;
    }
}

export default Machine;
