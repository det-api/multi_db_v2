import { Request, Response, NextFunction } from "express";
import fMsg from "../utils/helper";
import { addTemp, deleteTemp, getTemp } from "../service/temp.service";

export const getTempHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let otpCodeCheck = req.query.otpCode;
    if (!otpCodeCheck) throw new Error("you need otp");
    let result = await getTemp(req.query);
    fMsg(res, "Temp are here", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const addTempHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await addTemp(req.body);
    fMsg(res, "New Temp was added", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const deletTempHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteTemp(req.query);
    fMsg(res, "Temp was deleted");
  } catch (e) {
    next(new Error(e));
  }
};
