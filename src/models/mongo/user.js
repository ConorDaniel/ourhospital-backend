import Mongoose from "mongoose";
const { Schema } = Mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  hospitals: [{      
    type: Schema.Types.ObjectId,
    ref: "Hospital"
  }],
  pictureUrl: {
    type: String,
    default: ""
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
});

export const User = Mongoose.model("User", userSchema);
