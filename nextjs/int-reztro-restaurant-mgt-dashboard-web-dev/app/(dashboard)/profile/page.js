"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Badge,
  Button,
  Form,
} from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import { adminService } from "@/services/adminService";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit Mode States
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ full_name: "" });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("idToken");

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const email = payload.email;

      if (!email) {
        toast.error("Admin email not found");
        return;
      }

      const response = await adminService.getAdminByEmail(email);

      const adminData = response.data || response;

      setAdmin(adminData);
    } catch (err) {
      console.error("Profile Load Error:", err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // EDIT HANDLERS
  // -------------------------
  const handleEditClick = () => {
    setFormData({ full_name: admin.full_name });
    setFormErrors({});
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (!!formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.full_name.trim()) {
      errors.full_name = "Full Name is required.";
    } else if (formData.full_name.trim().length < 3) {
      errors.full_name = "Full Name must be at least 3 characters long.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation check
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // 2. Call API via api.js (PUT /admins/{admin_id})
    try {
      setIsSaving(true);

      const updatePayload = {
        ...admin,
        ...formData,
      };

      await adminService.updateAdmin(admin.admin_id, updatePayload);

      setAdmin(updatePayload);

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Update Error:", err);
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-dashboard py-4 min-vh-100">
        <Container fluid>
          <div className="d-flex align-items-center gap-2">
            <Spinner animation="border" size="sm" />
            <span>Loading profile...</span>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-dashboard py-4 min-vh-100">
      <Container fluid>

        {admin && (
          <Row className="g-4">
            <Col lg={4}>
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body className="text-center p-4">
                  <PersonCircle size={120} className="text-primary mb-3" />

                  <h4 className="fw-bold mb-1">{admin.full_name}</h4>

                  <p className="text-muted mb-3">{admin.email}</p>

                  <Badge
                    bg={admin.is_active ? "success" : "secondary"}
                    className="px-3 py-2"
                  >
                    {admin.is_active ? "Active" : "Inactive"}
                  </Badge>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={8}>
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">Profile Details</h5>

                    {!isEditing && (
                      <Button
                        variant="primary"
                        className="rounded-3"
                        onClick={handleEditClick}
                      >
                        Edit Profile
                      </Button>
                    )}
                  </div>

                  {isEditing ? (
                    /* ---------------- EDIT FORM ---------------- */
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md={12} className="mb-4">
                          <Form.Group>
                            <Form.Label className="text-muted small mb-1">
                              Full Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="full_name"
                              value={formData.full_name}
                              onChange={handleInputChange}
                              isInvalid={!!formErrors.full_name}
                              placeholder="Enter your full name"
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.full_name}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        {/* Read-Only Fields */}
                        <Col md={6} className="mb-4">
                          <label className="text-muted small">Admin ID</label>
                          <div className="fw-semibold fs-6 text-muted">
                            {admin.admin_id}
                          </div>
                        </Col>

                        <Col md={6} className="mb-4">
                          <label className="text-muted small">Email Address</label>
                          <div className="fw-semibold fs-6 text-muted">
                            {admin.email}
                          </div>
                        </Col>

                        <Col md={6} className="mb-4">
                          <label className="text-muted small">Role</label>
                          <div className="fw-semibold fs-6 text-muted">
                            {admin.role}
                          </div>
                        </Col>

                        <Col md={6} className="mb-4">
                          <label className="text-muted small">Status</label>
                          <div className="fw-semibold fs-6 text-muted">
                            {admin.is_active ? "Active" : "Inactive"}
                          </div>
                        </Col>
                      </Row>

                      <div className="d-flex justify-content-end gap-2 mt-2 pt-3 border-top">
                        <Button
                          variant="light"
                          className="rounded-3"
                          onClick={handleCancelClick}
                          disabled={isSaving}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          type="submit"
                          className="rounded-3"
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <>
                              <Spinner size="sm" className="me-2" /> Saving...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      </div>
                    </Form>
                  ) : (
                    /* ---------------- VIEW MODE ---------------- */
                    <Row>
                      <Col md={6} className="mb-4">
                        <label className="text-muted small">Admin ID</label>
                        <div className="fw-semibold fs-6">{admin.admin_id}</div>
                      </Col>

                      <Col md={6} className="mb-4">
                        <label className="text-muted small">Role</label>
                        <div className="fw-semibold fs-6">{admin.role}</div>
                      </Col>

                      <Col md={6} className="mb-4">
                        <label className="text-muted small">Full Name</label>
                        <div className="fw-semibold fs-6">{admin.full_name}</div>
                      </Col>

                      <Col md={6} className="mb-4">
                        <label className="text-muted small">Email Address</label>
                        <div className="fw-semibold fs-6">{admin.email}</div>
                      </Col>

                      <Col md={6}>
                        <label className="text-muted small">Status</label>
                        <div className="fw-semibold fs-6">
                          {admin.is_active ? "Active" : "Inactive"}
                        </div>
                      </Col>
                    </Row>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}