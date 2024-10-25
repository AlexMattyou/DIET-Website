import { Schema, model } from "mongoose";

const dataSchema = new Schema({
  total_views: { type: Number, default: 0 },
  month_views: {
      month: { type: Number},
      views: { type: Number, default: 0 } // Views count for the month
  },
  last_updated: { type: Date } // Last updated timestamp
});

const Overview = model("Overview", dataSchema);

export default Overview;