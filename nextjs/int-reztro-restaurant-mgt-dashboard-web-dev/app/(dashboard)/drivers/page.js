"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Form,
  Spinner,
  Table,
  ButtonGroup,
} from "react-bootstrap";
import { Edit, RefreshCw, Trash2 } from "lucide-react";
import { driverService } from "@/services/driverService";
import { toast } from "react-toastify";

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [activeFilter, setActiveFilter] = useState("active");

  const [error, setError] = useState("");

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await driverService.getDrivers();
      
      const driverList =
        response?.data?.drivers ||
        response?.data ||
        response?.drivers ||
        response ||
        [];

      setDrivers(Array.isArray(driverList) ? driverList : []);
    } catch (error) {
      setError(error.message || "Failed to fetch drivers");
      toast.error("Failed to load drivers");
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      const searchText = `
                ${driver.full_name || ""}
                ${driver.phone || ""}
                ${driver.email || ""}
                ${driver.vehicle_type || ""}
                ${driver.vehicle_number || ""}
            `.toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());

      const currentStatus = (driver.status || "").toLowerCase();
      const selectedStatus = statusFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "All" ||
        currentStatus === selectedStatus ||
        (selectedStatus === "available" && currentStatus === "online") ||
        (selectedStatus === "online" && currentStatus === "available");

      let matchesActive = true;
      if (activeFilter === "active") matchesActive = driver.is_active === true;
      if (activeFilter === "inactive")
        matchesActive = driver.is_active === false;

      return matchesSearch && matchesStatus && matchesActive;
    });
  }, [drivers, search, statusFilter, activeFilter]);

  const handleDelete = async (driverId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this driver?",
    );

    if (!confirmDelete) return;

    try {
      setDeleteLoadingId(driverId);
      setError("");

      await driverService.deleteDriver(driverId);
      toast.success("Driver deleted successfully");

      await fetchDrivers();
    } catch (error) {
      setError(error.message || "Failed to delete driver");
      const errorMessage = error?.message || "";
      if (
        errorMessage.includes("Database error") ||
        errorMessage.includes("deleting")
      ) {
        toast.error(
          "This driver is assigned somewhere, so it cannot be deleted!",
        );
      } else {
        toast.error(errorMessage || "Delete failed");
      }
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const statusClass = {
    available: "bg-primary",
    online: "bg-primary",
    busy: "bg-warning text-dark",
    offline: "bg-secondary",
  };

  return (
    <div className="bg-dashboard py-4 min-vh-100">
      <Container fluid>
        {/* HEADER - BUTTONS & FILTER SPLIT */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          {/* NEW ACTIVE/INACTIVE BUTTONS LIKE OTHER PAGES */}
          <div>
            <ButtonGroup>
              <Button
                variant={activeFilter === "all" ? "primary" : "outline-primary"}
                onClick={() => setActiveFilter("all")}
              >
                All
              </Button>
              <Button
                variant={
                  activeFilter === "active" ? "primary" : "outline-primary"
                }
                onClick={() => setActiveFilter("active")}
              >
                Active
              </Button>
              <Button
                variant={
                  activeFilter === "inactive" ? "primary" : "outline-primary"
                }
                onClick={() => setActiveFilter("inactive")}
              >
                Inactive
              </Button>
            </ButtonGroup>
          </div>

          <Button
            as={Link}
            href="/drivers/create"
            variant="primary"
            className="text-white rounded-3 px-3"
          >
            Add Driver
          </Button>
        </div>

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
              onClick={fetchDrivers}
            >
              Retry
            </Button>
          </Alert>
        )}

        <Card className="border-0 rounded-4 shadow-sm">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
              <Form.Control
                placeholder="Search driver, phone, email, vehicle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ maxWidth: "360px" }}
              />

              <div className="d-flex align-items-center gap-2">
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ maxWidth: "180px" }}
                >
                  <option value="All">All Status</option>
                  <option value="Available">Online / Available</option>
                  <option value="Busy">Busy</option>
                  <option value="Offline">Offline</option>
                </Form.Select>

                <Button
                  type="button"
                  variant="light"
                  className="rounded-3 border"
                  onClick={fetchDrivers}
                  disabled={loading}
                >
                  <RefreshCw size={16} />
                </Button>
              </div>
            </div>

            <div className="table-responsive">
              <Table className="align-middle mb-0">
                <thead>
                  <tr className="text-muted small">
                    <th>Driver</th>
                    <th>Contact</th>
                    <th>Vehicle</th>
                    <th>Status</th>
                    <th>Active State</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5">
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Loading drivers...
                      </td>
                    </tr>
                  ) : filteredDrivers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        No drivers found
                      </td>
                    </tr>
                  ) : (
                    filteredDrivers.map((driver) => (
                      <tr key={driver.driver_id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            {driver.profile_image_url ? (
                              <img
                                src={driver.profile_image_url}
                                alt={driver.full_name || "Driver"}
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
                                {driver.full_name?.slice(0, 2)?.toUpperCase() ||
                                  "DR"}
                              </div>
                            )}

                            <div>
                              <div className="fw-semibold">
                                {driver.full_name || "-"}
                              </div>
                              <small className="text-muted">
                                ID: {driver.driver_id}
                              </small>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div>{driver.phone || "-"}</div>
                          <small className="text-muted">
                            {driver.email || "-"}
                          </small>
                        </td>

                        <td>
                          <div>{driver.vehicle_type || "-"}</div>
                          <small className="text-muted">
                            {driver.vehicle_number || "-"}
                          </small>
                        </td>

                        <td>
                          <Badge
                            className={`${
                              statusClass[
                                (driver.status || "").toLowerCase()
                              ] || "bg-secondary"
                            } fw-normal px-3 py-2`}
                          >
                            {driver.status || "-"}
                          </Badge>
                        </td>

                        <td>
                          {driver.is_active ? (
                            <Badge bg="primary">Active</Badge>
                          ) : (
                            <Badge bg="secondary">Inactive</Badge>
                          )}
                        </td>

                        <td className="text-end">
                          <Button
                            as={Link}
                            href={`/drivers/edit?id=${driver.driver_id}`}
                            variant="light"
                            size="sm"
                            className="rounded-3 border me-2"
                          >
                            <Edit size={15} />
                          </Button>

                          <Button
                            type="button"
                            variant="light"
                            size="sm"
                            className="rounded-3 border text-danger"
                            onClick={() => handleDelete(driver.driver_id)}
                            disabled={deleteLoadingId === driver.driver_id}
                          >
                            {deleteLoadingId === driver.driver_id ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))
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