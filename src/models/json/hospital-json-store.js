import { v4 } from "uuid";
import { db } from "./store-utils.js";
import { staffJsonStore } from "./staff-json-store.js";
import { departmentJsonStore } from "./department-json-store.js";

export const hospitalJsonStore = {
  async getAllHospitals() {
    await db.read();
    return db.data.hospitals || [];
  },

  async addHospital(hospital) {
    await db.read();
    db.data.hospitals = db.data.hospitals || [];
    hospital._id = v4();

    if (!hospital.userId) {
      throw new Error("Missing userid in addHospital()"); 
    }

    db.data.hospitals.push(hospital);
    await db.write();
    return hospital;
  },

  async getHospitalById(id) {
    await db.read();
    const hospital = db.data.hospitals.find((h) => String(h._id) === String(id)) || null;

    if (hospital) {
      hospital.type = hospital.type || "Other";
      hospital.departments = await departmentJsonStore.getDepartmentsByHospitalId(id) || [];

      for (let dept of hospital.departments) {
        dept.staff = await staffJsonStore.getStaffByDepartmentId(dept._id) || [];
      }
    }

    return hospital;
  },

  async getUserHospitals(userId) {
    await db.read();
    return (db.data.hospitals || []).filter((hospital) => hospital.userId === userId);
  },

  async deleteHospitalById(id) {
    await db.read();
    const index = db.data.hospitals.findIndex((hospital) => hospital._id === id);
    if (index !== -1) {
      db.data.hospitals.splice(index, 1);
      await db.write();
    }
  },

  async deleteAllHospitals() {
    db.data.hospitals = [];
    await db.write();
  },
};