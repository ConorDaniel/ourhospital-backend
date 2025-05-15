import { v4 } from "uuid";
import { db } from "../models/db.js";
import { DepartmentSpec } from "../models/joi-schemas.js";

export const departmentController = {
  index: {
    handler: async function (request, h) {
      const department = await db.departmentStore.getDepartmentById(request.params.id);
      if (!department) {
        return h.response("Department not found").code(404);
      }

      const hospital = await db.hospitalStore.getHospitalById(department.hospitalId);
      if (!hospital) {
        return h.response("Hospital not found").code(404);
      }
      
      const staff = await db.staffStore.getStaffByDepartmentId(department._id);
      
      const viewData = {
        title: "Department",
        hospital: hospital,
        department: department,
        staff: staff,
      };
      return h.view("department-view", viewData);
    },
  },

  addDepartment: {
    validate: {
      payload: DepartmentSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("hospital-view", { 
          title: "Add department error", 
          errors: error.details 
        }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const hospital = await db.hospitalStore.getHospitalById(request.params.hospitalId);
      if (!hospital) {
        return h.response("Hospital not found").code(404);
      }
  
      const newDepartment = {
        hospitalId: hospital._id,
        title: request.payload.title, 
        deptLocation: request.payload.deptLocation 
      };
  
      await db.departmentStore.addDepartment(newDepartment);
      return h.redirect(`/hospital/${hospital._id}`);
    },
  },

  deleteDepartment: {
    handler: async function (request, h) {
      const hospital = await db.hospitalStore.getHospitalById(request.params.hospitalId);
      if (!hospital) {
        return h.response("Hospital not found").code(404);
      }

      await db.departmentStore.deleteDepartmentById(request.params.id);
      return h.redirect(`/hospital/${hospital._id}`);
    },
  },
};
