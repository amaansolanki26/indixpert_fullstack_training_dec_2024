"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Logo from "@/public/Logo.svg";
import { AuthService } from "@/services/authService";
import { Container, Row, Col, Card, Form, Button, InputGroup } from "react-bootstrap";
import { Envelope, Lock, Person, Eye, EyeSlash, } from "react-bootstrap-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

const schema = yup.object({
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Enter valid email").required("Email is required"),
  password: yup.string().min(6, "Minimum 6 characters required").required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords must match").required("Confirm your password"),
});

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await AuthService.register(data);
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      alert(error.message || "Registration failed");
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
              <h1 className="display-4 fw-bold lh-sm mb-3">Smart Restaurant Platform</h1>
              <p className="fs-5 text-white-50 mb-0">Simplify your operations with management modules, analytics, and reservation handlers.</p>
            </div>
          </div>
        </Col>

        {/* RIGHT SIDE */}
        <Col xs={12} lg={6} className="bg-light d-flex align-items-center justify-content-center p-4">
          <Card className="border-0 shadow-lg w-100 rounded-4" style={{ maxWidth: "520px" }}>
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-5">
                <h2 className="fw-bold mb-2">Create Account</h2>
                <p className="text-muted mb-0">Sign up to access your dashboard</p>
              </div>

              <Form onSubmit={handleSubmit(onSubmit)}>
                {/* FULL NAME */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Full Name</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-white border-end-0"><Person /></InputGroup.Text>
                    <Form.Control type="text" placeholder="Enter your full name" className="border-start-0 py-3 shadow-none" {...register("fullName")} isInvalid={!!errors.fullName} />
                    <Form.Control.Feedback type="invalid">{errors.fullName?.message}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

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
                      placeholder="Create password"
                      className="border-start-0 border-end-0 py-3 shadow-none"
                      {...register("password")}
                      isInvalid={!!errors.password}
                    />

                    <InputGroup.Text
                      className="bg-white border-start-0"
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

                {/* CONFIRM PASSWORD */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    Confirm Password
                  </Form.Label>

                  <InputGroup>
                    <InputGroup.Text className="bg-white border-end-0">
                      <Lock />
                    </InputGroup.Text>

                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="border-start-0 border-end-0 py-3 shadow-none"
                      {...register("confirmPassword")}
                      isInvalid={!!errors.confirmPassword}
                    />

                    <InputGroup.Text
                      className="bg-white border-start-0"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <EyeSlash /> : <Eye />}
                    </InputGroup.Text>

                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword?.message}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Button type="submit" disabled={isSubmitting} className="w-100 py-3 fw-semibold rounded-3 bg-primary border-0 text-white">
                  {isSubmitting ? "Creating..." : "Create Account"}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <span className="text-muted">Already have an account?</span>
                <button type="button" onClick={() => router.push("/signin")} className="btn btn-link text-primary fw-bold text-decoration-none ms-2 p-0">Login</button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}