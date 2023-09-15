import { FilterQuery } from "mongoose";
import collectionModel, { collectionDocument } from "../model/collection.model";
import { stationDetailDocument } from "../model/stationDetail.model";

export const collectionGet = async (query: FilterQuery<collectionDocument>) => {
  try {
    return await collectionModel
      .find(query)
      .lean()
      // .populate("stationCollection")
      .select("-__v");
  } catch (e) {
    throw new Error(e);
  }
};

export const collectionAdd = async (body: collectionDocument) => {
  try {
    return await new collectionModel(body).save();
  } catch (e) {
    throw new Error(e);
  }
};

export const collectionDelete = async (
  query: FilterQuery<collectionDocument>
) => {
  try {
    return await collectionModel.deleteMany(query);
  } catch (e) {
    throw new Error(e);
  }
};

export const collectionAddStation = async (
  collectionId: FilterQuery<collectionDocument>,
  stationId: stationDetailDocument["_id"]
) => {
  try {
    await collectionModel.findByIdAndUpdate(collectionId, {
      $push: { stationCollection: stationId },
    });
    return collectionModel.findById(collectionId);
  } catch (e) {
    throw new Error(e);
  }
};

export const collectionRemoveStation = async (
  collectionId: FilterQuery<collectionDocument>,
  stationId: stationDetailDocument["_id"]
) => {
  try {
    await collectionModel.findByIdAndUpdate(collectionId, {
      $pull: { stationCollection: stationId },
    });
    return collectionModel.findById(collectionId);
  } catch (e) {
    throw new Error(e);
  }
};
