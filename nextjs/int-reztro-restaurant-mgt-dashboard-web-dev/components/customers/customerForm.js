"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { ArrowLeft, Save, MapPin } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

const defaultValues = {
    full_name: "",
    email: "",
    phone: "",
    profile_image_url: "",
    address: "",
};

export default function CustomerForm({
    initialValues = null,
    onSubmit,
    loading = false,
    submitText = "Save Customer",
}) {
    const fileInputRef = useRef(null);

    const [profileImageFile, setProfileImageFile] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState("");
    const [locationLoading, setLocationLoading] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        clearErrors,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues,
    });

    useEffect(() => {
        const safeValues = {
            full_name: initialValues?.full_name || "",
            email: initialValues?.email || "",
            phone: initialValues?.phone || "",
            profile_image_url: initialValues?.profile_image_url || "",
            address: initialValues?.address || initialValues?.customer_address || "",
        };

        reset(safeValues);

        setProfileImagePreview(initialValues?.profile_image_url || "");
        setProfileImageFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [initialValues, reset]);

    const getCurrentLocation = () => {
        try {
            if (!navigator.geolocation) {
                toast.error("Geolocation is not supported by your browser");
                return;
            }

            setLocationLoading(true);

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;

                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                        );

                        if (!response.ok) {
                            throw new Error("Failed to fetch address");
                        }

                        const data = await response.json();

                        if (data?.display_name) {
                            setValue("address", data.display_name);
                            toast.success("Location address added successfully");
                        } else {
                            toast.warning("Location found, but address not available");
                        }
                    } catch (error) {
                        toast.error(error.message || "Address could not be fetched");
                    } finally {
                        setLocationLoading(false);
                    }
                },
                (error) => {
                    setLocationLoading(false);

                    if (error.code === error.PERMISSION_DENIED) {
                        toast.error("Please allow location permission");
                    } else if (error.code === error.POSITION_UNAVAILABLE) {
                        toast.error("Location information is unavailable");
                    } else if (error.code === error.TIMEOUT) {
                        toast.error("Location request timed out");
                    } else {
                        toast.error("Unable to get current location");
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 0,
                }
            );
        } catch (error) {
            setLocationLoading(false);
            toast.error(error.message || "Something went wrong");
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            toast.error("Invalid image format. Only JPG, PNG and WEBP are allowed.");

            setProfileImageFile(null);
            setProfileImagePreview("");

            setValue("profile_image_url", "", {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            });

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            return;
        }

        setProfileImageFile(file);
        setProfileImagePreview(URL.createObjectURL(file));

        setValue("profile_image_url", "selected", {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        });

        clearErrors("profile_image_url");
    };

    const removeProfileImage = () => {
        setProfileImageFile(null);
        setProfileImagePreview("");

        setValue("profile_image_url", "", {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const submitHandler = async (data) => {
        try {
            const fullName = data.full_name?.trim() || "";
            const phone = data.phone?.trim() || "";
            const email = data.email?.trim() || "";
            const address = data.address?.trim() || "";

            const payload = {
                full_name: fullName,
                email: email || null,
                phone,
                address: address || null,

                profile_image_file: profileImageFile || null,

                profile_image_url:
                    profileImageFile
                        ? initialValues?.profile_image_url || null
                        : initialValues?.profile_image_url || null,
            };

            await onSubmit(payload);
        } catch (error) {
            toast.error(error.message || "Failed to submit customer");
        }
    };

    return (
        <Form noValidate onSubmit={handleSubmit(submitHandler)}>
            <Card className="border-0 rounded-4 shadow-sm">
                <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                        <div>
                            <h4 className="fw-bold mb-1">
                                Customer Information
                            </h4>
                            <p className="text-muted mb-0">
                                Add or update customer profile details
                            </p>
                        </div>

                        <Button
                            as={Link}
                            href="/customers"
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
                                Full Name{" "}
                                <span className="text-danger">*</span>
                            </Form.Label>

                            <Controller
                                name="full_name"
                                control={control}
                                rules={{
                                    required: "Customer full name is required",
                                    minLength: {
                                        value: 3,
                                        message:
                                            "Full name must be at least 3 characters",
                                    },
                                    pattern: {
                                        value: /^[A-Za-z\s]+$/,
                                        message: "Only letters and spaces are allowed",
                                    },
                                }}
                                render={({ field }) => (
                                    <Form.Control
                                        {...field}
                                        placeholder="Enter customer full name"
                                        isInvalid={!!errors.full_name}
                                    />
                                )}
                            />

                            <Form.Control.Feedback
                                type="invalid"
                                className={errors.full_name ? "d-block" : ""}
                            >
                                {errors.full_name?.message}
                            </Form.Control.Feedback>
                        </Col>

                        <Col md={6}>
                            <Form.Label>
                                Phone {" "}<span className="text-danger">*</span>
                            </Form.Label>

                            <Controller
                                name="phone"
                                control={control}
                                rules={{
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
                                }}
                                render={({ field }) => (
                                    <Form.Control
                                        {...field}
                                        placeholder="Enter phone number"
                                        isInvalid={!!errors.phone}
                                    />
                                )}
                            />

                            <Form.Control.Feedback
                                type="invalid"
                                className={errors.phone ? "d-block" : ""}
                            >
                                {errors.phone?.message}
                            </Form.Control.Feedback>
                        </Col>

                        <Col md={6}>
                            <Form.Label>Email {" "}<span className="text-danger">*</span></Form.Label>

                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    required: "Customer email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Please enter a valid email address",
                                    },
                                }}
                                render={({ field }) => (
                                    <Form.Control
                                        {...field}
                                        type="email"
                                        placeholder="Enter email address"
                                        isInvalid={!!errors.email}
                                    />
                                )}
                            />

                            <Form.Control.Feedback
                                type="invalid"
                                className={errors.email ? "d-block" : ""}
                            >
                                {errors.email?.message}
                            </Form.Control.Feedback>
                        </Col>

                        <Col md={6}>
                            <Form.Label>Address {" "}<span className="text-danger">*</span></Form.Label>

                            <div className="d-flex gap-2">
                                <Controller
                                    name="address"
                                    control={control}
                                    rules={{ required: "Customer address is required" }}
                                    render={({ field }) => (
                                        <Form.Control
                                            {...field}
                                            placeholder="Enter customer address"
                                            isInvalid={!!errors.address}
                                        />
                                    )}
                                />

                                <Button
                                    type="button"
                                    variant="outline-primary"
                                    className="rounded-3 text-nowrap"
                                    onClick={getCurrentLocation}
                                    disabled={locationLoading}
                                >
                                    <MapPin size={16} className="me-1" />
                                    {locationLoading ? "Finding..." : "Use Location"}
                                </Button>

                            </div>
                            <Form.Control.Feedback
                                type="invalid"
                                className={errors.address ? "d-block" : ""}
                            >
                                {errors.address?.message}
                            </Form.Control.Feedback>
                        </Col>

                        <Col md={6}>
                            <Form.Label>
                                Profile Image
                            </Form.Label>

                            <div className="d-flex align-items-center gap-3">
                                <div
                                    className={`rounded-3 border bg-light d-flex align-items-center justify-content-center overflow-hidden ${errors.profile_image_url ? "border-danger" : ""
                                        }`}
                                    style={{
                                        width: "90px",
                                        height: "90px",
                                    }}
                                >
                                    {profileImagePreview ? (
                                        <img
                                            src={profileImagePreview}
                                            alt="Customer preview"
                                            className="w-100 h-100 object-fit-cover"
                                        />
                                    ) : (
                                        <span className="text-muted small">
                                            No Image
                                        </span>
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

                            <Controller
                                name="profile_image_url"
                                control={control}
                                render={({ field }) => (
                                    <input type="hidden" {...field} />
                                )}
                            />
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