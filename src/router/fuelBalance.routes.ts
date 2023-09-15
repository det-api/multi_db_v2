import {
  addFuelBalanceHandler,
  deleteFuelBalanceHandler,
  getAllFuelBalanceHandler,
  getFuelBalanceByDateHandler,
  getFuelBalanceHandler,
  updateFuelBalanceHandler,
} from "../controller/fuelBalance.controller";
import { modelController } from "../middleware/modelControl";
import { hasAnyPermit } from "../middleware/permitValidator";
import { roleValidator } from "../middleware/roleValidator";
import { validateAll, validateToken } from "../middleware/validator";
import { fuelBalanceSchema } from "../schema/scheama";
const fuelBalanceRoute = require("express").Router();

fuelBalanceRoute.get(
  "/all",
  validateToken,
  hasAnyPermit(["view"]),
  modelController,
  getAllFuelBalanceHandler
);

fuelBalanceRoute.get(
  "/pagi/:page",
  validateToken,
  hasAnyPermit(["view"]),
  modelController,
  getFuelBalanceHandler
);
fuelBalanceRoute.get(
  "/by-date",
  validateToken,
  hasAnyPermit(["view"]),
  modelController,
  getFuelBalanceByDateHandler
);
fuelBalanceRoute.post(
  "/",
  validateToken,
  validateAll(fuelBalanceSchema),
  roleValidator(["det"]),
  hasAnyPermit(["add"]),
  modelController,
  addFuelBalanceHandler
);

fuelBalanceRoute.patch(
  "/",
  validateToken,
  roleValidator(["det"]),
  hasAnyPermit(["edit"]),
  modelController,
  updateFuelBalanceHandler
);

fuelBalanceRoute.delete(
  "/",
  validateToken,
  roleValidator(["det"]),
  hasAnyPermit(["delete"]),
  modelController,
  deleteFuelBalanceHandler
);

export default fuelBalanceRoute;
