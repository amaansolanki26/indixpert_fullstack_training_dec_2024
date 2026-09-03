import api from "./api";

const getCustomerId = (customerId) => {
    return customerId?.customer_id || customerId?.id || customerId;
};

const buildCustomerPayload = (payload) => {
    const formData = new FormData();

    formData.append("full_name", payload.full_name?.trim() || "");
    formData.append("email", payload.email?.trim() || "");
    formData.append("phone", payload.phone?.trim() || "");
    formData.append("address", payload.address?.trim() || "");

    if (payload.profile_image_url) {
        formData.append(
            "profile_image_url",
            payload.profile_image_url
        );
    }

    if (payload.profile_image_file) {
        formData.append(
            "file",
            payload.profile_image_file
        );
    }

    return formData;
};

export const customerService = {
    getCustomers: () => api.get("/customers"),

    getCustomerById: (customerId) => {
        const id = getCustomerId(customerId);
        return api.get(`/customers/${id}`);
    },

    createCustomer: (payload) => {
        const formData = buildCustomerPayload(payload);
        return api.post("/customers", formData);
    },

    updateCustomer: (customerId, payload) => {
        const id = getCustomerId(customerId);
        const formData = buildCustomerPayload(payload);
        return api.put(`/customers/${id}`, formData);
    },

    deleteCustomer: (customerId) => {
        const id = getCustomerId(customerId);
        return api.delete(`/customers/${id}`);
    },
};