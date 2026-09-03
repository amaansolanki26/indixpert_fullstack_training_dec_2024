"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

const defaultValues = {
  full_name: "",
  phone: "",
  email: "",
  profile_image_url: "",
  vehicle_type: "",
  vehicle_number: "",
  status: "Offline",
};

export default function DriverForm({
  initialValues = defaultValues,
  onSubmit,
  loading = false,
  submitText = "Save Driver",
}) {
  const fileInputRef = useRef(null);

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(
    initialValues?.profile_image_url || "",
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    },
    mode: "onChange",
  });



  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select JPG, PNG or WEBP image");
      return;
    }

    setProfileImageFile(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };

  const removeProfileImage = () => {
    setProfileImageFile(null);
    setProfileImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const submitHandler = (data) => {
    const payload = {
      full_name: data.full_name.trim(),
      phone: data.phone || null,
      email: data.email || null,

      profile_image: profileImageFile,

      profile_image_url: profileImageFile ? null : profileImagePreview || null,

      vehicle_type: data.vehicle_type || null,
      vehicle_number: data.vehicle_number || null,
      status: data.status,
    };

    onSubmit(payload);
  };

  return (
    <Form noValidate onSubmit={handleSubmit(submitHandler)}>
      <Card className="border-0 rounded-4 shadow-sm">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <h4 className="fw-bold mb-1">Driver Information</h4>
              <p className="text-muted mb-0">
                Add or update delivery driver details
              </p>
            </div>

            <Button
              as={Link}
              href="/drivers"
              variant="light"
              className="rounded-3 border"
            >
              <ArrowLeft size={16} className="me-2" />
              Back
            </Button>
          </div>

          <Row className="g-3">
            <Col md={6}>
              <Form.Label>
                Full Name <span className="text-danger">*</span>
              </Form.Label>

              <Form.Control
                placeholder="Enter driver full name"
                isInvalid={!!errors.full_name}
                {...(() => {
                  const { onChange, ...rest } = register("full_name", {
                    required: "Driver full name is required",
                    minLength: {
                      value: 3,
                      message: "Full name must be at least 3 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z\s]+$/,
                      message:
                        "Name cannot contain numbers or special characters",
                    },
                  });
                  return {
                    ...rest,
                    onChange: (e) => {
                      const val = e.target.value;
                      const capitalized = val
                        .split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ");
                      e.target.value = capitalized;
                      onChange(e);
                    },
                  };
                })()}
              />

              <Form.Control.Feedback type="invalid">
                {errors.full_name?.message}
              </Form.Control.Feedback>
            </Col>

            <Col md={6}>
              <Form.Label>
                Phone <span className="text-danger">*</span>
              </Form.Label>

              <Form.Control
                placeholder="Enter phone number"
                isInvalid={!!errors.phone}
                {...register("phone", {
                  required: "Phone number is required",
                  minLength: {
                    value: 10,
                    message: "Phone number must be exactly 10 digits",
                  },
                  maxLength: {
                    value: 10,
                    message: "Phone number must be exactly 10 digits",
                  },
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Phone number must contain only 10 digits",
                  },
                })}
              />

              <Form.Control.Feedback type="invalid">
                {errors.phone?.message}
              </Form.Control.Feedback>
            </Col>

            <Col md={6}>
              <Form.Label>
                Email <span className="text-danger">*</span>
              </Form.Label>

              <Form.Control
                type="email"
                placeholder="Enter email address"
                isInvalid={!!errors.email}
                {...register("email", {
                  required: "Email address is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please enter a valid email address",
                  },
                })}
              />

              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Col>

            <Col md={6}>
              <Form.Label>
                Vehicle Type <span className="text-danger">*</span>
              </Form.Label>

              <Form.Select
                isInvalid={!!errors.vehicle_type}
                {...register("vehicle_type", {
                  required: "Vehicle type is required",
                })}
              >
                <option value="">Select vehicle type</option>
                <option value="Bike">Bike</option>
                <option value="Scooty">Scooty</option>
                <option value="Car">Car</option>
                <option value="Van">Van</option>
              </Form.Select>

              <Form.Control.Feedback type="invalid">
                {errors.vehicle_type?.message}
              </Form.Control.Feedback>
            </Col>

            <Col md={6}>
              <Form.Label>
                Vehicle Number <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                placeholder="RJ19AB1234"
                isInvalid={!!errors.vehicle_number}
                {...(() => {
                  const { onChange, ...rest } = register("vehicle_number", {
                    required: "Vehicle number is required",
                    maxLength: {
                      value: 50,
                      message: "Vehicle number must be less than 50 characters",
                    },
                  });
                  return {
                    ...rest,
                    onChange: (e) => {
                      e.target.value = e.target.value.toUpperCase();
                      onChange(e);
                    },
                  };
                })()}
              />

              <Form.Control.Feedback type="invalid">
                {errors.vehicle_number?.message}
              </Form.Control.Feedback>
            </Col>

            <Col md={6}>
              <Form.Label>Status</Form.Label>

              <Form.Select {...register("status")}>
                <option value="Online">Online</option>
                <option value="Busy">Busy</option>
                <option value="Offline">Offline</option>
              </Form.Select>
            </Col>

            <Col md={6}>
              <Form.Label>Profile Image</Form.Label>

              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-3 border bg-light d-flex align-items-center justify-content-center overflow-hidden"
                  style={{
                    width: "90px",
                    height: "90px",
                  }}
                >
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
                      alt="Driver preview"
                      className="w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    <span className="text-muted small">No Image</span>
                  )}
                </div>

                <div>
                  <Button
                    type="button"
                    variant="light"
                    className="rounded-3 border me-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose Image
                  </Button>

                  {profileImagePreview && (
                    <Button
                      type="button"
                      variant="outline-danger"
                      className="rounded-3"
                      onClick={removeProfileImage}
                    >
                      Remove
                    </Button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    hidden
                    onChange={handleImageChange}
                  />

                  <div className="text-muted small mt-2">
                    JPG, PNG or WEBP allowed
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <div className="d-flex justify-content-end mt-4">
            <Button
              type="submit"
              variant="primary"
              className="text-white rounded-3 px-4"
              disabled={loading}
            >
              <Save size={16} className="me-2" />
              {loading ? "Saving..." : submitText}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Form>
  );
}
