import { Request,Response,NextFunction } from "express";
import { tankDataInput } from "../model/tankData.Detail.model";
import { addTankDataService, deleteTankDataById, getAllTankDataService, tankDataByDate, updateTankDataService } from "../service/tankData.service";
import fMsg from "../utils/helper";

export const addTankDataController = async(req: Request, res: Response, next: NextFunction) => {
    try { 
        console.log(req.body);
        let model = req.body.accessDb;
        let result = await addTankDataService(req.body, model);
        console.log(result);
        fMsg(res, "Tank data add is successful!", result);
    } catch (e) {
           next(new Error(e));
    }
};

export const getAllTankDataController = async (req: Request, res: Response, next: NextFunction) => {
    try { 
        let model = req.body.accessDb;
        let pageNo: number = Number(req.params.page);
        let result = await getAllTankDataService(model,pageNo);
        fMsg(res, "All is tank data", result);
    } catch (e) {
        next(new Error(e));
    }
};

export const getTankDataByDate = async (req: Request, res: Response, next: NextFunction) => {
    try { 
        let sDate: any = req.query.sDate;
        let eDate: any = req.query.eDate;
        let pageNo: number = Number(req.params.page);

         
        delete req.query.sDate;
        delete req.query.eDate;

        let query = req.query;

        if (!sDate) {
            throw new Error("you need date");
        }
        if (!eDate) {
            eDate = new Date();
        }

        let model = req.body.accessDb;

        const startDate: Date = new Date(sDate);
        const endDate: Date = new Date(eDate);
        let { data, count } = await tankDataByDate(query, startDate, endDate, pageNo, model);
        

        fMsg(res, "detail sale between two date", data, model, count);

    } catch (e) {
        next(new Error(e));
    }
};


export const deleteTankDataIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log()
        let model = req.body.accessDb;
        console.log("delete",model)
        let result = await deleteTankDataById(req.query, model);
        if (!result) throw new Error("Tank data delete is failed!");
        fMsg(res, "Tank Data was deleted!");
    } catch (e) {
        next(new Error(e));
   }  
};

export const updateTankDataController = async (req: Request, res: Response, next: NextFunction) => {
    try { 
        let model = req.body.accessDb;

        let result = await updateTankDataService(req.query, req.body, model);
        fMsg(res, 'Updated tank data!', result);

    } catch (e) {
        next(new Error(e));
    }
};