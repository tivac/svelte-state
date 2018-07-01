import localLink from "local-link";

// import { transition } from "./xstate.js";
import state from "./state.js";

const link = (node) => {
    const handler = (e) => {
        if(!localLink(e)) {
            return;
        }

        e.preventDefault();

        const event = new URL(e.target.href).hash.slice(1);

        // Extract hash and use it as a transition name
        // transition(new URL(e.target.href).hash.slice(1));
        console.log("transition", event);
        
        state.trigger(event);
    };

    node.addEventListener("click", handler);

    return {
        destroy() {
            node.removeEventListener("click", handler);
        },
    };
};

export default link;
