import { v4 } from "uuid";

let staffs = [];

export const staffMemStore = {
  async getAllStaffs() {
    return staffs;
  },

  async addStaff(departmentId, staff) {
    staff._id = v4();
    staff.departmentid = departmentId;
    staffs.push(staff);
    return staff;
  },

  async getStaffsByDepartmentId(id) {
    return staffs.filter((staff) => staff.departmentid === id);
  },

  async getStaffById(id) {
    return staffs.find((staff) => staff._id === id);
  },

  async getDepartmentStaffs(departmentId) {
    return staffs.filter((staff) => staff.departmentid === departmentId);
  },

  async getStaffByDepartmentId(departmentId) {
    return Staff.find({ departmentId }).lean();
  },
  
  async deleteStaff(id) {
    const index = staffs.findIndex((staff) => staff._id === id);
    staffs.splice(index, 1);
  },

  async deleteAllStaffs() {
    staffs = [];
  },

  async updateStaff(staff, updatedStaff) {
    staff.role = updatedStaff.role;
    staff.name = updatedStaff.name;
    staff.vignette = updatedStaff.vignette;
  },
};
