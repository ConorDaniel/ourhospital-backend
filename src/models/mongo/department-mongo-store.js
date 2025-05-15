import mongoose from "mongoose";
import { Department } from "./department.js";

export const departmentMongoStore = {
  async getAllDepartments() {
    return Department.find().lean();
  },

  async getDepartmentsByHospitalId(hospitalId) {
    return Department.find({ hospitalId: new mongoose.Types.ObjectId(hospitalId) }).lean();
  },

  async getDepartmentById(id) {
    return Department.findById(new mongoose.Types.ObjectId(id)).lean();
  },

  async addDepartment(department) {
    const newDepartment = new Department(department);
    return newDepartment.save();
  },

  async deleteDepartmentById(id) {
    return Department.findByIdAndDelete(new mongoose.Types.ObjectId(id));
  },

  async deleteDepartmentsByHospitalId(hospitalId) {
    return Department.deleteMany({ hospitalId: new mongoose.Types.ObjectId(hospitalId) });
  },
};
