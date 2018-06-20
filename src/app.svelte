<h1>HI</h1>

<script>
    export default {
        oncreate() {
            console.log("Created!");
        }
    };
    // import { Machine } from "xstate";

    // const machine = Machine({
    //     key: 'light',
    //     initial: 'green',
    //     states: {
    //         green: {
    //             on: {
    //                 TIMER: 'yellow',
    //             }
    //         },
    //         yellow: {
    //             on: {
    //                 TIMER: 'red',
    //             }
    //         },
    //         red: {
    //             on: {
    //                 TIMER: 'green',
    //             }
    //         }
    //     }
    // });

    // let state = machine.initialState;

    // const next = machine.transition(current, "TIMER");

    // console.log(next);
</script>
