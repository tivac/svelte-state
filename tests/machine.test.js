/* eslint-env jest, node */
const Emitter = require("emittery");
const Machine = require("../src/machine.js");

describe("machine.js", () => {
    it("should be a function", () => {
        expect(typeof Machine).toBe("function");
    });
});
