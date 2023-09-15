import mongoose, {Connection, Schema} from "mongoose";
import connectDbs from "../utils/connect";

const controlDb : Connection = connectDbs("controlDbUrl");


export interface checkStationDocument extends mongoose.Document {
  otpCode: string;
  stationId: string;
}

const checkStationSchema = new Schema({
  otpCode: { type: String, unique: true, required: true },
  stationId: {
    type: Schema.Types.ObjectId,
    ref: "stationDetail",
    require: true,
  },
  createdAt: { type: Date, default: Date.now() },
});

const checkStationModel = controlDb.model<checkStationDocument>(
  "checkStation",
  checkStationSchema
);

export default checkStationModel;
