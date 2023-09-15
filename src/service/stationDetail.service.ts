import { FilterQuery, UpdateQuery, Model } from "mongoose";
import {
  csStationDetailModel,
  ksStationDetailModel,
  stationDetailDocument,
} from "../model/stationDetail.model";
import config from "config";
import { dBSelector } from "../utils/helper";

// export const getStationDetail = async (
//   query: FilterQuery<stationDetailDocument>
// ) => {
//   try {
//     let ksData = await ksdbModel.find(query).lean().select("-__v");
//     let csData = await csStationDetailModel.find(query).lean().select("-__v");
//     return [ksData , csData]
//   } catch (e) {
//     throw new Error(e);
//   }
// };

export const getStationDetail = async (
  query: FilterQuery<stationDetailDocument>,
  dbModel: string
) => {
  try {
    let selectedModel = dBSelector(
      dbModel,
      ksStationDetailModel,
      csStationDetailModel
    );
    return await selectedModel.find(query).lean().select("-__v");
  } catch (e) {
    throw new Error(e);
  }
};

export const stationDetailPaginate = async (
  pageNo: number,
  query: FilterQuery<stationDetailDocument>,
  dbModel: string
): Promise<{ count: number; data: stationDetailDocument[] }> => {
  const limitNo = config.get<number>("page_limit");
  const reqPage = pageNo == 1 ? 0 : pageNo - 1;
  const skipCount = limitNo * reqPage;

  // console.log(dbModel)

  let selectedModel = dBSelector(
    dbModel,
    ksStationDetailModel,
    csStationDetailModel
  );

  const data = await selectedModel
    .find(query)
    .skip(skipCount)
    .limit(limitNo)
    .lean()
    .select("-__v");

  const count = await selectedModel.countDocuments(query);

  return { data, count };
};

export const addStationDetail = async (
  body: stationDetailDocument,
  dbModel: string
) => {
  try {

    let selectedModel = dBSelector(
      dbModel,
      ksStationDetailModel,
      csStationDetailModel
    );

    return await new selectedModel(body).save();
  } catch (e) {
    throw new Error(e);
  }
};

export const updateStationDetail = async (
  query: FilterQuery<stationDetailDocument>,
  body: UpdateQuery<stationDetailDocument>,
  dbModel: string
) => {
  try {
    let selectedModel = dBSelector(
      dbModel,
      ksStationDetailModel,
      csStationDetailModel
    );
    await selectedModel.updateMany(query, body);
    return await selectedModel.find(query).lean();
  } catch (e) {
    throw new Error(e);
  }
};

export const deleteStationDetail = async (
  query: FilterQuery<stationDetailDocument>,
  dbModel: string
) => {
  try {

    let selectedModel = dBSelector(
      dbModel,
      ksStationDetailModel,
      csStationDetailModel
    );

    let StationDetail = await selectedModel.find(query);
    if (!StationDetail) {
      throw new Error("No StationDetail with that id");
    }
    return await selectedModel.deleteMany(query);
  } catch (e) {
    throw new Error(e);
  }
};
