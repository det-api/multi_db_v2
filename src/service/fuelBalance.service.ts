import { FilterQuery, UpdateQuery } from "mongoose";
import {
  csFuelBalanceModel,
  fuelBalanceDocument,
  ksFuelBalanceModel,
} from "../model/fuelBalance.model";
import config from "config";
import { dBSelector } from "../utils/helper";
import moment from "moment-timezone";

export const getFuelBalance = async (
  query: FilterQuery<fuelBalanceDocument>,
  dbModel: string
) => {
  try {
    let selectedModel = dBSelector(
      dbModel,
      ksFuelBalanceModel,
      csFuelBalanceModel
    );
    return await selectedModel
      .find(query)
      .lean()
      .populate("stationId")
      .select("-__v");
  } catch (e) {
    throw new Error(e);
  }
};

export const addFuelBalance = async (
  body: fuelBalanceDocument,
  dbModel: string
) => {
  try {
    const currentDate = moment().tz("Asia/Yangon").format("YYYY-MM-DD");
    const options = { timeZone: "Asia/Yangon", hour12: false };

    let currentDateTime = new Date().toLocaleTimeString("en-US", options);

    const [hour, minute, second] = currentDateTime.split(":").map(Number);

    if (hour == 24) {
      currentDateTime = `00:${minute}:${second}`;
    }

    let iso: Date = new Date(`${currentDate}T${currentDateTime}.000Z`);

    let selectedModel = dBSelector(
      dbModel,
      ksFuelBalanceModel,
      csFuelBalanceModel
    );

    if (!body.accessDb) body.accessDb = dbModel;

    body.realTime = iso;

    return await new selectedModel(body).save();
  } catch (e) {
    throw new Error(e);
  }
};

export const updateFuelBalance = async (
  query: FilterQuery<fuelBalanceDocument>,
  body: UpdateQuery<fuelBalanceDocument>,
  dbModel: string
) => {
  try {
    let selectedModel = dBSelector(
      dbModel,
      ksFuelBalanceModel,
      csFuelBalanceModel
    );

    await selectedModel.updateMany(query, body);
    return await selectedModel.find(query).lean();
  } catch (e) {
    throw new Error(e);
  }
};

export const deleteFuelBalance = async (
  query: FilterQuery<fuelBalanceDocument>,
  dbModel: string
) => {
  try {
    let selectedModel = dBSelector(
      dbModel,
      ksFuelBalanceModel,
      csFuelBalanceModel
    );

    let fuelBalance = await selectedModel.find(query);
    if (!fuelBalance) {
      new Error("No fuelBalance with that id");
    }

    return await selectedModel.deleteMany(query);
  } catch (e) {
    throw new Error(e);
  }
};

export const calcFuelBalance = async (
  query,
  body,
  payload: string,
  dbModel: string
) => {
  try {
    let selectedModel = dBSelector(
      dbModel,
      ksFuelBalanceModel,
      csFuelBalanceModel
    );

    let result = await selectedModel.find(query);
    if (result.length === 0) {
      new Error("No fuel balance data found for the given query.");
    }

    let gg = result.find((ea: { nozzles: string[] }) =>
      ea.nozzles.includes(payload.toString())
    );

    if (!gg) {
      new Error("No tank with the provided nozzle found.");
    }

    if (typeof body.liter !== "number" || isNaN(body.liter)) {
      new Error("Invalid 'liter' value. It must be a valid number.");
    }

    let cashLiter = gg.cash + body.liter;

    let obj = {
      cash: cashLiter,
      balance: gg.opening + gg.fuelIn - cashLiter,
    };

    await selectedModel.updateMany({ _id: gg?._id }, obj);
    return await selectedModel.find({ _id: gg?._id }).lean();
  } catch (e) {
    throw new Error(e); // Rethrow the error with the actual error message
  }
};

export const fuelBalancePaginate = async (
  pageNo: number,
  query: FilterQuery<fuelBalanceDocument>,
  dbModel: string
): Promise<{ count: number; data: fuelBalanceDocument[] }> => {
  const limitNo = config.get<number>("page_limit");
  const reqPage = pageNo == 1 ? 0 : pageNo - 1;
  const skipCount = limitNo * reqPage;

  let selectedModel = dBSelector(
    dbModel,
    ksFuelBalanceModel,
    csFuelBalanceModel
  );

  const data = await selectedModel
    .find(query)
    .sort({ realTime: -1 })
    .skip(skipCount)
    .limit(limitNo)
    .lean()
    .populate("stationId")
    .select("-__v");

  const count = await selectedModel.countDocuments(query);

  return { data, count };
};

export const fuelBalanceByDate = async (
  query: FilterQuery<fuelBalanceDocument>,
  d1: Date,
  d2: Date,
  dbModel: string
): Promise<fuelBalanceDocument[]> => {
  const filter: FilterQuery<fuelBalanceDocument> = {
    ...query,
    realTime: {
      $gt: d1,
      $lt: d2,
    },
  };
  let selectedModel = dBSelector(
    dbModel,
    ksFuelBalanceModel,
    csFuelBalanceModel
  );

  return await selectedModel
    .find(filter)
    .sort({ realTime: -1 })
    .populate("stationId")
    .select("-__v");
};
