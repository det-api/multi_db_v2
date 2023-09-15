import {
  addDailyReportHandler,
  updateDailyReportHandler,
  deleteDailyReportHandler,
  getDailyReportByDateHandler,
  getDailyReportHandler,
  // getDailyReportTest,
} from "../controller/dailyReport.controller";
import { modelController } from "../middleware/modelControl";
import { hasAnyPermit } from "../middleware/permitValidator";
import { roleValidator } from "../middleware/roleValidator";
import { validateAll, validateToken } from "../middleware/validator";
import { allSchemaId, dailyReportSchema } from "../schema/scheama";
const dailyReportRoute = require("express").Router();

dailyReportRoute.get(
  "/pagi/:page",
  validateToken,
  hasAnyPermit(["view"]),
  modelController,
  getDailyReportHandler
);

dailyReportRoute.post(
  "/",
  validateToken,
  roleValidator(["det"]),
  hasAnyPermit(["add"]),
  validateAll(dailyReportSchema),
  modelController,
  addDailyReportHandler
);
dailyReportRoute.patch(
  "/",
  validateToken,
  roleValidator(["det"]),
  hasAnyPermit(["edit"]),
  validateAll(allSchemaId),
  modelController,
  updateDailyReportHandler
);
dailyReportRoute.delete(
  "/",
  validateToken,
  roleValidator(["det"]),
  hasAnyPermit(["delete"]),
  validateAll(allSchemaId),
  modelController,
  deleteDailyReportHandler
);

dailyReportRoute.get(
  "/by-date/:page",
  validateToken,
  hasAnyPermit(["view"]),
  modelController,
  getDailyReportByDateHandler
);


export default dailyReportRoute;
