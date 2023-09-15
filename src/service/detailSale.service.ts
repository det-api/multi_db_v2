import { FilterQuery, UpdateQuery } from "mongoose";
import {
  csDetailSaleModel,
  detailSaleDocument,
  ksDetailSaleModel,
} from "../model/detailSale.model";
import config from "config";
import { dBSelector } from "../utils/helper";
import moment from "moment-timezone";

const limitNo = config.get<number>("page_limit");

export const getDetailSale = async (
  query: FilterQuery<detailSaleDocument>,
  dbModel: string
) => {
  try {
    let selectedModel = dBSelector(
      dbModel,
      ksDetailSaleModel,
      csDetailSaleModel
    );

    return await selectedModel
      .find(query)

      .populate("stationDetailId")
      .select("-__v");
  } catch (e) {
    throw new Error(e);
  }
};

export const addDetailSale = async (
  body: detailSaleDocument,
  dbModel: string
) => {
  try {
    let selectedModel = dBSelector(
      dbModel,
      ksDetailSaleModel,
      csDetailSaleModel
    );

    body.accessDb = dbModel;

    delete body._id;
    return await new selectedModel(body).save();
  } catch (e) {
    throw new Error(e);
  }
};

export const updateDetailSale = async (
  query: FilterQuery<detailSaleDocument>,
  body: UpdateQuery<detailSaleDocument>,
  dbModel: string
) => {
  try {
    let selectedModel = dBSelector(
      dbModel,
      ksDetailSaleModel,
      csDetailSaleModel
    );

    await selectedModel.updateMany(query, body);
    return await selectedModel.find(query);
  } catch (e) {
    throw new Error(e);
  }
};

export const deleteDetailSale = async (
  query: FilterQuery<detailSaleDocument>,
  dbModel: string
) => {
  try {
    let selectedModel = dBSelector(
      dbModel,
      ksDetailSaleModel,
      csDetailSaleModel
    );

    let DetailSale = await selectedModel.find(query);
    if (!DetailSale) {
      throw new Error("No DetailSale with that id");
    }
    return await selectedModel.deleteMany(query);
  } catch (e) {
    throw new Error(e);
  }
};

export const getDetailSaleByFuelType = async (
  dateOfDay: string,
  // stationId : string,
  fuelType: string,
  dbModel: string
) => {
  let fuel = await getDetailSale(
    {
      dailyReportDate: dateOfDay,
      fuelType: fuelType,
    },
    dbModel
  );

  let fuelLiter = fuel
    .map((ea) => ea["saleLiter"])
    .reduce((pv: number, cv: number): number => pv + cv, 0);
  let fuelAmount = fuel
    .map((ea) => ea["totalPrice"])
    .reduce((pv: number, cv: number): number => pv + cv, 0);

  return { count: fuel.length, liter: fuelLiter, price: fuelAmount };
};

export const detailSalePaginate = async (
  pageNo: number,
  query: FilterQuery<detailSaleDocument>,
  dbModel: string
): Promise<{ count: number; data: detailSaleDocument[] }> => {
  let selectedModel = dBSelector(dbModel, ksDetailSaleModel, csDetailSaleModel);

  const reqPage = pageNo == 1 ? 0 : pageNo - 1;
  const skipCount = limitNo * reqPage;
  const data = await selectedModel
    .find(query)
    .sort({ createAt: -1 })
    .skip(skipCount)
    .limit(limitNo)
    .populate("stationDetailId")
    .select("-__v");
  const count = await selectedModel.countDocuments(query);

  return { data, count };
};

export const detailSaleByDate = async (
  query: FilterQuery<detailSaleDocument>,
  d1: Date,
  d2: Date,
  dbModel: string
): Promise<detailSaleDocument[]> => {
  let selectedModel = dBSelector(dbModel, ksDetailSaleModel, csDetailSaleModel);

  const filter: FilterQuery<detailSaleDocument> = {
    ...query,
    createAt: {
      $gt: d1,
      $lt: d2,
    },
  };

  let result = await selectedModel
    .find(filter)
    .sort({ createAt: -1 })
    .populate("stationDetailId")
    .select("-__v");

  return result;
};

export const detailSaleByDateAndPagi = async (
  query: FilterQuery<detailSaleDocument>,
  d1: Date,
  d2: Date,
  pageNo: number,
  dbModel: string
): Promise<{ count: number; data: detailSaleDocument[] }> => {
  try {
    let selectedModel = dBSelector(
      dbModel,
      ksDetailSaleModel,
      csDetailSaleModel
    );

    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    const filter: FilterQuery<detailSaleDocument> = {
      ...query,
      createAt: {
        $gt: d1,
        $lt: d2,
      },
    };

    const dataQuery = selectedModel
      .find(filter)
      .sort({ createAt: -1 })
      .skip(skipCount)
      .limit(limitNo)
      .populate("stationDetailId")
      .select("-__v");

    const countQuery = selectedModel.countDocuments(filter);

    const [data, count] = await Promise.all([dataQuery, countQuery]);

    return { data, count };
  } catch (error) {
    console.error("Error in detailSaleByDateAndPagi:", error);
    throw error;
  }
};

export const getLastDetailSale = async (nozzleNo: string, dbModel: string) => {
  let selectedModel = dBSelector(dbModel, ksDetailSaleModel, csDetailSaleModel);
  return await selectedModel
    .findOne({ nozzleNo: nozzleNo })
    .sort({ _id: -1, createAt: -1 });
};
