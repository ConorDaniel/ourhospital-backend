import { v4 } from "uuid";
import { staffMemStore } from "./staff-mem-store.js";
import { departmentMemStore } from "./department-mem-store.js";

let hospitals = [];

export const hospitalMemStore = {
  async getAllHospitals() {
    return hospitals;
  },

  async addHospital(hospital) {
    hospital._id = v4();
    hospitals.push(hospital);
    return hospital;
  },

  async getUserHospitals(userid) {
    return hospitals.filter((hospital) => hospital.userid === userid);
  },

  async getHospitalById(id) {
    const list = hospitals.find((hospital) => hospital._id === id);
    list.staffs = await staffMemStore.getStaffsByHospitalId(list._id);
    return list;
  },

  async deleteHospitalById(id) {
    const index = hospitals.findIndex((hospital) => hospital._id === id);
    hospitals.splice(index, 1);
  },

  async deleteAllHospitals() {
    hospitals = [];
  },
};

