import mongoose from "mongoose";
import { Staff } from "./staff.js";

export const staffMongoStore = {
  async getAllStaff() {
    return Staff.find().lean();
  },

  async getStaffById(id) {
    return Staff.findById(new mongoose.Types.ObjectId(id)).lean();
  },

  async getStaffByDepartmentId(departmentId) {
    return Staff.find({ departmentId: new mongoose.Types.ObjectId(departmentId) }).lean();
  },

  async addStaff(staff) {
    const newStaff = new Staff(staff);
    return newStaff.save();
  },

  async updateStaff(id, updatedStaff) {
    return Staff.findByIdAndUpdate(new mongoose.Types.ObjectId(id), updatedStaff, { new: true });
  },

  async deleteStaff(id) {
    return Staff.findByIdAndDelete(new mongoose.Types.ObjectId(id));
  },
};
