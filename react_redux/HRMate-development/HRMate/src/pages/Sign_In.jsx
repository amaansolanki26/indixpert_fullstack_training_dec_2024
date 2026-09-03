import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { login } from "../store/slices/authSlice";
import { useState } from "react";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import Logo from "../assets/Logo.svg";

const schema = yup.object({
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
});

const Sign_In = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  // const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    const { email, password } = data;

    const admins = JSON.parse(localStorage.getItem("admins")) || [];

    if (admins.length === 0) {
      setError("email", {
        message: "No admin registered yet",
      });
      return;
    }

    const matchedAdmin = admins.find(
      (admin) => admin.email === email && admin.password === password,
    );

    if (!matchedAdmin) {
      setError("password", {
        message: "Invalid credentials",
      });
      return;
    }

    dispatch(
      login({
        fullName: matchedAdmin.fullName,
        email: matchedAdmin.email,
        role: matchedAdmin.role,
      }),
    );

    localStorage.setItem(
      "auth",
      JSON.stringify({
        fullName: matchedAdmin.fullName,
        email: matchedAdmin.email,
        role: matchedAdmin.role,
        isAuthenticated: true,
      }),
    );
    navigate("/dashboard");
  };
  return (
      <Container fluid className="signin-container">
        <Row className="signin-row">
          <Col md={6} className="mt-5">
            <Image src={Logo} className="ms-5 mb-5 mt-4" />
            <h1 className="mt-5 lh-base fw-semibold ms-5 mb-4 mt-5 pt-5">
              Logut the past, Login <br /> to the{" "}
              <span className="text-primary ">new</span>!
            </h1>

            <Form onSubmit={handleSubmit(onSubmit)}>
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

                    <NavLink className="text-primary no-underline float-end">
                      <small>Forget Password</small>
                    </NavLink>

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

                    <div className="text-danger">
                      {errors?.password?.message}
                    </div>
                  </Form.Group>
                </Col>
                <Form.Group className="ms-5 text-secondary">
                  <Form.Check
                    type="checkbox"
                    label="Remember my password"
                    // checked={rememberMe}
                    // onChange={(e) => setRememberMe(e.target.checked)}
                  />
                </Form.Group>
              </Row>
              <Button
                type="submit"
                className="btn btn-primary login-btn text-light px-5 mt-5 py-3 ms-5 "
              >
                Login
              </Button>
              <p className="login-text mt-5 fw-semibold ms-5 mb-5">
                Don't have an account?{" "}
                <NavLink to="/sign-up" className="no-underline">
                  Sign Up
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
                width={"731px"}
                height={"565px"}
                className="mb-5 hr-img"
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

export default Sign_In;
