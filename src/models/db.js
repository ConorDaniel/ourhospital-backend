import { userMemStore } from "./mem/user-mem-store.js";
import { departmentMemStore } from "./mem/department-mem-store.js";
import { staffMemStore } from "./mem/staff-mem-store.js";
import { hospitalMemStore } from "./mem/hospital-mem-store.js";

import { userJsonStore } from "./json/user-json-store.js";
import { departmentJsonStore } from "./json/department-json-store.js";
import { staffJsonStore } from "./json/staff-json-store.js";
import { hospitalJsonStore } from "./json/hospital-json-store.js";

import { connectMongo } from "./mongo/connect.js";
import { userMongoStore } from "./mongo/user-mongo-store.js";
import { departmentMongoStore } from "./mongo/department-mongo-store.js";
import { staffMongoStore } from "./mongo/staff-mongo-store.js";
import { hospitalMongoStore } from "./mongo/hospital-mongo-store.js";

export const db = {
  userStore: null,
  departmentStore: null,
  staffStore: null,
  hospitalStore: null,

  init(storeType) {
    switch (storeType) {
      case "json":
        this.userStore = userJsonStore;
        this.departmentStore = departmentJsonStore;
        this.staffStore = staffJsonStore;
        this.hospitalStore = hospitalJsonStore;
        break;
      case "mongo":
        this.userStore = userMongoStore;
        this.departmentStore = departmentMongoStore;
        this.staffStore = staffMongoStore;
        this.hospitalStore = hospitalMongoStore;
        connectMongo();
        break;
      default:
        this.userStore = userMemStore;
        this.departmentStore = departmentMemStore;
        this.staffStore = staffMemStore;
        this.hospitalStore = hospitalMemStore;
    }
  },
};
