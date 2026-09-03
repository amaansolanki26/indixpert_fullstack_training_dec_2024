"use client";

import { useEffect, useState, useCallback } from "react";
import { Alert, Button, Container, Spinner } from "react-bootstrap";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DriverForm from "@/components/drivers/DriverForm";
import { driverService } from "@/services/driverService";

export default function EditDriverPage() {
    const router = useRouter();
    const [id, setId] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setId(params.get("id"));
    }, []);

    const [driver, setDriver] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const getReadableError = (error) => {
        const message =
            error?.response?.data?.message ||
            error?.response?.data?.detail ||
            error?.message ||
            "Something went wrong";

        if (message === "Network Error") {
            return "Network error";
        }

        if (Array.isArray(message)) {
            return message.map(err => `${err.loc.join(".")} - ${err.msg}`).join(", ");
        }

        return typeof message === "object" ? JSON.stringify(message) : message;
    };

    const fetchDriver = useCallback(async () => {
        if (!id) {
            setError("Driver ID not found");
            setPageLoading(false);
            return;
        }

        try {
            setPageLoading(true);
            setError("");

            const response = await driverService.getDriverById(id);

            const driverData =
                response?.data?.driver ||
                response?.data ||
                response?.driver ||
                response ||
                null;

            setDriver(driverData);
        } catch (error) {
            setError(getReadableError(error));
            setDriver(null);
        } finally {
            setPageLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDriver();
    }, [fetchDriver]);

    const handleUpdateDriver = async (payload) => {
        try {
            setSaving(true);
            setError("");

            await driverService.updateDriver(id, payload);

            router.push("/drivers");
        } catch (error) {
            setError(getReadableError(error));
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
                        <span>Loading driver...</span>
                    </div>
                </Container>
            </div>
        );
    }

    if (!driver) {
        return (
            <div className="bg-dashboard py-4 min-vh-100">
                <Container fluid>
                    {error && (
                        <Alert
                            variant="danger"
                            className="rounded-4 d-flex justify-content-between align-items-center gap-3"
                        >
                            <span>{error}</span>

                            <Button
                                type="button"
                                variant="outline-danger"
                                size="sm"
                                className="rounded-3"
                                onClick={fetchDriver}
                            >
                                Retry
                            </Button>
                        </Alert>
                    )}

                    <Button
                        as={Link}
                        href="/drivers"
                        variant="primary"
                        className="text-white rounded-3"
                    >
                        Back to Drivers
                    </Button>
                </Container>
            </div>
        );
    }

    return (
        <div className="bg-dashboard py-4 min-vh-100">
            <Container fluid>
                <div className="mb-4">
                    <h3 className="fw-bold mb-1">Edit Driver</h3>
                    <p className="text-muted mb-0">
                        Update delivery driver profile
                    </p>
                </div>

                {error && (
                    <Alert variant="danger" className="rounded-4">
                        {error}
                    </Alert>
                )}

                <DriverForm
                    initialValues={driver}
                    onSubmit={handleUpdateDriver}
                    loading={saving}
                    submitText="Update Driver"
                />
            </Container>
        </div>
    );
}