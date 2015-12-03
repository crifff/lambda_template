import 'babel-polyfill';

export default class Main {
    async handler(event, context) {
        await this.wait(10);
        context.succeed(event);
    }

    square(num) {
        return num * num;
    }

    wait(msec) {
        return new Promise((resolve) => setTimeout(resolve, msec));
    }
}