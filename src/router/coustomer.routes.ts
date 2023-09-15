import {
  addCoustomerHandler,
  deletCoustomerHandler,
  getCoustomerHandler,
  searchCoustomerHandler,
} from "../controller/coustomer.controller";
import { hasAnyPermit } from "../middleware/permitValidator";
import { validateToken, validateUser } from "../middleware/validator";

const coustomerRoute = require("express").Router();

coustomerRoute.get(
  "/",
  validateToken,
  hasAnyPermit(["view"]),
  getCoustomerHandler
);
coustomerRoute.post(
  "/",
  validateToken,
  hasAnyPermit(["add"]),
  addCoustomerHandler
);
coustomerRoute.delete(
  "/",
  validateToken,
  hasAnyPermit(["delete"]),
  deletCoustomerHandler
);

coustomerRoute.get(
  "/search",
  validateToken,
  hasAnyPermit(["view"]),
  searchCoustomerHandler
);

coustomerRoute.post("/local-create", validateUser, addCoustomerHandler);

export default coustomerRoute;
