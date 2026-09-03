"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Logo from "@/public/Logo.svg";
import * as yup from "yup";

import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
} from "react-bootstrap";

import { Envelope, Lock, Eye, EyeSlash } from "react-bootstrap-icons";
import { AuthService } from "@/services/authService";
import api from "@/services/api";
import { useState } from "react";

const schema = yup.object({
  email: yup.string().email("Enter valid email").required("Email is required"),
  password: yup.string().min(6, "Minimum 6 characters required").required("Password is required"),
});

const SignInPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await AuthService.login(data.email, data.password);

      document.cookie = "isLoggedIn=true; path=/; max-age=86400; SameSite=Strict; Secure";

      await api.post("/admins");

      router.push("/dashboard");
    } catch (err) {
      alert(err.message || "Login or Database synchronization failed.");
    }
  };

  return (
    <Container fluid className="min-vh-100 p-0">
      <Row className="g-0 flex-column flex-lg-row min-vh-100">
        {/* LEFT SIDE */}
        <Col xs={12} lg={6} className="bg-primary d-flex align-items-center justify-content-center px-4 px-lg-5 py-5">
          <div className="text-white w-100 mx-auto" style={{ maxWidth: "600px" }}>
            <div className="mb-5">
              <div className="bg-white rounded-4 p-3 shadow d-inline-flex">
                <img
                  src={Logo.src}
                  alt="Logo"
                  width="110"
                  height="110"
                  className="img-fluid"
                />
              </div>
            </div>
            <div className="mb-5">
              <h1 className="display-4 fw-bold lh-sm mb-3">Welcome Back</h1>
              <p className="fs-5 text-white-50 mb-0">
                Login to manage your restaurant operations, track orders, monitor analytics, and deliver a seamless customer experience.
              </p>
            </div>
            <div className="d-flex flex-column gap-4">
              <div className="d-flex align-items-start gap-3">
                <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0 px-3 py-2">✓</div>
                <div className="text-start">
                  <h5 className="fw-semibold mb-1">Manage Orders</h5>
                  <p className="text-white-50 mb-0">Track and manage restaurant orders easily and efficiently.</p>
                </div>
              </div>
              <div className="d-flex align-items-start gap-3">
                <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0 px-3 py-2">✓</div>
                <div className="text-start">
                  <h5 className="fw-semibold mb-1">Real-Time Analytics</h5>
                  <p className="text-white-50 mb-0">Monitor restaurant performance and analytics instantly.</p>
                </div>
              </div>
            </div>
          </div>
        </Col>

        {/* RIGHT SIDE */}
        <Col xs={12} lg={6} className="bg-light d-flex align-items-center justify-content-center p-4">
          <Card className="border-0 shadow-lg w-100 rounded-4" style={{ maxWidth: "520px" }}>
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-5">
                <h2 className="fw-bold mb-2">Sign In</h2>
                <p className="text-muted mb-0">Login to continue to dashboard</p>
              </div>

              <Form onSubmit={handleSubmit(onSubmit)}>
                {/* EMAIL */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Email Address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-white border-end-0"><Envelope /></InputGroup.Text>
                    <Form.Control type="email" placeholder="Enter your email" className="border-start-0 py-3 shadow-none" {...register("email")} isInvalid={!!errors.email} />
                    <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* PASSWORD */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Password</Form.Label>

                  <InputGroup>
                    <InputGroup.Text className="bg-white border-end-0">
                      <Lock />
                    </InputGroup.Text>

                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="border-start-0 border-end-0 py-3 shadow-none"
                      {...register("password")}
                      isInvalid={!!errors.password}
                    />

                    <InputGroup.Text
                      className="bg-white border-start-0 cursor-pointer"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeSlash /> : <Eye />}
                    </InputGroup.Text>

                    <Form.Control.Feedback type="invalid">
                      {errors.password?.message}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <div className="text-end mb-4">
                  <button type="button" onClick={() => router.push("/forget-password")} className="btn btn-link text-primary text-decoration-none p-0 fw-semibold">
                    Forgot Password?
                  </button>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-100 py-3 fw-semibold rounded-3 bg-primary border-0 text-white">
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <span className="text-muted">Don't have an account?</span>
                <button onClick={() => router.push("/signup")} className="btn btn-link text-primary fw-bold text-decoration-none p-0 ms-2">
                  Sign Up
                </button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignInPage;