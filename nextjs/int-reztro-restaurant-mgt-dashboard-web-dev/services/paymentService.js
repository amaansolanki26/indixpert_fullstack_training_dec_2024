import api from "./api";

export const paymentService = {
    getPayments: () => {
        return api.get("/payments");
    },

    getPaymentById: (paymentId) => {
        return api.get(`/payments/${paymentId}`);
    },

    getPaymentByOrderId: (orderId) => {
        return api.get(`/orders/${orderId}/payment`);
    },

    updatePaymentById: (paymentId, payload) => {
        return api.put(`/payments/${paymentId}`, payload);
    },

    updatePaymentStatus: (paymentId, payload) => {
        return api.patch(
            `/payments/${paymentId}/status`,
            payload
        );
    },

    deletePayment: (paymentId) => {
        return api.delete(`/payments/${paymentId}`);
    },
};