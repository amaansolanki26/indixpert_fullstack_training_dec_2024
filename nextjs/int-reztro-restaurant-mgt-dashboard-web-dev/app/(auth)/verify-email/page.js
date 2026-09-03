"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import Logo from "@/public/Logo.svg";
import { AuthService } from "@/services/authService";

const schema = yup.object({
  otp: yup.string().length(6, "Enter 6 digit OTP").required("OTP is required"),
});

// Main Functional Component content
const VerifyEmailContent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputs = useRef([]);
  const params = useSearchParams();
  const email = params.get("email") || "";

  const { setValue, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setValue("otp", newOtp.join(""));
    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!paste) return;
    const arr = paste.split("");
    while (arr.length < 6) arr.push("");
    setOtp(arr);
    setValue("otp", arr.join(""));
    arr.forEach((digit, i) => {
      if (inputs.current[i]) inputs.current[i].value = digit;
    });
    inputs.current[5].focus();
  };

  const resendOTP = async () => {
    try {
      await AuthService.resendSignupOTP(email);
      setTimer(60);
      alert("Verification Code Sent");
    } catch (err) {
      alert(err.message || "Error resending code");
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      await AuthService.verifySignup(email, otp.join(""));
      alert("Email verified successfully! You can login now.");
      router.push("/signin");
    } catch (err) {
      alert(err.message || "Invalid OTP Code");
    } finally {
      setLoading(false);
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
              <div className="text-center mb-4">
                <h2 className="fw-bold">Verify Email</h2>
                <p className="text-muted mb-0">Enter code sent to <b>{email}</b></p>
              </div>

              <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="d-flex justify-content-between mb-2" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <Form.Control
                      key={index}
                      ref={(el) => (inputs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="text-center fw-bold fs-4 shadow-none"
                      style={{ width: "48px", height: "55px", borderRadius: "10px" }}
                    />
                  ))}
                </div>
                {errors.otp && <div className="text-danger small mb-3">{errors.otp.message}</div>}

                <Button type="submit" disabled={loading} className="w-100 py-3 rounded-3 fw-semibold">
                  {loading ? "Verifying..." : "Verify Email"}
                </Button>
              </Form>

              <div className="text-center mt-4">
                {timer > 0 ? (
                  <p className="text-muted mb-2">Resend OTP in <strong>{timer}s</strong></p>
                ) : (
                  <button type="button" className="btn btn-link p-0 text-decoration-none fw-semibold" onClick={resendOTP}>Resend OTP</button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Main Export wrapping with Suspense to handle searchParams properly
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center mt-5">Loading Verification...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}