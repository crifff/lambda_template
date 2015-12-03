export default class Main {
    static handler(event, context) {
        context.succeed();
    }

    static square(num) {
        return num * num;
    }
}