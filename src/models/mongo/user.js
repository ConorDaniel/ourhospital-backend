import Mongoose from "mongoose";

const { Schema } = Mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  region: {
    type: Number,
    default: 0, // 0 = National / Admin
    min: 0,
    max: 6
  },
  pictureUrl: {
    type: String,
    default: "" // You can apply default logic on the frontend if empty
  }
});

export const User = Mongoose.model("User", userSchema);
