import mongoose, {Connection} from "mongoose";
import { Schema } from "mongoose";
import PermitModel, { permitDocument } from "./permit.model";
import connectDbs from "../utils/connect";

const controlDb :Connection = connectDbs("controlDbUrl");

export interface roleDocument extends mongoose.Document {
  name: string;
  permits: permitDocument["_id"];
}

const roleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  permits: [{ type: Schema.Types.ObjectId, ref: PermitModel }],
});

const roleModel = controlDb.model<roleDocument>("role", roleSchema);
export default roleModel;
