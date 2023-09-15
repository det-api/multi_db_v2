import { FilterQuery } from "mongoose";
import checkStationModel, {
  checkStationDocument,
} from "../model/checkStation.model";

export const getCheckStation = async (
  query: FilterQuery<checkStationDocument>
) => {
  try {
    return checkStationModel
      .find(query)
      .select("-otpCode -__v")
      .lean();
  } catch (e) {
    throw new Error(e);
  }
};

export const addCheckStation = async (body: checkStationDocument) => {
  try {
    return new checkStationModel(body).save();
  } catch (e) {
    throw new Error(e);
  }
};

export const deleteCheckStation = async (
  query: FilterQuery<checkStationDocument>
) => {
  try {
    return checkStationModel.deleteMany(query);
  } catch (e) {
    throw new Error(e);
  }
};
