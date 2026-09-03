"use client";

import { useEffect, useState } from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CustomerForm from "@/components/customers/customerForm";
import { customerService } from "@/services/customerService";
import { toast } from "react-toastify";

export default function EditCustomerPage() {
    const [id, setId] = useState(null);

    const [customer, setCustomer] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setId(params.get("id"));
    }, []);

    useEffect(() => {
        if (id === null) return;

        const fetchCustomer = async () => {
            try {
                setPageLoading(true);

                const response = await customerService.getCustomerById(id);

                const customerData =
                    response?.data?.customer ||
                    response?.data?.data ||
                    response?.data ||
                    response?.customer ||
                    response ||
                    null;

                setCustomer(customerData);
            } catch (error) {
                toast.error(error?.message || "Failed to fetch customer");
                setCustomer(null);
            } finally {
                setPageLoading(false);
            }
        };

        fetchCustomer();
    }, [id]);

    const handleUpdateCustomer = async (payload) => {
        try {
            setSaving(true);

            await customerService.updateCustomer(id, {
                full_name: payload.full_name,
                email: payload.email,
                phone: payload.phone,
                profile_image_url: payload.profile_image_url || "",
                profile_image_file: payload.profile_image_file || null,
                address: payload.address || null,
            });

            toast.success("Customer updated successfully!");

            setTimeout(() => {
                router.push("/customers");
            }, 2000);

        } catch (error) {
            toast.error(error.message || "Failed to update customer");
        } finally {
            setSaving(false);
        }
    };

    if (pageLoading || !id) {
        return (
            <div className="bg-dashboard py-4 min-vh-100">
                <Container fluid>
                    <div className="d-flex align-items-center gap-2">
                        <Spinner animation="border" size="sm" />
                        <span>Loading customer...</span>
                    </div>
                </Container>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="bg-dashboard py-4 min-vh-100">
                <Container fluid>
                    <div className="text-danger mb-3">
                        Customer not found
                    </div>

                    <Button
                        as={Link}
                        href="/customers"
                        variant="primary"
                        className="text-white rounded-3"
                    >
                        Back to Customers
                    </Button>
                </Container>
            </div>
        );
    }

    return (
        <div className="bg-dashboard py-4 min-vh-100">
            <Container fluid>

                <CustomerForm
                    initialValues={customer}
                    onSubmit={handleUpdateCustomer}
                    loading={saving}
                    submitText="Update Customer"
                    disableEmail={true}
                />
            </Container>
        </div>
    );
}