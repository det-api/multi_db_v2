import { Request, Response, NextFunction } from "express";
import fMsg from "../utils/helper";

import {
  collectionAdd,
  collectionAddStation,
  collectionDelete,
  collectionGet,
  collectionRemoveStation,
} from "../service/collection.service";
import { getStationDetail } from "../service/stationDetail.service";
import {
  csStationDetailModel,
  ksStationDetailModel,
} from "../model/stationDetail.model";

export const getCollectionHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await collectionGet(req.query);
    fMsg(res, "Collection are here", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const addCollectionHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await collectionAdd(req.body);
    fMsg(res, "New Collection was added", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const deletCollectionHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await collectionDelete(req.query);
    fMsg(res, "Collection was deleted");
  } catch (e) {
    next(new Error(e));
  }
};

export const collectionAddPermitHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let collection = await collectionGet({
      _id: req.body.collectionId,
    });

    let station;

    let ksStationDetail = await getStationDetail(
      { _id: req.body.stationId },
      'kyaw_san'
    );

    console.log(ksStationDetail);

    if (ksStationDetail.length == 0) {
      let csStationDetail = await getStationDetail(
        { _id: req.body.stationId },
        'common'
      );
      station = csStationDetail;
    } else {
      station = ksStationDetail;
    }

    if (collection.length == 0 || station.length == 0) {
      next(new Error("collection or station not found"));
    }
    let foundStation = collection[0].stationCollection.find(
      (ea: any) => ea._id == req.body.stationId
    );
    if (foundStation) {
      return next(new Error("station already in exist"));
    }
    console.log("wk");
    let result = await collectionAddStation(
      req.body.collectionId,
      req.body.stationId
    );
    fMsg(res, "station added ", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const collectionRemovePermitHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let collection = await collectionGet({
      _id: req.body.collectionId,
    });

    let foundStation = collection[0]["stationCollection"].find(
      (ea: {}) => ea["_id"] == req.body.stationId
    );
    if (!collection || !foundStation) {
      throw new Error("collection or station not found");
    }
    let result = await collectionRemoveStation(
      req.body.collectionId,
      req.body.stationId
    );
    fMsg(res, "station removed ", result);
  } catch (e) {
    next(new Error(e));
  }
};
