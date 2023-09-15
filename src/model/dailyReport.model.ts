import mongoose, {Connection, Schema} from "mongoose";
import moment, { MomentTimezone } from "moment-timezone";
import connectDbs from "../utils/connect";
import { dbDistribution } from "../utils/helper";

const kyawsanDb: Connection = connectDbs("kyawsan_DbUrl");
const commonDb: Connection = connectDbs("common_DbUrl");

export interface dailyReportDocument extends mongoose.Document {
  stationId: string;
  dateOfDay: string;
  accessDb: string;
  date: Date;
}

const dailyReportSchema = new Schema({
  stationId: {
    type: Schema.Types.ObjectId,
    ref: dbDistribution(this),
    required: true,
  },
  accessDb: { type: String, required: true },
  dateOfDay: { type: String, default: new Date().toLocaleDateString(`fr-CA`) },
  date: { type: Date, default: new Date() },
});

dailyReportSchema.pre("save", function (next) {
  const currentDate = moment().tz("Asia/Yangon").format("YYYY-MM-DD");

  if (this.dateOfDay) {
    next();
  } else {
    this.dateOfDay = currentDate;
    next();
  }
});

const ksDailyReportModel = kyawsanDb.model<dailyReportDocument>(
  "dailyReport",
  dailyReportSchema
);

const csDailyReportModel = commonDb.model<dailyReportDocument>(
  "dailyReport",
  dailyReportSchema
);

export { ksDailyReportModel, csDailyReportModel };
