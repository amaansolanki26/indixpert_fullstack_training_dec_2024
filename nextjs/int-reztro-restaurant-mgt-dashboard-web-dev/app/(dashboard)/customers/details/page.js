"use client";

import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";
import { customerService } from "@/services/customerService";
import { toast } from "react-toastify";

export default function CustomerDetailsPage() {
    const router = useRouter();

    const [customer, setCustomer] = useState(null);
    const [customerId, setCustomerId] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const customerIdFromUrl = params.get("id");

        setCustomerId(customerIdFromUrl);
    }, []);

    useEffect(() => {
        if (customerId === null) return;

        const fetchCustomer = async () => {
            try {
                setPageLoading(true);

                const response =
                    await customerService.getCustomerById(customerId);

                const customerData =
                    response?.data?.customer ||
                    response?.data?.data ||
                    response?.data ||
                    response?.customer ||
                    response ||
                    null;

                setCustomer(customerData);
            } catch (error) {
                toast.error(
                    error?.message || "Failed to fetch customer"
                );
                setCustomer(null);
            } finally {
                setPageLoading(false);
            }
        };

        fetchCustomer();
    }, [customerId]);

    const getValidImageUrl = (imageUrl) => {
        if (!imageUrl) return null;

        const url = String(imageUrl).trim();

        if (
            url.startsWith("http://") ||
            url.startsWith("https://") ||
            url.startsWith("/")
        ) {
            return url;
        }

        return null;
    };

    if (pageLoading || !customerId) {
        return (
            <div className="bg-dashboard py-4 min-vh-100">
                <Container fluid>
                    <div className="d-flex align-items-center gap-2">
                        <Spinner animation="border" size="sm" />
                        <span>Loading customer details...</span>
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
                <Card className="border-0 rounded-4 shadow-sm">
                    <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                            <div>
                                <h4 className="fw-bold mb-1">
                                    Customer Details
                                </h4>
                                <p className="text-muted mb-0">
                                    View customer profile information
                                </p>
                            </div>

                            <div className="d-flex gap-2">
                                <Button
                                    as={Link}
                                    href="/customers"
                                    variant="light"
                                    className="rounded-3 border"
                                >
                                    <ArrowLeft size={16} className="me-2" />
                                    Back
                                </Button>

                                <Button
                                    type="button"
                                    variant="primary"
                                    className="text-white rounded-3"
                                    onClick={() =>
                                        router.push(`/customers/edit?id=${customerId}`)
                                    }
                                >
                                    <Edit size={16} className="me-2" />
                                    Edit
                                </Button>
                            </div>
                        </div>

                        <Row className="g-4">
                            <Col md={4}>
                                <Card className="border rounded-4 h-100">
                                    <Card.Body className="p-4 text-center">
                                        <div
                                            className="rounded-circle bg-warning-subtle d-flex align-items-center justify-content-center overflow-hidden mx-auto mb-3"
                                            style={{
                                                width: "120px",
                                                height: "120px",
                                            }}
                                        >
                                            {getValidImageUrl(customer.profile_image_url) ? (
                                                <img
                                                    src={getValidImageUrl(customer.profile_image_url)}
                                                    alt={customer.full_name || "Customer"}
                                                    className="w-100 h-100 object-fit-cover"
                                                />
                                            ) : (
                                                <span className="fw-bold text-primary fs-3">
                                                    {customer.full_name
                                                        ?.slice(0, 2)
                                                        ?.toUpperCase() || "CU"}
                                                </span>
                                            )}
                                        </div>

                                        <h5 className="fw-bold mb-1">
                                            {customer.full_name || "-"}
                                        </h5>

                                        <div className="text-muted small">
                                            Customer ID:{" "}
                                            {customer.customer_id ||
                                                customer.id ||
                                                "-"}
                                        </div>

                                        <div className="mt-3">
                                            {customer.is_active ? (
                                                <span className="badge bg-primary">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="badge bg-secondary">
                                                    Inactive
                                                </span>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={8}>
                                <Card className="border rounded-4 h-100">
                                    <Card.Body className="p-4">
                                        <h5 className="fw-bold mb-4">
                                            Customer Information
                                        </h5>

                                        <Row className="g-3">
                                            <Col md={6}>
                                                <label className="form-label">
                                                    Full Name
                                                </label>
                                                <div className="form-control bg-light">
                                                    {customer.full_name || "-"}
                                                </div>
                                            </Col>

                                            <Col md={6}>
                                                <label className="form-label">
                                                    Phone
                                                </label>
                                                <div className="form-control bg-light">
                                                    {customer.phone || "-"}
                                                </div>
                                            </Col>

                                            <Col md={6}>
                                                <label className="form-label">
                                                    Email
                                                </label>
                                                <div className="form-control bg-light">
                                                    {customer.email || "-"}
                                                </div>
                                            </Col>

                                            <Col md={6}>
                                                <label className="form-label">
                                                    Status
                                                </label>
                                                <div className="form-control bg-light">
                                                    {customer.is_active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </div>
                                            </Col>

                                            <Col md={12}>
                                                <label className="form-label">
                                                    Address
                                                </label>
                                                <div className="form-control bg-light">
                                                    {customer.address ||
                                                        customer.customer_address ||
                                                        "-"}
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}