import { Schema, mongo } from "mongoose";
import mongoose,{Connection} from "mongoose";
import connectDbs from "../utils/connect";
import { dbDistribution } from "../utils/helper";


const kyawsanDb: Connection = connectDbs('kyawsan_DbUrl');
const chawsuDb: Connection = connectDbs('common_DbUrl');


export interface tankDataInput {
    vocono: string,
    nozzleNo: string,
    asyncAlready: string,
    data:[]
};

export interface tankDataDocument extends mongoose.Document{
    createdAt: Date,
    updatedAt:Date
};

const tankDataSchema = new Schema({
    stationDetailId: {
        type: mongoose.Types.ObjectId,
        ref: dbDistribution(this),
        required: true
    },
    vocono: {
        type: String,
        required: true,
        unique: true
    },
    nozzleNo: {
        type: String,
        required:true,
    },
    data: {
        type: Array,
        default:[]
        
    }
}, {
    timestamps:true
});


 const ksTankDataModel = kyawsanDb.model<tankDataDocument>(
    "tankData",
    tankDataSchema
);
const csTankDataModel = chawsuDb.model<tankDataDocument>('tankData', tankDataSchema);

export { ksTankDataModel,csTankDataModel};
