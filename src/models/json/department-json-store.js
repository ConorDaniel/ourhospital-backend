import { v4 } from "uuid";
import { db } from "./store-utils.js";
import { staffJsonStore } from "./staff-json-store.js";

export const departmentJsonStore = {
  async getAllDepartments() {
    await db.read();
    return db.data.departments;
  },

  async addDepartment(department) {
    await db.read();
    db.data.departments = db.data.departments || [];
    department._id = v4();
    db.data.departments.push(department);
    await db.write();
    return department;
},

  async getDepartmentById(id) {
    await db.read();
    const department = db.data.departments.find((d) => String(d._id) === String(id)) || null;

    if (!department) return null; 

    department.staff = await staffJsonStore.getStaffByDepartmentId(department._id) || [];
    return department;
},

  async getUserDepartments(userid) {
    await db.read();
    return db.data.departments.filter((department) => department.userid === userid);
  },

  async deleteDepartmentById(id) {
    await db.read();
    const index = db.data.departments.findIndex((department) => department._id === id);
    db.data.departments.splice(index, 1);
    await db.write();
  },

  async deleteAllDepartments() {
    db.data.departments = [];
    await db.write();
  },

  async getDepartmentsByHospitalId(hospitalId) {
    await db.read();
    return db.data.departments.filter((d) => d.hospitalId === hospitalId);
  }
};
