import api from "./api";

const getDriverId = (driverId) => {
    return driverId?.driver_id || driverId?.id || driverId;
};

const buildDriverPayload = (payload) => {
    const formData = new FormData();

    formData.append("full_name", payload.full_name || "");
    formData.append("phone", payload.phone || "");
    formData.append("email", payload.email || "");
    formData.append("vehicle_type", payload.vehicle_type || "");
    formData.append("vehicle_number", payload.vehicle_number || "");
    formData.append("status", payload.status || "Offline");

    if (payload.profile_image instanceof File) {
        formData.append("file", payload.profile_image);
    } else if (payload.profile_image_url) {
        formData.append("profile_image_url", payload.profile_image_url);
    }

    // for (const [key, value] of formData.entries()) {
    //     console.log(key, value);
    // }

    return formData;
};

export const driverService = {
    getDrivers: () => api.get("/drivers"),

    getDriverById: (driverId) => {
        const id = getDriverId(driverId);
        return api.get(`/drivers/${id}`);
    },

    createDriver: (payload) => {
        const formData = buildDriverPayload(payload);

        return api.post("/drivers", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    updateDriver: (driverId, payload) => {
        const id = getDriverId(driverId);
        const formData = buildDriverPayload(payload);

        return api.put(`/drivers/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    deleteDriver: (driverId) => {
        const id = getDriverId(driverId);
        return api.delete(`/drivers/${id}`);
    },

    /*
    |--------------------------------------------------------------------------
    | DRIVER LOCATIONS CRUD
    |--------------------------------------------------------------------------
    */
    getDriverLocations: () => api.get("/driver-locations"),

    createDriverLocation: (payload) => {
        const jsonPayload = {
            driver_id: payload.driver_id,
            latitude: payload.latitude,
            longitude: payload.longitude,
        };
        return api.post("/driver-locations", jsonPayload);
    },

    getDriverLocationHistory: (driverId) => {
        const id = getDriverId(driverId);
        return api.get(`/driver-locations/driver/${id}/history`);
    },

    getLatestDriverLocation: (driverId) => {
        const id = getDriverId(driverId);
        return api.get(`/driver-locations/driver/${id}/latest`);
    },

    getLatestDriverLocationsAll: () => {
        return api.get("/driver-locations/latest");
    },

    deleteDriverLocation: (driverLocationId) => {
        return api.delete(`/driver-locations/${driverLocationId}`);
    },
};