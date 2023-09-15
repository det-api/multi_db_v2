import { Request, Response, NextFunction, query } from "express";
import fMsg, { previous } from "../utils/helper";
import moment, { MomentTimezone } from "moment-timezone";
import {
  getFuelBalance,
  addFuelBalance,
  updateFuelBalance,
  deleteFuelBalance,
  fuelBalancePaginate,
  fuelBalanceByDate,
} from "../service/fuelBalance.service";
const currentDate = moment().tz("Asia/Yangon").format("YYYY-MM-DD");

export const getAllFuelBalanceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let model = req.body.accessDb;

    let result = await getFuelBalance(req.query, model);
    fMsg(res, "FuelIn are here", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const getFuelBalanceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let pageNo = Number(req.params.page);
    let sDate = req.query.sDate?.toString();

    delete req.query.sDate;
    delete req.query.eDate;

    let query = req.query;

    if (!sDate) {
      throw new Error("you need date");
    }

    let model = req.body.accessDb;

    let { count, data } = await fuelBalancePaginate(
      pageNo,
      {
        ...query,
        createAt: sDate,
      },
      model
    );

    fMsg(res, "fuelBalance find", data, model, count);
  } catch (e) {
    next(new Error(e));
  }
};

export const addFuelBalanceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let model = req.body.accessDb;

    let result = await addFuelBalance(req.body, model);
    fMsg(res, "New fuelBalance data was added", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const updateFuelBalanceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let model = req.body.accessDb;

    let result = await updateFuelBalance(req.query, req.body, model);
    fMsg(res, "updated fuelBalance data", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const deleteFuelBalanceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let model = req.body.accessDb;

    await deleteFuelBalance(req.query, model);
    fMsg(res, "fuelBalance data was deleted");
  } catch (e) {
    next(new Error(e));
  }
};

export const getFuelBalanceByDateHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sDate: any = req.query.sDate;
    let eDate: any = req.query.eDate;

    delete req.query.sDate;
    delete req.query.eDate;

    let query = req.query;

    if (!sDate) {
      throw new Error("you need date");
    }
    if (!eDate) {
      eDate = new Date();
    }
    const startDate: Date = new Date(sDate);
    const endDate: Date = new Date(eDate);

    let model = req.body.accessDb;

    let result = await fuelBalanceByDate(query, startDate, endDate, model);
    fMsg(res, "fuel balance between two date", result);
  } catch (e) {
    next(new Error(e));
  }
};
