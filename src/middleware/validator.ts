import { NextFunction, Response, Request } from "express";
import { checkToken, compass } from "../utils/helper";
import { getCredentialUser, getUser } from "../service/user.service";

export const validateAll =
  (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      let result = await schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (e: any) {
      return next(new Error(e.errors[0].message));
    }
  };

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("invalid token"));
    }
    try {
      let decoded = checkToken(token);
      let user = await getUser({ _id: decoded._id });
      req.body.user = user;
    } catch (e: any) {
      return next(new Error(e));
    }
    next();
  } catch (e) {
    next(new Error(e));
  }
};

export const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{
    let [email, password] = await getCredentialUser({ email: req.body.email });
    if (!email || !compass(req.body.password, password)) {
      throw new Error("Creditial Error");
    }
    next();
  }catch(e){
    next (new Error(e))
  }
};
