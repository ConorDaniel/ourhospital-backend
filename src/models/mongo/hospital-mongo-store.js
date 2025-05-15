import mongoose from "mongoose";
import { Hospital } from "./hospital.js"; // this is your Mongoose Hospital model

export const hospitalMongoStore = {
  async getAllHospitals() {
    return Hospital.find().lean();
  },

  async getHospitalById(id) {
    return Hospital.findById(new mongoose.Types.ObjectId(id)).lean();
  },

  async addHospital(hospital) {
    const newHospital = new Hospital(hospital);
    return newHospital.save();
  },

  async getUserHospitals(userId) {
    return Hospital.find({ userId }).lean();
  },

  async deleteHospitalById(id) {
    return Hospital.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
  }
};
