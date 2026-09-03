"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Container, Row, Col, Card, Form, Button, InputGroup } from "react-bootstrap";
import { ShieldLock, Key, Lock } from "react-bootstrap-icons";
import Image from "next/image";
import Logo from "@/public/Logo.svg";
import { AuthService } from "@/services/authService";

const schema = yup.object({
  otp: yup.string().length(6, "OTP must be 6 digits").required("OTP is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords must match").required("Confirm your password"),
});

const ResetPasswordContent = () => {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";
  const [timer, setTimer] = useState(60);
  const [resending, setResending] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const onSubmit = async (data) => {
    try {
      await AuthService.resetPassword(email, data.otp, data.password);
      alert("Password Changed Successfully! Please log in.");
      router.push("/signin");
    } catch (err) {
      alert(err.message || "Error resetting password. Check OTP again.");
    }
  };

  const resendOTP = async () => {
    try {
      setResending(true);

      await AuthService.forgotPassword(email);

      alert("OTP sent successfully.");

      setTimer(60);
    } catch (err) {
      alert(err.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-100 justify-content-center">
        <Col lg={5} md={8} sm={10}>
          <Card className="shadow rounded-4 border-0">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <Image src={Logo} width={80} height={80} alt="logo" />
              </div>
              <h2 className="fw-bold text-center">Reset Password</h2>
              <p className="text-center text-muted">
                Enter code sent to <br /><b>{email}</b>
              </p>

              <Form onSubmit={handleSubmit(onSubmit)}>
                {/* OTP INPUT */}
                <Form.Group className="mb-3">
                  <Form.Label>6-Digit Verification Code</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><Key /></InputGroup.Text>
                    <Form.Control placeholder="Enter 6-Digit OTP" {...register("otp")} isInvalid={!!errors.otp} />
                    <Form.Control.Feedback type="invalid">{errors.otp?.message}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* NEW PASSWORD */}
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><Lock /></InputGroup.Text>
                    <Form.Control type="password" placeholder="New Password" {...register("password")} isInvalid={!!errors.password} />
                    <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* CONFIRM PASSWORD */}
                <Form.Group className="mb-4">
                  <Form.Label>Confirm Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><ShieldLock /></InputGroup.Text>
                    <Form.Control type="password" placeholder="Confirm Password" {...register("confirmPassword")} isInvalid={!!errors.confirmPassword} />
                    <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Button type="submit" className="w-100 py-3" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Reset Password"}
                </Button>

                <div className="text-center mt-4">

                  {timer > 0 ? (
                    <p className="text-muted mb-2">
                      Resend OTP in <strong>{timer}s</strong>
                    </p>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-link text-decoration-none fw-semibold"
                      disabled={resending}
                      onClick={resendOTP}
                    >
                      {resending ? "Sending..." : "Resend OTP"}
                    </button>
                  )}

                </div>

                <div className="text-center mt-3">

                  <button
                    type="button"
                    className="btn btn-link text-decoration-none"
                    onClick={() => router.push("/signin")}
                  >
                    Back to Sign In
                  </button>

                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center mt-5">Loading Reset Screen...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}