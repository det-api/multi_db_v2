import { addTankDataController, deleteTankDataIdController, getAllTankDataController, getTankDataByDate, updateTankDataController } from "../controller/tankData.controller";
import { locSevModelControl, modelController } from "../middleware/modelControl";
import { hasAnyPermit } from "../middleware/permitValidator";
import { roleValidator } from "../middleware/roleValidator";
import { validateAll, validateToken } from "../middleware/validator";
import { tankDataSchema } from "../schema/scheama";
import { deleteTankDataById } from "../service/tankData.service";

const tankDataRouter = require('express').Router();

tankDataRouter.post('/',
// validateToken,
validateAll(tankDataSchema),
locSevModelControl
, addTankDataController);

tankDataRouter.get('/:page',
validateToken,
hasAnyPermit(["view"]),
modelController,
getAllTankDataController
);

tankDataRouter.get('/by-date/:page',
  validateToken,
  hasAnyPermit(["view"]),
  modelController,
  getTankDataByDate
);

tankDataRouter.delete("/",
validateToken,
// roleValidator(["det"]),
hasAnyPermit(["delete"]),
modelController,
deleteTankDataIdController
);

tankDataRouter.patch('/',
validateToken,
// roleValidator(["det"]),
hasAnyPermit(["edit"]),
modelController,
updateTankDataController
);





export default tankDataRouter;