import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  deptLocation: { type: String, required: true},
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
  },
});

export const Department = mongoose.model("Department", departmentSchema);
