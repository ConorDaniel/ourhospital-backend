import Mongoose from "mongoose";
const { Schema } = Mongoose;

const masterListSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  code: {
    type: Number,
    required: true,
    unique: true,
    min: 0,
    max: 150
  }
});

export const MasterList = Mongoose.model("MasterList", masterListSchema);
