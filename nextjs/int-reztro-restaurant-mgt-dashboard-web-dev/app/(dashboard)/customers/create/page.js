"use client";

import { useState } from "react";
import { Container } from "react-bootstrap";
import { useRouter } from "next/navigation";
import CustomerForm from "@/components/customers/customerForm";
import { customerService } from "@/services/customerService";
import { toast } from "react-toastify";

export default function CreateCustomerPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const handleCreateCustomer = async (payload) => {
        try {
            setLoading(true);

            const response = await customerService.createCustomer(payload);

            const responseData =
                response?.data?.data ||
                response?.data ||
                response;

            if (responseData?.message === "Customer already exists") {
                toast.warning("Customer already exists");
                return;
            }

            toast.success(responseData?.message || "Customer created successfully");

            router.push("/orders/create");
        } catch (error) {
            toast.error(error.message || "Failed to create customer");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-dashboard py-4 min-vh-100">
            <Container fluid>
                <CustomerForm
                    onSubmit={handleCreateCustomer}
                    loading={loading}
                    submitText="Create Customer"
                />
            </Container>
        </div>
    );
}