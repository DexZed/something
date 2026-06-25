import { Router } from "express";
import type { Request, Response, RequestHandler } from "express";
const router = Router();
export type RouteDefinition = {
    path: string;
    route: Router;
    middleware?: Array<RequestHandler>;
};

const routes: RouteDefinition[] = [
    {
        path: "/",
        route: router.get("/", (_: Request, res: Response) => {
            res.send("Hello");
        })
    }
]
export default routes;