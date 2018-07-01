import localLink from "local-link";

import { transition } from "./xstate.js";

const link = (node) => {
    const handler = (e) => {
        if(!localLink(e)) {
            return;
        }

        e.preventDefault();

        // Extract hash and use it as a transition name
        transition(new URL(e.target.href).hash.slice(1));
    };

    node.addEventListener("click", handler);

    return {
        destroy() {
            node.removeEventListener("click", handler);
        }
    };
};

export default link;
