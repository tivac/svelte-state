import Machine from "./machine.js";

const states = [
    "/home",
    "/one",
    "/one/subone",
    "/one/subtwo",
    "/one/subthree",
    "/two",
    "/three",
];

const transitions = [
    [ "HOME",  [ "/one", "/two", "/three" ],  "/home" ],
    [ "ONE",   [ "/home", "/two", "/three" ], "/one" ],
    [ "TWO",   [ "/home", "/one", "/three" ], "/two" ],
    [ "THREE", [ "/home", "/one", "/two"   ], "/three" ],
    
    [ "SUBONE",   [ "/one/subtwo", "/one/subthree" ], "/one/subone" ],
    [ "SUBTWO",   [ "/one/subone", "/one/subthree" ], "/one/subtwo" ],
    [ "SUBTHREE", [ "/one/subone", "/one/subtwo" ],   "/one/subthree" ],
];

const machine = new Machine({
    states,
    transitions,
});

machine.on("exit", console.log.bind(console, "exit"));
machine.on("enter", console.log.bind(console, "enter"));

export default machine;
