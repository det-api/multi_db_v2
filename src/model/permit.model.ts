import mongoose, {Connection} from "mongoose";
import { Schema } from "mongoose";
import connectDbs from "../utils/connect";

const controlDb : Connection = connectDbs("controlDbUrl");

export interface permitDocument extends mongoose.Document {
  name: string;
}

const permitSchema = new Schema({
  name: { type: String, required: true, unique: true },
});

const permitModel = controlDb.model<permitDocument>("permit", permitSchema);
export default permitModel;
