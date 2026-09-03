"use client";

import { useState } from "react";
import { Container } from "react-bootstrap";
import { useRouter } from "next/navigation";
import DriverForm from "@/components/drivers/DriverForm";
import { driverService } from "@/services/driverService";
import { toast } from "react-toastify";

export default function CreateDriverPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const handleCreateDriver = async (payload) => {
        try {
            setLoading(true);

            await driverService.createDriver(payload);

            toast.success("Driver created successfully");

            router.push("/drivers");
        } catch (error) {
            const message =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.message ||
                "";

            if (message.includes("UQ_Drivers_Phone")) {
                toast.error("Phone number already exists.");
            } else if (message.includes("UQ_Drivers_Email")) {
                toast.error("Email already exists.");
            } else if (message.includes("UQ_Drivers_Vehicle_Number")) {
                toast.error("Vehicle number already exists.");
            } else if (message.includes("Network Error")) {
                toast.error("Network error. Please try again.");
            } else {
                toast.error("Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-dashboard py-4 min-vh-100">
            <Container fluid>

                <DriverForm
                    onSubmit={handleCreateDriver}
                    loading={loading}
                    submitText="Create Driver"
                />
            </Container>
        </div>
    );
}