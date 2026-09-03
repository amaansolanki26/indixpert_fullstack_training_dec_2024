import api from "./api";

export const logService = {
  createClientLog: (payload) => {
    return api.post("/client-logs", payload);
  },
};