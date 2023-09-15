import {
  addDetailSaleHandler,
  deleteDetailSaleHandler,
  getDetailSaleByDateHandler,
  getDetailSaleDatePagiHandler,
  getDetailSaleHandler,
  statementReportHandler,
  updateDetailSaleHandler,
} from "../controller/detailSale.controller";
import {
  locSevModelControl,
  modelController,
} from "../middleware/modelControl";

import { hasAnyPermit } from "../middleware/permitValidator";
import { roleValidator } from "../middleware/roleValidator";
import { validateAll, validateToken } from "../middleware/validator";
import {
  allSchemaId,
  detailSaleSchema,
  detailSaleUpdateSchema,
} from "../schema/scheama";

const detailSaleRoute = require("express").Router();

detailSaleRoute.get(
  "/pagi/:page",
  validateToken,
  hasAnyPermit(["view"]),
  modelController,
  getDetailSaleHandler
);

detailSaleRoute.get(
  "/by-date",
  validateToken,
  hasAnyPermit(["view"]),
  modelController,
  getDetailSaleByDateHandler
);

detailSaleRoute.get(
  "/pagi/by-date/:page",
  validateToken,
  hasAnyPermit(["view"]),
  modelController,
  getDetailSaleDatePagiHandler
);

// //that for only device
detailSaleRoute.post(
  "/",
  validateAll(detailSaleSchema),
  locSevModelControl,
  addDetailSaleHandler
);

detailSaleRoute.patch(
  "/",
  validateToken,
  validateAll(detailSaleUpdateSchema),
  roleValidator(["det"]),
  hasAnyPermit(["edit"]),
  modelController,
  updateDetailSaleHandler
);

detailSaleRoute.delete(
  "/",
  validateToken,
  roleValidator(["det"]),
  hasAnyPermit(["delete"]),
  validateAll(allSchemaId),
  modelController,
  deleteDetailSaleHandler
);

detailSaleRoute.get(
  "/statement-report",
  validateToken,
  hasAnyPermit(["view"]),
  modelController,
  statementReportHandler
);

export default detailSaleRoute;
