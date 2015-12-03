import assert from 'power-assert'
import Main from '../src/main'

describe("Main.handler", ()=> {
    it("should succeed", (done)=> {
        Main.handler({}, {
            succeed: function () {
                done();
            }
        })
    });
});

describe("Main.square", ()=> {
    it("return 4", ()=> {
        assert(Main.square(2) == 4);
    });
});
