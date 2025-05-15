import { v4 } from "uuid";
import { staffMemStore } from "./staff-mem-store.js";

let departments = [];

export const departmentMemStore = {
  async getAllDepartments() {
    return departments;
  },

  async addDepartment(department) {
    department._id = v4();
    departments.push(department);
    return department;
  },

  async getUserDepartments(userid) {
    return departments.filter((department) => department.userid === userid);
  },

  async getDepartmentById(id) {
    const list = departments.find((department) => department._id === id);
    list.staffs = await staffMemStore.getStaffsByDepartmentId(list._id);
    return list;
  },

  async deleteDepartmentById(id) {
    const index = departments.findIndex((department) => department._id === id);
    departments.splice(index, 1);
  },

  async deleteAllDepartments() {
    departments = [];
  },
};

