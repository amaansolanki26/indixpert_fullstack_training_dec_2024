import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useState } from "react";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import Logo from "../assets/Logo.svg";

const Sign_Up = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const schema = yup.object().shape({
    fullName: yup.string().required("Full name is required"),
    email: yup
      .string()
      .matches(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        "Enter a valid email address",
      )
      .required("Email address is required."),
    password: yup
      .string()
      .required("password is required")
      .min(6, "Password length should be atleast 6 characters long")
      .max(10, "Password length should be less than 10 characters")
      .matches(/^\S*$/, "password cannot contain spaces"),
    confirmPassword: yup
      .string()
      .required("Confirm password is required")
      .oneOf([yup.ref("password")], "Passwords must match"),
    terms: yup
      .boolean()
      .oneOf([true], "You must accept the terms & conditions"),
  });

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm({ resolver: yupResolver(schema) });

 const onSubmit = (data) => {
  const admins = JSON.parse(localStorage.getItem("admins")) || [];

  const isEmailExists = admins.some(
    (admin) => admin.email === data.email
  );

  if (isEmailExists) {
    alert("Admin with this email already exists");
    return;
  }

  const newAdmin = {
    fullName: data.fullName,
    email: data.email,
    password: data.password,
    role: "admin",
    isAuthenticated: false,
  };

  admins.push(newAdmin);

  localStorage.setItem("admins", JSON.stringify(admins));

  reset({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  navigate('/')
};
  return (
    <Container fluid className="signup-container ">
      <Row className="signup-row">
        <Col md={6} className="left-panel mt-5 pt-2 ">
            
          <Image src={Logo} className="ms-5" />
          <h1 className="mt-5 lh-base fw-semibold ms-5">
            If opportunity doesn’t <br /> knock, build a{" "}
            <span className="text-primary ">door</span>.
          </h1>
          <p className="text-secondary mt-4 ms-5">
            A designer knows he has achieved perfection not when <br /> there is
            nothing left to add, but when there is nothing left <br /> to take
            away.
          </p>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={8} className="ms-5">
                <Form.Group controlId="fullname" className="mb-3 mt-4">
                  <Form.Label className="fw-semibold">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control"
                    {...register("fullName")}
                  />
                  <div className="text-danger">{errors?.fullName?.message}</div>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={8} className="ms-5">
                <Form.Group controlId="email" className="mb-3">
                  <Form.Label className="fw-semibold">
                    E-mail Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    className="form-control"
                    {...register("email")}
                  />
                  <div className="text-danger">{errors?.email?.message}</div>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={8} className="ms-5">
                <Form.Group
                  controlId="password"
                  className="mb-3 position-relative"
                >
                  <Form.Label className="fw-semibold">Password</Form.Label>

                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                  />

                  <span
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye /> : <EyeSlash />}
                  </span>

                  <div className="text-danger">{errors?.password?.message}</div>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={8} className="ms-5">
                <Form.Group
                  controlId="confirmpass"
                  className="mb-3 position-relative"
                >
                  <Form.Label className="fw-semibold">
                    Confirm Password
                  </Form.Label>

                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                  />

                  <span
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <Eye /> : <EyeSlash />}
                  </span>

                  <div className="text-danger">
                    {errors?.confirmPassword?.message}
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4 ms-5">
              <Form.Check
                type="checkbox"
                label={
                  <span className="text-secondary">
                    I agree to all the Term of{" "}
                    <NavLink className="no-underline">conditions</NavLink> &{" "}
                    <NavLink className="no-underline">Privacy Policy</NavLink>
                  </span>
                }
                {...register("terms")}
                isInvalid={!!errors.terms}
              />
              <div className="text-danger small">{errors.terms?.message}</div>
            </Form.Group>
            <Button
              type="submit"
              className="btn btn-primary text-light px-5 mt-3 py-2 ms-5"
            >
              Create Account
            </Button>
            <p className="login-text mt-5 fw-semibold ms-5 mb-5">
              Already have an account?{" "}
              <NavLink to="/" className="no-underline">
                Log In
              </NavLink>
            </p>
          </Form>
        </Col>
        <Col
          md={6}
          className="right-panel d-flex align-items-center justify-content-center "
        >
          <div className="text-center">
            <Image
            src="https://t4.ftcdn.net/jpg/17/14/31/63/240_F_1714316327_30h04dSvquO2ycSH59LhyXKHHRhmmwgN.jpg"
            width={'731px'}
            height={'565px'}
              className="mb-5"
            />
            <h1 className="fw-semibold lh-base mb-4">
              Where <span className="highlight-underline">remote</span> teams{" "}
              <br />
              get work done
            </h1>
            <p className="fw-medium mb-4 ">
              The online collaborative whiteboard platform to bring teams
              <br />
              together, anytime, anywhere.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Sign_Up;
