import  express  from "express";
import { index, getServices, getTechnicians, getTechniciansById, getCategories } from "./publicService";

const publicRouter = express.Router();

publicRouter.get("/",index);

publicRouter.get("/api/services",getServices);

publicRouter.get("/api/technicians",getTechnicians);

publicRouter.get("/api/technicians/:id",getTechniciansById);

publicRouter.get("/api/categories",getCategories);

export default publicRouter;