import type { RequestHandler, Router } from "express";
import publicRouter from "../modules/public/publicController";

type RouteDefinition = {
  path: string;
  controller: Router;
  middleware?: Array<RequestHandler>;
};

const routes: RouteDefinition[] = [{ path: "/", controller: publicRouter }];

export default routes;
