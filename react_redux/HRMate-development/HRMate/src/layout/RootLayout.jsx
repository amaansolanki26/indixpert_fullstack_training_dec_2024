import { Outlet, useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  Form,
  Image,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {  Bell, ChatDots, ChevronDown, Gear, Search  ,Facebook,
  Instagram,
  Linkedin,
  TwitterX,
  Youtube} from "react-bootstrap-icons";
import { useRef, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import Logo from "../assets/Logo.svg";

const RootLayout = () => {

const navigate = useNavigate();
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("auth");
    navigate("/", { replace: true });
  };


  const handleImageClick = () => {
    setShow(!show);
  };

  return (
    <Container fluid className="container-bg">
      <Row>
        <Col>
          <Navbar expand="lg">
            <Navbar.Brand as={NavLink} to="/dashboard" className="fw-bold">
              <Image src={Logo} height="28" className="" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
              <Nav className="me-auto ms-4 gap-4">
                <NavLink
                  to="/dashboard"
                  end
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "text-primary fw-semibold" : "text-secondary fw-semibold"}`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="schedule"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "text-primary fw-semibold" : "text-secondary fw-semibold"}`
                  }
                >
                  Schedule
                </NavLink>
                <NavLink
                  to="payroll"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "text-primary fw-semibold" : "text-secondary fw-semibold"}`
                  }
                >
                  Payroll
                </NavLink>
                <NavLink
                  to="employees"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "text-primary fw-semibold" : "text-secondary fw-semibold"}`
                  }
                >
                  Employees
                </NavLink>
              </Nav>
              <div className="d-flex align-items-center gap-4 flex-shrink-0">
                <Form>
                  <InputGroup className="rounded-pill overflow-hidden navbar-search ">
                    <InputGroup.Text className="bg-white border-end-0">
                      <Search className="text-secondary" />
                    </InputGroup.Text>

                    <Form.Control
                      type="search"
                      placeholder="Search employee, job, etc"
                      className="border-start-0 no-border"
                    />
                  </InputGroup>
                </Form>

                <Gear size={18} className="text-secondary" />
                <ChatDots size={18} className="text-secondary" />
                <Bell size={18} className="text-secondary" />
                
                <div>
                  <Dropdown show={show} ref={dropdownRef}>
                    <Dropdown.Toggle
                      as="div"
                      className="d-flex  no-caret  align-items-center p-0 bg-transparent border-0"
                      onClick={handleImageClick}
                    >
                      <Image
                        src="data:image/jpeg;base64,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"
                        width="30"
                        height="30"
                        roundedCircle
                        style={{ cursor: "pointer" }}
                      /> 
                      <ChevronDown/>
                    </Dropdown.Toggle>

                    <Dropdown.Menu align="end">
                      <Dropdown.Item as="button" onClick={handleLogout}>
                        {" "}
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </Navbar.Collapse>
          </Navbar>
        </Col>
      </Row>
      <Row>
        <Outlet />
        <Row>
      <Col md={8} className="d-flex flex-wrap align-items-center gap-3">
            <span className="text-muted small">
              Copyright © 2024 HRMate
            </span>

            <a href="#"  className="footer-link text-danger small no-underline">Privacy Policy</a>
            <a href="#" className="footer-link text-danger small no-underline">Term and conditions</a>
            <a href="#" className="footer-link text-danger small no-underline">Contact</a>
          </Col>

          <Col
            md={4}
            className="d-flex justify-content-md-end justify-content-start gap-3 mt-2 mt-md-0"
          >
            <Facebook className="footer-icon text-danger" />
            <TwitterX className="footer-icon text-danger" />
            <Instagram className="footer-icon text-danger" />
            <Youtube className="footer-icon text-danger" />
            <Linkedin className="footer-icon text-danger" />
          </Col>
    </Row>
      </Row>
    </Container>
  );
};

export default RootLayout;
