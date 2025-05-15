import { v4 } from "uuid";
import { db } from "./store-utils.js";

export const staffJsonStore = {
  async getAllStaffs() {
    await db.read();
    return db.data.staff || [];
  },

  async getStaffsByHospitalId(hospitalId) {
    await db.read();
    return (db.data.staff || []).filter((staff) => staff.hospitalId === hospitalId);
  },
  
  async addStaff(departmentId, staff) {
    await db.read();
    if (!db.data.staff) db.data.staff = [];
    staff._id = v4();
    staff.departmentid = departmentId;
    db.data.staff.push(staff);
    await db.write();
    return staff;
  },

  async getStaffByDepartmentId(id) {
    await db.read();
    return (db.data.staff || []).filter((staff) => staff.departmentid === id);
  },

  async getStaffById(id) {
    await db.read();
    return (db.data.staff || []).find((staff) => staff._id === id);
  },

  async deleteStaff(id) {
    await db.read();
    if (!db.data.staff) return;
    const index = db.data.staff.findIndex((staff) => staff._id === id);
    if (index !== -1) {
      db.data.staff.splice(index, 1);
      await db.write();
    }
  },

  async deleteAllStaffs() {
    db.data.staff = [];
    await db.write();
  },

  async updateStaff(staff, updatedStaff) {
    staff.role = updatedStaff.role;
    staff.name = updatedStaff.name;
    staff.vignette = updatedStaff.vignette;
    await db.write();
  },
};
