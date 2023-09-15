import { FilterQuery, UpdateQuery } from "mongoose";
import { csTankDataModel, ksTankDataModel, tankDataDocument, tankDataInput } from "../model/tankData.Detail.model";
import { dBSelector } from "../utils/helper";
import { csDetailSaleModel, ksDetailSaleModel } from "../model/detailSale.model";
import config  from "config";

const limitNo = config.get<number>('page_limit');

export const addTankDataService = async (body: any, dbModel: string) => { 
    try { 
        let selectedModel = dBSelector(dbModel, ksTankDataModel, csTankDataModel);


        const result = await selectedModel.create(body);
        if (!result) throw new Error("Tank data save is failed!");

        return result;

    } catch (e) {
        throw new Error(e);
    }
};

export const tankDataByDate = async (
    query: FilterQuery<tankDataDocument>,
    d1: Date,
    d2: Date,
    pageNo: number,
    dbModel: string
) => {
    let selectedModel = dBSelector(
        dbModel,
        ksTankDataModel,
        csTankDataModel
    );

    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    const filter: FilterQuery<tankDataDocument> = {
        ...query, createdAt: {
            $gt: d1,
            $lt: d2
        }
    };


    const data = await selectedModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skipCount)
        .limit(limitNo)
        .populate("stationDetailId")
        .select("-__v");
        
    const count = await selectedModel.countDocuments();

    return { data, count };
};

export const getAllTankDataService = async (dbModel: string,pageNo:number) => {
    try {
        let selectedModel = dBSelector(dbModel, ksTankDataModel, csTankDataModel);

        const reqPage = pageNo == 1 ? 0 : pageNo - 1;
        const skipCount = limitNo * reqPage;

        const result = await selectedModel
        .find()
         .sort({ createdAt: -1 })
        .skip(skipCount)
        .limit(limitNo)
        if (!result) throw new Error("All of tank data can't!");
        return result;
    } catch (e) {
        throw new Error(e);
    }
};

export const deleteTankDataById = async (query: FilterQuery<tankDataDocument>, dbModel: string) => {
    try {
        let selectedModel = dBSelector(dbModel, ksTankDataModel, csTankDataModel);
        
        let tankData = await selectedModel.find(query);
        if (!tankData) throw new Error("No tank data with that id!");
        return await selectedModel.deleteMany(query);
    } catch (e) { throw new Error(e); }
};

export const updateTankDataService = async (query: FilterQuery<tankDataDocument>, body: UpdateQuery<tankDataDocument>, dbModel: string) => {
    try {
        let selectedModel = dBSelector(dbModel, ksTankDataModel, csTankDataModel);
         
        await selectedModel.updateMany(query, body);
        return await selectedModel.find(query).lean();

    } catch (e) {
        throw new Error(e);
    }
};
