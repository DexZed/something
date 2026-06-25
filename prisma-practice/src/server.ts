import init, { app } from "./app";


async function bootstrap() {
    init(app.APP);
}
Promise.try(() => bootstrap()).catch(console.error);
