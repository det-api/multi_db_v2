import { FilterQuery } from "mongoose";
import tempModel, { tempDocument } from "../model/temp.model";

export const getTemp = async (
  query: FilterQuery<tempDocument>
) => {
  try {
    return tempModel
      .find(query)
      .populate("stationId")
      .select("-otpCode -__v")
      .lean();
  } catch (e) {
    throw new Error(e);
  }
};

export const addTemp = async (body: tempDocument) => {
  try {
    return new tempModel(body).save();
  } catch (e) {
    throw new Error(e);
  }
};

export const deleteTemp = async (
  query: FilterQuery<tempDocument>
) => {
  try {
    return tempModel.deleteMany(query);
  } catch (e) {
    throw new Error(e);
  }
};
