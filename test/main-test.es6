import assert from 'power-assert'
import Main from '../src/main'

describe("Main.handler", ()=> {
    it("should succeed", (done)=> {
        let main = new Main;
        main.handler({}, {
            succeed: function () {
                done();
            }
        })
    });
});

describe("Main.square", ()=> {
    it("return 4", ()=> {
        let main = new Main;
        assert(main.square(2) == 4);
    });
});

describe("Main.later", ()=> {
    it("return promise", (done)=> {
        let main = new Main;
        main.wait(100).then(function () {
            done();
        });
    });
});
