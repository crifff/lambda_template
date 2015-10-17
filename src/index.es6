import Hoge from "./hoge"

class Main {
    constructor(event, context) {
        this.event = event;
        this.context = context;
    }

    invoke() {
        this.context.succeed(1234);
    }
}

exports.handler = (event, context) => {
    (new Main(event, context)).invoke();
};
