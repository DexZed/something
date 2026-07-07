import App from "./app";
import { env } from "./env";
import { ExceptionHandler } from "./exceptions/systemException";



ExceptionHandler.init();
const server = new App(env.PORT);
server.initServer();