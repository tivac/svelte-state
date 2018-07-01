import { Machine } from "xstate";
import Emitter from "emittery";

const oneStates = {
    initial : "selection",

    states : {
        selection : {
            on : {
                SELECTED : "selected"
            }
        },

        selected : {
            initial : "one",

            states : {
                one : {},
                two : {},
                three : {}
            },

            on : {
                ONE : ".one",
                TWO : ".two",
                THREE : ".three"
            }
        }
    }
};

const machine = Machine({
    key: 'routing',
    initial: 'home',
    states: {
        home: {},
        one: {
            ...oneStates
        },
        two: {},
        three: {},
    },
    on : {
        HOME : ".home",
        ONE : ".one",
        TWO : ".two",
        THREE : ".three",
    }
});

let state = machine.initialState;

const emitter = new Emitter();

const transition = (event, args) => {
    state = machine.transition(state, event, args);

    console.log(state);

    emitter.emit("state", state);
}

window.machine = machine;

export { state, transition, emitter };
