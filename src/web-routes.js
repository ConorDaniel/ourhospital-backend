import { aboutController } from "./controllers/about-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { departmentController } from "./controllers/department-controller.js";
import { hospitalController } from "./controllers/hospital-controller.js";
import { staffController } from "./controllers/staff-controller.js";

export const webRoutes = [
  // Authentication & Home
  { method: "GET", path: "/", config: accountsController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "GET", path: "/logout", config: accountsController.logout },
  { method: "POST", path: "/register", config: accountsController.signup },
  { method: "POST", path: "/authenticate", config: accountsController.login },

  // Static Page
  { method: "GET", path: "/about", config: aboutController.index },

  // Dashboard (List Hospitals)
  { method: "GET", path: "/dashboard", config: dashboardController.index },

  // Hospital View & Management
  { method: "GET", path: "/hospital/{id}", config: hospitalController.index },
  { method: "POST", path: "/dashboard/addhospital", config: hospitalController.addHospital },
  { method: "GET", path: "/dashboard/deletehospital/{id}", config: hospitalController.deleteHospital },

  // Departments within Hospitals
  { method: "GET", path: "/hospital/{hospitalId}/department/{id}", config: departmentController.index },
  { method: "POST", path: "/hospital/{hospitalId}/department/add", config: departmentController.addDepartment },
  { method: "GET", path: "/hospital/{hospitalId}/department/{id}/delete", config: departmentController.deleteDepartment },

  // Staff within Departments (now handled via staffController)
  { method: "POST", path: "/hospital/{hospitalId}/department/{id}/addstaff", config: staffController.addStaff },
  { method: "GET", path: "/hospital/{hospitalId}/department/{id}/deletestaff/{staffid}", config: staffController.deleteStaff },

  // Static assets
  { method: "GET", path: "/public/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } },

  {
    method: "GET",
    path: "/api/test",
    handler: () => {
      return { message: "Hello from Hapi!" };
    },
    options: {
      cors: {
        origin: ["*"] // allow frontend to access
      },
      auth: false  // (optional: avoids redirecting to login)
    }
  }

];
