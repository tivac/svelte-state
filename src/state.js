import Machine from "./machine.js";

import HomeComponent from "./home/home.html";
import OneComponent from "./one/one.html";
import SuboneComponent from "./one/subone.html";
import SubtwoComponent from "./one/subtwo.html";
import SubthreeComponent from "./one/subthree.html";
import TwoComponent from "./two/two.html";
import ThreeComponent from "./three/three.html";

const states = {
    "/home" : {
        component : HomeComponent,
    },

    "/one" : {
        component : OneComponent,
    },

    "/one/subone" : {
        component : SuboneComponent,
    },

    "/one/subtwo" : {
        component : SubtwoComponent,
    },

    "/one/subthree" : {
        component : SubthreeComponent,
    },

    "/two" : {
        component : TwoComponent,
    },
    
    "/three" : {
        component : ThreeComponent,
    },
};

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

export default machine;
