"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Badge, Button, Card, Container, Form, Spinner, Table } from "react-bootstrap";
import { RefreshCw, Trash2 } from "lucide-react";
import { customerService } from "@/services/customerService";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoadingId, setDeleteLoadingId] = useState(null);
    const [activateLoadingId, setActivateLoadingId] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("Active");

    const router = useRouter();

    const getCustomerId = (customer) => {
        return (
            customer?.customer_id ||
            customer?.id ||
            customer?.CustomerID ||
            customer?.CustomerId ||
            customer?.customerId
        );
    };

    const getActiveValue = (customer) => {
        return (
            customer?.is_active ??
            customer?.isActive ??
            customer?.active ??
            customer?.IsActive ??
            customer?.Active ??
            customer?.status ??
            customer?.customer_status ??
            customer?.CustomerStatus
        );
    };

    const isCustomerActive = (customer) => {
        const value = getActiveValue(customer);

        return (
            value === true ||
            value === 1 ||
            value === "1"
        );
    };

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

    const getReadableError = (error) => {
        const message =
            error?.response?.data?.message ||
            error?.response?.data?.detail ||
            error?.message ||
            "Something went wrong";

        if (
            message.includes("duplicate key") ||
            message.includes("UX_Customers_Email") ||
            message.includes("already exists")
        ) {
            return "Customer already exists and active.";
        }

        return message;
    };

    const fetchCustomers = async () => {
        try {
            setLoading(true);

            const response = await customerService.getCustomers();

            const customerList =
                response?.data?.customers ||
                response?.data ||
                response?.customers ||
                response?.result ||
                response?.results ||
                response ||
                [];

            setCustomers(Array.isArray(customerList) ? customerList : []);
        } catch (error) {
            toast.error(error.message || "Failed to fetch customers");
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const filteredCustomers = useMemo(() => {
        return customers.filter((customer) => {
            const searchText = `
                ${customer.full_name || ""}
                ${customer.phone || ""}
                ${customer.email || ""}
            `.toLowerCase();

            const matchesSearch = searchText.includes(search.toLowerCase());

            const activeStatus = isCustomerActive(customer);

            if (statusFilter === "All") {
                return matchesSearch;
            }

            if (statusFilter === "Active") {
                return matchesSearch && activeStatus;
            }

            if (statusFilter === "Inactive") {
                return matchesSearch && !activeStatus;
            }

            return matchesSearch;
        });
    }, [customers, search, statusFilter]);

    const handleDelete = async (customerId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this customer?"
        );

        if (!confirmDelete) return;

        try {
            setDeleteLoadingId(customerId);

            await customerService.deleteCustomer(customerId);

            toast.success("Customer deleted successfully");

            await fetchCustomers();
        } catch (error) {
            toast.error(error.message || "Failed to delete customer");
        } finally {
            setDeleteLoadingId(null);
        }
    };

    const handleActivateCustomer = async (customer) => {
        const customerId = getCustomerId(customer);

        const confirmActivate = window.confirm(
            "Are you sure you want to activate this customer?"
        );

        if (!confirmActivate) return;

        try {
            setActivateLoadingId(customerId);

            await customerService.createCustomer({
                full_name: customer.full_name,
                email: customer.email || null,
                phone: customer.phone || null,
                profile_image_url: customer.profile_image_url || null,
            });

            toast.success("Customer activated successfully");

            await fetchCustomers();
        } catch (error) {
            toast.error(getReadableError(error));
        } finally {
            setActivateLoadingId(null);
        }
    };

    return (
        <div className="bg-dashboard py-4 min-vh-100">
            <Container fluid>
                <div className="d-flex justify-content-end align-items-center mb-4 flex-wrap gap-3">
                    <Button
                        as={Link}
                        href="/customers/create"
                        variant="primary"
                        className="text-white rounded-3 px-3"
                    >
                        Add Customer
                    </Button>
                </div>

                <Card className="border-0 rounded-4 shadow-sm">
                    <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
                            <Form.Control
                                placeholder="Search customer, phone, email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ maxWidth: "360px" }}
                            />

                            <div className="d-flex align-items-center gap-2">
                                <Form.Select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    style={{ maxWidth: "180px" }}
                                >
                                    <option value="All">All Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </Form.Select>

                                <Button
                                    type="button"
                                    variant="light"
                                    className="rounded-3 border"
                                    onClick={fetchCustomers}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Spinner animation="border" size="sm" />
                                    ) : (
                                        <RefreshCw size={16} />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <Table className="align-middle mb-0">
                                <thead>
                                    <tr className="text-muted small">
                                        <th>Sr. No.</th>
                                        <th>Customer</th>
                                        <th>Contact</th>
                                        <th>Status</th>
                                        <th className="text-center">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="text-center py-5"
                                            >
                                                <Spinner
                                                    animation="border"
                                                    size="sm"
                                                    className="me-2"
                                                />
                                                Loading customers...
                                            </td>
                                        </tr>
                                    ) : filteredCustomers.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="text-center py-5 text-muted"
                                            >
                                                No customers found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCustomers.map((customer, index) => {
                                            const activeStatus =
                                                isCustomerActive(customer);

                                            const customerId =
                                                getCustomerId(customer);

                                            return (
                                                <tr
                                                    key={customerId}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() =>
                                                        router.push(`/customers/details?id=${customerId}`)
                                                    }
                                                >
                                                    <td className="fw-semibold text-muted">
                                                        {index + 1}
                                                    </td>

                                                    <td>
                                                        <div className="d-flex align-items-center gap-3">
                                                            {getValidImageUrl(customer.profile_image_url) ? (
                                                                <img
                                                                    src={getValidImageUrl(customer.profile_image_url)}
                                                                    alt={customer.full_name || "Customer"}
                                                                    className="rounded-circle object-fit-cover"
                                                                    style={{
                                                                        width: "46px",
                                                                        height: "46px",
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div
                                                                    className="rounded-circle bg-warning-subtle d-flex align-items-center justify-content-center fw-bold text-primary"
                                                                    style={{
                                                                        width: "46px",
                                                                        height: "46px",
                                                                    }}
                                                                >
                                                                    {customer.full_name?.slice(0, 2)?.toUpperCase() || "CU"}
                                                                </div>
                                                            )}

                                                            <div>
                                                                <div className="fw-semibold">
                                                                    {customer.full_name || "-"}
                                                                </div>
                                                                <small className="text-muted">
                                                                    ID: {customerId || "-"}
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div>
                                                            {customer.phone || "-"}
                                                        </div>
                                                        <small className="text-muted">
                                                            {customer.email || "-"}
                                                        </small>
                                                    </td>

                                                    <td>
                                                        {activeStatus ? (
                                                            <Badge bg="primary">
                                                                Active
                                                            </Badge>
                                                        ) : (
                                                            <Badge bg="secondary">
                                                                Inactive
                                                            </Badge>
                                                        )}
                                                    </td>

                                                    <td className="text-center">
                                                        {activeStatus ? (
                                                            <>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline-primary"
                                                                    size="sm"
                                                                    className="rounded-3 border"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDelete(customerId);
                                                                    }}
                                                                    disabled={
                                                                        deleteLoadingId ===
                                                                        customerId
                                                                    }
                                                                >
                                                                    {deleteLoadingId ===
                                                                        customerId ? (
                                                                        <Spinner
                                                                            animation="border"
                                                                            size="sm"
                                                                        />
                                                                    ) : (
                                                                        <Trash2 size={15} />
                                                                    )}
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <Button
                                                                type="button"
                                                                variant="outline-primary"
                                                                size="sm"
                                                                className="rounded-3"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleActivateCustomer(customer);
                                                                }}
                                                                disabled={
                                                                    activateLoadingId ===
                                                                    customerId
                                                                }
                                                            >
                                                                {activateLoadingId ===
                                                                    customerId ? (
                                                                    <>
                                                                        <Spinner
                                                                            animation="border"
                                                                            size="sm"
                                                                            className="me-2"
                                                                        />
                                                                        Activating...
                                                                    </>
                                                                ) : (
                                                                    "Activate"
                                                                )}
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}