const userRoute = require("express").Router();
import { hasAnyPermit } from "../middleware/permitValidator";
import { roleValidator } from "../middleware/roleValidator";
import { validateAll, validateToken } from "../middleware/validator";
import {
  deleteUserHandler,
  getUserByAdminHandler,
  getUserHandler,
  loginUserHandler,
  registerUserHandler,
  updateUserHandler,
  userAddPermitHandler,
  userAddRoleHandler,
  userRemovePermitHandler,
  userRemoveRoleHandler,
} from "../controller/user.controller";
import {
  createUserSchema,
  loginUserSchema,
  userPermitSchema,
  userRoleSchema,
} from "../schema/scheama";

//register user
userRoute.post("/register", validateAll(createUserSchema), registerUserHandler);

//login user
userRoute.post("/login", validateAll(loginUserSchema), loginUserHandler);

//update
userRoute.patch(
  "/",
  validateToken,
  roleValidator(["det"]),
  hasAnyPermit(["edit"]),
  updateUserHandler
);

//getuser
userRoute.get("/", getUserHandler);

//delete each user

userRoute.delete(
  "/",
  validateToken,
  roleValidator(["det"]),
  hasAnyPermit(["delete"]),
  deleteUserHandler
);

//admin routes
//beware deleting all user route
userRoute.delete("/admin", validateToken, deleteUserHandler);
userRoute.get("/admin", validateToken, getUserByAdminHandler);

//adding role in user
userRoute.patch(
  "/add/role",
  validateToken,
  validateAll(userRoleSchema),
  roleValidator(["det"]),
  hasAnyPermit(["add"]),
  userAddRoleHandler
);

userRoute.patch(
  "/remove/role",
  validateToken,
  validateAll(userRoleSchema),
  roleValidator(["det"]),
  hasAnyPermit(["delete"]),
  userRemoveRoleHandler
);

//adding permit in user
userRoute.patch(
  "/add/permit",
  validateToken,
  validateAll(userPermitSchema),
  roleValidator(["det"]),
  hasAnyPermit(["add"]),
  userAddPermitHandler
);
userRoute.patch(
  "/remove/permit",
  validateToken,
  validateAll(userPermitSchema),
  roleValidator(["det"]),
  hasAnyPermit(["delete"]),
  userRemovePermitHandler
);

export default userRoute;
