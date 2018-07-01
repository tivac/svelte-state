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
    
    [ "SUBONE",   [ "/subtwo", "/subthree" ], "/subone" ],
    [ "SUBTWO",   [ "/subone", "/subthree" ], "/subtwo" ],
    [ "SUBTHREE", [ "/subone", "/subtwo" ],   "/subthree" ],
];

console.log(states, transitions);

const machine = new Machine({
    states,
    transitions,
});

console.log(machine);
