import { MasterList } from "./master-list.js";

export const masterListMongoStore = {
  async getAll() {
    return MasterList.find().sort("code").lean();
  },

  async getById(id) {
    return MasterList.findById(id).lean();
  },

  async getByCode(code) {
    return MasterList.findOne({ code }).lean();
  },

  async add(entry) {
    return new MasterList(entry).save();
  },

  async deleteAll() {
    return MasterList.deleteMany({});
  }
};
