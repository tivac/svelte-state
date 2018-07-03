import state from "./state.js";

import App from "./app.html";

const app = new App({
    target : document.body,
    data   : {
        page : false,
    },
});

state.on("enter:/one/subtwo", ({ curr }) => {
    curr.data = {
        foo : true,
    };
});

state.on("enter:/one/subthree", ({ curr }) => new Promise((resolve) => {
        setTimeout(() => {
            curr.data = {
                foo : "subthree data from promise",
            };
            
            resolve();
        }, 500);
    }));


state.on("enter", ({ curr }) => {
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
    
    app.set(props);
});

state.start();
