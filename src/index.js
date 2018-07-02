import state from "./state.js";

import App from "./app.html";

let app;

state.on("enter", ({ curr }) => {
    // TODO: Assumes single-level component at the root
    if(!app) {
        app = new App({
            target : document.body,
            data   : {
                page : {
                    child : curr.component,
                    props : {},
                },
            },
        });

        return;
    }

    // Single level component
    if(!curr.parent) {
        app.set({
            page : {
                child : curr.component,
                props : {},
            },
        });

        return;
    }

    // Create the list of nested components
    const components = [];
    let step = curr;

    while(step.parent) {
        components.push(step);

        step = state.get(step.parent);
    }

    components.push(step);

    // Create nested data structure to represent the component tree
    const data = {};

    components.reverse().reduce((prev, component) => {
        prev.page = {
            child : component.component,
            props : {},
        };

        return prev.page.props;
    }, data);

    app.set(data);
});

state.start();
