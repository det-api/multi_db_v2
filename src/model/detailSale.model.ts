import mongoose, { Connection, Schema } from "mongoose";
import { coustomerDocument } from "./coustomer.model";
import connectDbs from "../utils/connect";
import {
  csStationDetailModel,
  ksStationDetailModel,
} from "./stationDetail.model";
import { dbDistribution } from "../utils/helper";

const kyawsanDb: Connection = connectDbs("kyawsan_DbUrl");
const commonDb: Connection = connectDbs("common_DbUrl");

export interface detailSaleDocument extends mongoose.Document {
  stationDetailId: string;
  dailyReportDate: string;
  vocono: string;
  carNo: string;

  cashType: string;
  casherCode: string;
  couObjId: coustomerDocument["_id"];
  isError: boolean;
  accessDb: string;
  vehicleType: string;
  nozzleNo: string;
  fuelType: string;
  salePrice: number;
  saleLiter: number;
  totalPrice: number;
  totalizer_liter: number;
  createAt: Date;
}

const detailSaleSchema = new Schema({
  stationDetailId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: dbDistribution(this),
  },
  accessDb: { type: String, required: true },
  vocono: { type: String, required: true, unique: true }, //g
  carNo: { type: String, default: null }, //g
  vehicleType: { type: String, default: "car" }, //g
  nozzleNo: { type: String, required: true }, //g
  fuelType: { type: String, required: true }, //g
  //update
  cashType: {
    type: String,
    default: "Cash",
    // enum: ["Cash", "KBZ_Pay", "Credit", "FOC", "Debt", "Others"],
  },
  casherCode: { type: String, required: true },
  couObjId: { type: Schema.Types.ObjectId, default: null },
  isError: { type: Boolean, default: false },

  salePrice: { type: Number, required: true },
  saleLiter: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  totalizer_liter: { type: Number, required: true },
  totalizer_amount: { type: Number, required: true },
  dailyReportDate: {
    type: String,
    default: new Date().toLocaleDateString(`fr-CA`),
  },
  createAt: { type: Date, default: new Date() },
});

// detailSaleSchema.pre("save", function (next) {
//  console.log(this);
//  if (this.createAt) {
//    console.log("wee zzoooo");
//  }
//   next();
// });

const ksDetailSaleModel = kyawsanDb.model<detailSaleDocument>(
  "detailSale",
  detailSaleSchema
);

const csDetailSaleModel = commonDb.model<detailSaleDocument>(
  "detailSale",
  detailSaleSchema
);

export { ksDetailSaleModel, csDetailSaleModel };
