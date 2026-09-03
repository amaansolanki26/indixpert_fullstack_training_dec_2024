import api from "./api";

export const adminService = {

  createAdmin(data) {
    return api.post("/admins", data);
  },

  getAdminByEmail(email) {
    return api.get(`/admins/email/${email}`);
  },

  updateAdmin(id, data) {
    return api.put(`/admins/${id}`, data);
  },

};