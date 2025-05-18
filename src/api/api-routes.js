import { userApi } from "./user-api.js";
import { hospitalApi } from "./hospital-api.js";
import { departmentApi } from "./department-api.js";
import { staffApi } from "./staff-api.js";
import { rankingApi } from "./ranking-api.js";  // ✅ Import ranking API
import { accountsController } from "../controllers/accounts-controller.js";

export const apiRoutes = [
  // User routes
  { method: "GET", path: "/api/users", config: userApi.find },
  { method: "POST", path: "/api/users", config: userApi.create },
  { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
  { method: "GET", path: "/api/users/{id}", config: userApi.findOne },
  { method: "GET", path: "/api/users/me", config: userApi.me },

  // Hospital routes
  { method: "GET", path: "/api/hospitals", config: hospitalApi.findAll },
  { method: "POST", path: "/api/hospitals", config: hospitalApi.create },
  { method: "GET", path: "/api/hospitals/{id}", config: hospitalApi.findOne },
  { method: "PUT", path: "/api/hospitals/{id}", config: hospitalApi.update },
  { method: "DELETE", path: "/api/hospitals/{id}", config: hospitalApi.deleteOne },
  { method: "DELETE", path: "/api/hospitals", config: hospitalApi.deleteAll },
  { method: "GET", path: "/api/my-hospitals", config: hospitalApi.findByUser },

  // Department routes
  { method: "POST", path: "/api/hospitals/{id}/departments", config: departmentApi.create },
  { method: "GET", path: "/api/hospitals/{id}/departments", config: departmentApi.getDepartmentsByHospitalId },
  { method: "GET", path: "/api/departments/{id}", config: departmentApi.findOne },
  { method: "PUT", path: "/api/departments/{id}", config: departmentApi.update },
  { method: "DELETE", path: "/api/departments/{id}", config: departmentApi.delete },

  // Staff routes
  { method: "POST", path: "/api/departments/{id}/staff", config: staffApi.create },
  { method: "GET", path: "/api/departments/{id}/staff", config: staffApi.findByDepartment },
  { method: "GET", path: "/api/staff/{id}", config: staffApi.findOne },
  { method: "PUT", path: "/api/staff/{id}", config: staffApi.update },
  { method: "DELETE", path: "/api/staff/{id}", config: staffApi.deleteOne },

  // Auth route (login to get token)
  { method: "POST", path: "/api/authenticate", config: accountsController.apiLogin },

  // ✅ Ranking routes (added at the end)
  ...rankingApi
];
