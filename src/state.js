import Machine from "./machine.js";

import HomeComponent from "./home.html";
import OneComponent from "./one.html";
import SuboneComponent from "./subone.html";
import SubtwoComponent from "./subtwo.html";
import SubthreeComponent from "./subthree.html";
import TwoComponent from "./two.html";
import ThreeComponent from "./three.html";

const states = {
    "/home"         : HomeComponent,
    "/one"          : OneComponent,
    "/one/subone"   : SuboneComponent,
    "/one/subtwo"   : SubtwoComponent,
    "/one/subthree" : SubthreeComponent,
    "/two"          : TwoComponent,
    "/three"        : ThreeComponent,
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