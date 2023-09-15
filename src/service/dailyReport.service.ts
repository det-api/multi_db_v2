import { FilterQuery, UpdateQuery } from "mongoose";
import {
  csDailyReportModel,
  dailyReportDocument,
  ksDailyReportModel,
} from "../model/dailyReport.model";
import config from "config";
import { dBSelector } from "../utils/helper";
const limitNo = config.get<number>("page_limit");

export const getDailyReport = async (
  query: FilterQuery<dailyReportDocument>,
  dbModel: string
) => {
  try {
    let selectedModel = dBSelector(
      dbModel,
      ksDailyReportModel,
      csDailyReportModel
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

export const addDailyReport = async (
  body: { stationId: string; dateOfDay: string; accessDb?: string },
  dbModel: string
) => {
  try {
    let selectedModel = dBSelector(
      dbModel,
      ksDailyReportModel,
      csDailyReportModel
    );

    if (!body.accessDb) body.accessDb = dbModel;

    return await new selectedModel(body).save();
  } catch (e) {
    throw new Error(e);
  }
};

export const updateDailyReport = async (
  query: FilterQuery<dailyReportDocument>,
  body: UpdateQuery<dailyReportDocument>,
  dbModel: string
) => {
  try {
    let selectedModel = dBSelector(
      dbModel,
      ksDailyReportModel,
      csDailyReportModel
    );

    if (!body.accessDb) body.accessDb = dbModel;

    await selectedModel.updateMany(query, body);
    return await selectedModel.find(query).lean();
  } catch (e) {
    throw new Error(e);
  }
};

export const deleteDailyReport = async (
  query: FilterQuery<dailyReportDocument>,
  dbModel: string
) => {
  try {
    let selectedModel = dBSelector(
      dbModel,
      ksDailyReportModel,
      csDailyReportModel
    );
    let DailyReport = await selectedModel.find(query);
    if (!DailyReport) {
      throw new Error("No DailyReport with that id");
    }
    return await selectedModel.deleteMany(query);
  } catch (e) {
    throw new Error(e);
  }
};

export const getDailyReportByDate = async (
  query: FilterQuery<dailyReportDocument>,
  d1: Date,
  d2: Date,
  pageNo: number,
  dbModel: string
): Promise<dailyReportDocument[]> => {
  const reqPage = pageNo == 1 ? 0 : pageNo - 1;
  const skipCount = limitNo * reqPage;

  const filter: FilterQuery<dailyReportDocument> = {
    ...query,
    date: {
      $gt: d1,
      $lt: d2,
    },
  };

  let selectedModel = dBSelector(
    dbModel,
    ksDailyReportModel,
    csDailyReportModel
  );

  let result = await selectedModel
    .find(filter)
    .sort({ date: -1 })
    .skip(skipCount)
    .limit(limitNo)
    .populate("stationId")
    .select("-__v");
  return result;
};

export const dailyReportPaginate = async (
  pageNo: number,
  query: FilterQuery<dailyReportDocument>,
  dbModel: string
): Promise<{ count: number; data: dailyReportDocument[] }> => {
  const reqPage = pageNo == 1 ? 0 : pageNo - 1;
  const skipCount = limitNo * reqPage;


  let selectedModel = dBSelector(
    dbModel,
    ksDailyReportModel,
    csDailyReportModel
  );

  const data = await selectedModel
    .find(query)
    .sort({ date: -1 })
    .skip(skipCount)
    .limit(limitNo)
    .populate("stationId")
    .select("-__v");

  const count = await selectedModel.countDocuments(query);

  return { count, data };
};

export const getDailyReportByMonth = async (
  query: FilterQuery<dailyReportDocument>,
  year: number,
  month: number,
  dbModel: string
): Promise<dailyReportDocument[]> => {
  const startDate = new Date(year, month - 1, 1, 0, 0, 0); // Month is zero-based
  const endDate = new Date(year, month, 1, 0, 0, 0); // Month is zero-based
  const filter: FilterQuery<dailyReportDocument> = {
    ...query,
    date: {
      $gte: startDate,
      $lt: endDate,
    },
  };

  let selectedModel = dBSelector(
    dbModel,
    ksDailyReportModel,
    csDailyReportModel
  );

  const result = await selectedModel.find(filter).select("-__v");

  return result;
};
