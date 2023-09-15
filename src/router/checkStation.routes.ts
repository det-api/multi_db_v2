import { validateAll, validateToken } from "../middleware/validator";
import { roleValidator } from "../middleware/roleValidator";
import { allSchemaId } from "../schema/scheama";
import {
  addCheckStationHandler,
  deletCheckStationHandler,
  getCheckStationHandler,
} from "../controller/checkStation.controller";

const checkStationRoute = require("express").Router();

checkStationRoute.get(
  "/",

  getCheckStationHandler
);
checkStationRoute.post(
  "/new",
  validateToken,
  roleValidator(["det"]),
  addCheckStationHandler
);
checkStationRoute.delete(
  "/",
  validateToken,
  validateAll(allSchemaId),
  roleValidator(["det"]),
  deletCheckStationHandler
);

export default checkStationRoute;
