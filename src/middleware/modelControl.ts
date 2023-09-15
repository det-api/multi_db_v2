import { NextFunction, Response, Request } from "express";
import { collectionGet } from "../service/collection.service";
import mongoose from "mongoose";

export const modelController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Fetch the collection based on the user's collectionId

    const collection = await collectionGet({
      _id: req.body.user[0].collectionId,
    });

    console.log(collection);
    console.log(req.body.user);

    // If collection doesn't exist, throw an error
    // if (collection.length == 0) {
    //   throw new Error("You cannot access this collection");
    // }

    // Check if the user's ID is present in the userCollection
    // const result = collection[0]?.stationCollection.find((ea) =>
    //   ea._id.equals(req.body.user[0].stationId)
    // );
    // console.log(result);

    if (collection.length == 0) {
      console.log("adm ppr");
      if (
        (req.body.user[0].roles[0].name == "det" ||
          req.body.user[0].roles[0].name == "PPRD") &&
        !req.query.collectionId
      )
        throw new Error("You cannot access this shit");

      let accDb = await collectionGet({
        _id: req.query.collectionId,
      });
      delete req.query.collectionId;
      req.body.accessDb = accDb[0].collectionName;
      next();
    } else {
      console.log('normal');
      req.body.accessDb = collection[0].collectionName;
      next(); // Proceed to the next middleware
    }
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};

export const locSevModelControl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const collection = await collectionGet({});

    let result = collection.filter((ea) =>   ea.stationCollection.find(
        (ea) => ea.toString() == req.body.stationDetailId
      )
    );

    if (result.length == 0) throw new Error("You need id");

    req.body.accessDb = result[0].collectionName;
    next();
  } catch (e) {
    next(e);
  }
};
