import {
  addDebtHandler,
  deleteDebtHandler,
  getDebtDatePagiHandler,
  getDebtHandler,
  updateDebtHandler,
} from "../controller/debt.controller";
import { hasAnyPermit } from "../middleware/permitValidator";
import { validateToken, validateUser } from "../middleware/validator";

const debtRoute = require("express").Router();

debtRoute.get("/:page", getDebtHandler);

debtRoute.get(
  "/pagi/by-date/:page",
  validateToken,
  hasAnyPermit(["view"]),
  getDebtDatePagiHandler
);

debtRoute.post(
  "/",
  // validateToken, hasAnyPermit(["add"]),
  addDebtHandler
);

debtRoute.post(
  "/local-create",
  validateUser,
  addDebtHandler
);

debtRoute.patch("/", validateToken, hasAnyPermit(["edit"]), updateDebtHandler);

debtRoute.delete(
  "/",
  validateToken,
  hasAnyPermit(["delete"]),
  deleteDebtHandler
);

export default debtRoute;
