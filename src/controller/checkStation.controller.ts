import { Request, Response, NextFunction } from "express";
import fMsg from "../utils/helper";
import {
  addCheckStation,
  deleteCheckStation,
  getCheckStation,
} from "../service/checkStation.service";

export const getCheckStationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let otpCodeCheck = req.query.otpCode;
    if (!otpCodeCheck) throw new Error("you need otp");
    let result = await getCheckStation(req.query);
    fMsg(res, "CheckStation are here", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const addCheckStationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await addCheckStation(req.body);
    fMsg(res, "New CheckStation was added", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const deletCheckStationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteCheckStation(req.query);
    fMsg(res, "CheckStation was deleted");
  } catch (e) {
    next(new Error(e));
  }
};
