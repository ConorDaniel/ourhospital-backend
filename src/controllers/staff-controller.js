import { db } from "../models/db.js";
import { StaffSpec } from "../models/joi-schemas.js";

export const staffController = {
  addStaff: {
    validate: {
      payload: StaffSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("department-view", {
          title: "Add Staff Error",
          errors: error.details
        }).takeover().code(400);
      }
    },
    handler: async function (request, h) {
      const department = await db.departmentStore.getDepartmentById(request.params.id);
      if (!department) {
        return h.response("Department not found").code(404);
      }

      const hospital = await db.hospitalStore.getHospitalById(department.hospitalId);
      if (!hospital) {
        return h.response("Hospital not found").code(404);
      }

      const newStaff = {
        role: request.payload.role,
        name: request.payload.name,
        vignette: request.payload.vignette,
        departmentId: department._id
      };

      await db.staffStore.addStaff(newStaff);
      return h.redirect(`/hospital/${hospital._id}/department/${department._id}`);
    }
  },

  deleteStaff: {
    handler: async function (request, h) {
      const department = await db.departmentStore.getDepartmentById(request.params.id);
      if (!department) {
        return h.response("Department not found").code(404);
      }

      await db.staffStore.deleteStaff(request.params.staffid);
      return h.redirect(`/hospital/${department.hospitalId}/department/${department._id}`);
    }
  }
};
