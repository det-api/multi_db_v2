import { FilterQuery, UpdateQuery } from "mongoose";
import {
  csFuelInModel,
  fuelInDocument,
  ksFuelInModel,
} from "../model/fuelIn.model";
import { getFuelBalance, updateFuelBalance } from "./fuelBalance.service";
import config from "config";
import { dBSelector } from "../utils/helper";

const limitNo = config.get<number>("page_limit");

export const getFuelIn = async (
  query: FilterQuery<fuelInDocument>,
  dbModel: string
) => {
  try {
    let selectedModel = dBSelector(dbModel, ksFuelInModel, csFuelInModel);
    return await selectedModel
      .find(query)
      .lean()
      .populate("stationId")
      .select("-__v");
  } catch (e) {
    throw new Error(e);
  }
};

export const fuelInPaginate = async (
  pageNo: number,
  query: FilterQuery<fuelInDocument>,
  dbModel: string
): Promise<{ count: number; data: fuelInDocument[] }> => {
  const limitNo = config.get<number>("page_limit");
  const reqPage = pageNo == 1 ? 0 : pageNo - 1;
  const skipCount = limitNo * reqPage;

  let selectedModel = dBSelector(dbModel, ksFuelInModel, csFuelInModel);

  const data = await selectedModel
    .find(query)
    .sort({ createAt: -1 })
    .skip(skipCount)
    .limit(limitNo)
    .lean()
    .populate("stationId")
    .select("-__v");

  const count = await selectedModel.countDocuments(query);

  return { count, data };
};

export const addFuelIn = async (body: any, dbModel: string) => {
  try {
    let selectedModel = dBSelector(dbModel, ksFuelInModel, csFuelInModel);
    let no = await selectedModel.count();
    let tankCondition = await getFuelBalance(
      {
        stationId: body.user[0].stationId,
        // fuelType: body.fuel_type,
        tankNo: body.tankNo,
        createAt: body.receive_date,
      },
      dbModel
    );

    const updatedBody = {
      ...body,
      stationId: body.user[0].stationId,
      fuel_in_code: no + 1,
      tank_balance: tankCondition[0].balance,
    };
    let result = await new selectedModel(updatedBody).save();
    await updateFuelBalance(
      { _id: tankCondition[0]._id },
      { fuelIn: body.recive_balance },
      dbModel
    );
    return result;
  } catch (e) {
    throw new Error(e);
  }
};

export const updateFuelIn = async (
  query: FilterQuery<fuelInDocument>,
  body: UpdateQuery<fuelInDocument>,
  dbModel: string
) => {
  try {
    let selectedModel = dBSelector(dbModel, ksFuelInModel, csFuelInModel);
    await selectedModel.updateMany(query, body);
    return await selectedModel.find(query).lean();
  } catch (e) {
    throw new Error(e);
  }
};

export const deleteFuelIn = async (
  query: FilterQuery<fuelInDocument>,
  dbModel: string
) => {
  try {
    let selectedModel = dBSelector(dbModel, ksFuelInModel, csFuelInModel);
    let FuelIn = await selectedModel.find(query);
    if (!FuelIn) {
      throw new Error("No FuelIn with that id");
    }
    return await selectedModel.deleteMany(query);
  } catch (e) {
    throw new Error(e);
  }
};

export const fuelInByDate = async (
  query: FilterQuery<fuelInDocument>,
  d1: Date,
  d2: Date,
  pageNo: number,
  dbModel: string
): Promise<{ count: number; data: fuelInDocument[] }> => {
  let selectedModel = dBSelector(dbModel, ksFuelInModel, csFuelInModel);

  const reqPage = pageNo == 1 ? 0 : pageNo - 1;
  const skipCount = limitNo * reqPage;

  const filter: FilterQuery<fuelInDocument> = {
    ...query,
    createAt: {
      $gt: d1,
      $lt: d2,
    },
  };

  const data = await selectedModel
    .find(filter)
    .sort({ createAt: -1 })
    .skip(skipCount)
    .limit(limitNo)
    .populate("stationId")
    .select("-__v");

  const count = await selectedModel.countDocuments(filter);
  return { data, count };
};
