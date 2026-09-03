"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Container, Row, Col, Card, Form, Button, InputGroup } from "react-bootstrap";
import { Envelope } from "react-bootstrap-icons";
import Image from "next/image";
import Logo from "@/public/Logo.svg";
import { AuthService } from "@/services/authService";

const schema = yup.object({
  email: yup.string().email("Enter valid email").required("Email is required"),
});

const ForgotPasswordPage = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await AuthService.forgotPassword(data.email);
      // Directly redirect to reset form where user submits OTP and new password
      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      alert(err.message || "Error submitting password reset link");
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-4">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={5} xl={4}>
          <Card className="border-0 shadow-lg rounded-4">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="bg-primary-subtle rounded-4 p-3 d-inline-flex">
                  <Image src={Logo} alt="Logo" width={90} height={90} className="img-fluid" />
                </div>
              </div>
              <div className="text-center mb-5">
                <h2 className="fw-bold mb-2">Forgot Password</h2>
                <p className="text-muted mb-0">Enter your email and we'll send a code to reset password.</p>
              </div>

              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Email Address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-white border-end-0"><Envelope /></InputGroup.Text>
                    <Form.Control type="email" placeholder="Enter your email" className="border-start-0 py-3 shadow-none" {...register("email")} isInvalid={!!errors.email} />
                    <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Button type="submit" disabled={isSubmitting} className="w-100 py-3 fw-semibold rounded-3 bg-primary border-0 text-white">
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <button type="button" onClick={() => router.push("/signin")} className="btn btn-link text-primary fw-semibold text-decoration-none">Back to Sign In</button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPasswordPage;