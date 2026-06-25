import express, {
    Application,
    RequestHandler,
    Router,
    type NextFunction,
    type Request,
    type Response,
} from "express";
import chalk from "chalk";
import cookieParser from "cookie-parser";
import cors from "cors";
import 'dotenv/config'
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./env";

export const app = {
    APP: express(),
}

function initMiddleware(context: Application) {
    context.use(express.json());
    context.use(express.urlencoded({ extended: true }));
    context.use(cookieParser());
    context.use(cors());
    context.use(helmet());
    context.use(
        morgan((tokens, req, res) => {
            const status = Number(tokens.status?.(req, res));

            const color =
                status >= 500
                    ? chalk.red
                    : status >= 400
                        ? chalk.yellow
                        : status >= 300
                            ? chalk.cyan
                            : chalk.green;

            return [
                chalk.gray(tokens.method?.(req, res)),
                chalk.blue(tokens.url?.(req, res)),
                color(tokens.status?.(req, res)),
                chalk.magenta(`${tokens["response-time"]?.(req, res)} ms`),
            ].join(" ");
        }),
    );
}

function initRoutes(context: Application, routes: [{ path: string, route: Router, middleware?: RequestHandler }]) {
    routes.forEach(({ path, route, middleware }) => {
        middleware?.length ?
            context.use(path, middleware, route) : context.use(path, route)
    })
}

/* function initErrorHandler(context:Application,errorhandler[]){
    errorhandler.forEach(({path,middleware})=>context.use(path,middleware))
}*/

function initServer(context: Application, port: number) {
    context.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}

export default function init(context: Application) {
    initMiddleware(context)
    // initRoutes(context, [])
    initServer(context, env.PORT)
}