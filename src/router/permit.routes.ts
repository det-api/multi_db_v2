import {
  getPermitHandler,
  addPermitHandler,
  deletPermitHandler,
} from "../controller/permit.controller";
import { validateAll, validateToken } from "../middleware/validator";
import { roleValidator } from "../middleware/roleValidator";
import { allSchemaId, permitSchema } from "../schema/scheama";

const permitRoute = require("express").Router();

permitRoute.get(
  "/",
  validateToken,
  roleValidator(["det"]),
  getPermitHandler
);
permitRoute.post(
  "/",
  validateToken,
  validateAll(permitSchema),
  roleValidator(["det"]),
  addPermitHandler
);
permitRoute.delete(
  "/",
  validateToken,
  validateAll(allSchemaId),
  roleValidator(["det"]),
  deletPermitHandler
);

export default permitRoute;
