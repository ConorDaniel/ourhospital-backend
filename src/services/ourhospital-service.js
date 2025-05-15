import axios from "axios";
import { serviceUrl } from "../../test/fixtures.js";

export const OurHospitalService = {
  baseUrl: serviceUrl,

  // User methods
  async createUser(user) {
    const res = await axios.post(`${this.baseUrl}/api/users`, user);
    return res.data;
  },

  async getUser(id) {
    const res = await axios.get(`${this.baseUrl}/api/users/${id}`);
    return res.data;
  },

  async getUsers() {
    const res = await axios.get(`${this.baseUrl}/api/users`);
    return res.data;
  },

  async deleteAllUsers() {
    const res = await axios.delete(`${this.baseUrl}/api/users`);
    return res.data;
  },
  async createHospital(hospital) {
    const res = await axios.post(`${this.baseUrl}/api/hospitals`, hospital);
    return res.data;
  },

  async getHospital(id) {
    const res = await axios.get(`${this.baseUrl}/api/hospitals/${id}`);
    return res.data;
  },

  async getHospitals() {
    const res = await axios.get(`${this.baseUrl}/api/hospitals`);
    return res.data;
  },

  async deleteHospital(id) {
    const res = await axios.delete(`${this.baseUrl}/api/hospitals/${id}`);
    return res.data;
  },

  async deleteAllHospitals() {
    const res = await axios.delete(`${this.baseUrl}/api/hospitals`);
    return res.data;
  },
};
