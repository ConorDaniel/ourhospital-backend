import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  name: String,
  role: String,
  vignette: String,
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
});

export const Staff = mongoose.model("Staff", staffSchema);
