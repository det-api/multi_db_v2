import {
  getRoleHandler,
  addRoleHandler,
  deletRoleHandler,
  roleAddPermitHandler,
  roleRemovePermitHandler,
} from "../controller/role.controller";
import { roleValidator } from "../middleware/roleValidator";
import { validateAll, validateToken } from "../middleware/validator";
import { allSchemaId, rolePermitSchema, roleSchema } from "../schema/scheama";

const roleRoute = require("express").Router();

roleRoute.get(
  "/",
   validateToken,
  roleValidator(["det"]),
  getRoleHandler
);

roleRoute.post(
  "/",
  validateToken,
  validateAll(roleSchema),
  roleValidator(["det"]),
  addRoleHandler
);

roleRoute.delete(
  "/",
  validateToken,
  validateAll(allSchemaId),
  roleValidator(["det"]),
  deletRoleHandler
);

roleRoute.patch(
  "/add/permit",
  validateToken,
  validateAll(rolePermitSchema),
  roleValidator(["det"]),
  roleAddPermitHandler
);

roleRoute.patch(
  "/remove/permit",
  validateToken,
  validateAll(rolePermitSchema),
  roleValidator(["det"]),
  roleRemovePermitHandler
);

export default roleRoute;
