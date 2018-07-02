import localLink from "local-link";

// import { transition } from "./xstate.js";
import state from "./state.js";

const link = (node) => {
    const handler = (e) => {
        if(!localLink(e)) {
            return;
        }

        e.preventDefault();

        // Extract hash and use it as a transition name
        const event = new URL(e.target.href).hash.slice(1);

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
