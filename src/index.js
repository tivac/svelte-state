import state from "./state.js";

import App from "./app.html";

let app;

state.on("enter:/one/subtwo", ({ curr }) => {
    curr.data = {
        foo : true,
    };
});

state.on("enter", ({ curr }) => {
    // TODO: Assumes single-level component at the root
    if(!app) {
        app = new App({
            target : document.body,
            data   : {
                page : {
                    child : curr.component,
                    props : curr.data,
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
                props : curr.data,
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
    const props = {};

    components.reverse().reduce((prev, component) => {
        prev.page = {
            child : component.component,

            // Need to ensure this is always an object or else nesting won't work
            props : component.data || {},
        };

        return prev.page.props;
    }, props);

    console.log(props);

    app.set(props);
});

state.start();
