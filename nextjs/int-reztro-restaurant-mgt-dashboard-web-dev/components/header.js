"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
    Navbar,
    Form,
    FormControl,
    Button,
    Offcanvas,
    Nav,
    Dropdown,
} from "react-bootstrap";

import {
    List,
    Bell,
    Grid,
    Bag,
    ChatDots,
    Calendar3,
    BoxSeam,
    StarFill,
    Search,
    Gear,
    ArrowLeft,
    People,
    Truck,
    WindowStack,
    BoxArrowRight,
    PersonCircle,
} from "react-bootstrap-icons";

import { AuthService } from "@/services/authService";
import { adminService } from "@/services/adminService";

export default function Header() {
    const [show, setShow] = useState(false);

    const pathname = usePathname();

    const [admin, setAdmin] = useState(null);

    const router = useRouter();

    useEffect(() => {
        loadAdmin();
    }, []);

    const loadAdmin = async () => {
        try {
            const token = localStorage.getItem("idToken");

            if (!token) return;

            const payload = JSON.parse(
                atob(token.split(".")[1])
            );

            const res = await adminService.getAdminByEmail(
                payload.email
            );

            setAdmin(res.data);
        } catch (error) {
            console.log("Admin Load Error", error);
        }
    };

    const isActive = (path) => {
        if (path === "/orders") {
            return (
                pathname === "/orders" ||
                pathname.startsWith("/orders/")
            );
        }

        if (path === "/menu") {
            return (
                pathname === "/menu" ||
                pathname.includes("/menuDetails")
            );
        }

        if (path === "/customers") {
            return (
                pathname === "/customers" ||
                pathname.startsWith("/customers/")
            );
        }

        if (path === "/drivers") {
            return (
                pathname === "/drivers" ||
                pathname.startsWith("/drivers/")
            );
        }

        return pathname === path;
    };

    const inventoryActive =
        pathname === "/inventory" ||
        pathname.startsWith("/inventory/") ||
        pathname === "/purchase-order";

    const pathParts = pathname.split("/").filter(Boolean);

    const formatName = (text) => {
        if (text === "orderdetails") return "Order Details";
        if (text === "menuDetails") return "Menu Details";
        if (text === "create") return "Create";
        if (text === "edit") return "Edit";

        return text
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const pageTitle =
        pathParts.length === 0
            ? "Dashboard"
            : formatName(pathParts[pathParts.length - 1]);

    const isDashboard =
        pathname === "/dashboard" ||
        pathname === "/";

    const isDetailsPage =
        pathname.includes("/orderdetails") ||
        pathname.includes("/menuDetails") ||
        pathname.includes("/menu/edit");

    return (
        <>
            <Navbar className="px-4 py-3 mt-3">
                <div className="w-100 d-flex align-items-start">
                    {/* LEFT TITLE */}
                    <div>
                        <div className="d-md-none mb-2">
                            <Image
                                src="/Symbol.svg"
                                alt="Logo"
                                width={40}
                                height={40}
                            />
                        </div>

                        <div className="d-flex align-items-center">
                            {/* BACK BUTTON */}
                            {isDetailsPage && (
                                <Button
                                    variant="transparent"
                                    className="mb-2"
                                    onClick={() => router.back()}
                                >
                                    <ArrowLeft
                                        className="text-muted"
                                        size={25}
                                    />
                                </Button>
                            )}

                            <h4 className="mb-1 fw-bold">
                                {pageTitle}
                            </h4>
                        </div>

                        {isDashboard ? (
                            <p className="text-muted mb-0">
                                Hello Admin
                            </p>
                        ) : (
                            <div
                                className={`small d-flex align-items-center flex-wrap ${isDetailsPage ? "ms-3" : ""
                                    }`}
                            >
                                <Link
                                    href="/dashboard"
                                    className="text-primary fw-semibold text-decoration-none"
                                >
                                    Dashboard
                                </Link>

                                {pathParts.map((part, index) => {
                                    const href = `/${pathParts
                                        .slice(0, index + 1)
                                        .join("/")}`;

                                    const isLast =
                                        index === pathParts.length - 1;

                                    return (
                                        <span key={index}>
                                            <span className="text-muted">
                                                {" "} / {" "}
                                            </span>

                                            {isLast ? (
                                                <span className="text-muted">
                                                    {formatName(part)}
                                                </span>
                                            ) : (
                                                <Link
                                                    href={href}
                                                    className="text-primary fw-semibold text-decoration-none"
                                                >
                                                    {formatName(part)}
                                                </Link>
                                            )}
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* DESKTOP RIGHT */}
                    <div className="d-none d-md-flex align-items-center gap-3 ms-auto">
                        <Form className="d-flex">
                            <div className="position-relative w-100">
                                <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />

                                <FormControl
                                    type="search"
                                    placeholder="Search"
                                    className="ps-5 border-0 rounded-3"
                                />
                            </div>
                        </Form>

                        <Button variant="light">
                            <Bell />
                        </Button>

                        <Button variant="light">
                            <Gear />
                        </Button>

                        {/* <div className="d-flex align-items-center gap-2 ms-2">
                            <div className="text-end lh-sm">
                                <div className="fw-semibold">
                                    {admin?.full_name || ""}
                                </div>

                                <small className="text-muted">
                                    {admin?.role || ""}
                                </small>
                            </div>

                            <Image
                                src="/Symbol.svg"
                                alt="User"
                                width={38}
                                height={38}
                                className="rounded-circle"
                            />
                        </div> */}
                        <Dropdown align="end">
                            <Dropdown.Toggle
                                as="div"
                                className="d-flex align-items-center gap-2 ms-2 border-0 bg-transparent cursor-pointer"
                                style={{ cursor: "pointer" }}
                                bsPrefix=" "
                            >
                                <div className="text-end lh-sm">
                                    <div className="fw-semibold">
                                        {admin?.full_name || ""}
                                    </div>

                                    <small className="text-muted">
                                        {admin?.role || ""}
                                    </small>
                                </div>

                                <Image
                                    src="/Symbol.svg"
                                    alt="User"
                                    width={38}
                                    height={38}
                                    className="rounded-circle"
                                />
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="shadow border-0 rounded-3">
                                <Dropdown.Item onClick={() => router.push("/profile")}>
                                    <PersonCircle className="me-2" />
                                    Profile
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item
                                    className="text-danger"
                                    onClick={async () => {
                                        await AuthService.logout();
                                        router.replace("/signin");
                                    }}
                                >
                                    <BoxArrowRight className="me-2" />
                                    Logout
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    {/* MOBILE BUTTON */}
                    <div className="d-md-none ms-auto">
                        <Button
                            variant="light"
                            onClick={() => setShow(true)}
                        >
                            <List size={28} />
                        </Button>
                    </div>
                </div>
            </Navbar>

            <Offcanvas
                show={show}
                onHide={() => setShow(false)}
                placement="end"
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        Menu
                    </Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body className="d-flex flex-column" style={{ height: "calc(100vh - 70px)" }}>
                    <div className="flex-grow-1 overflow-y-auto mb-3 pe-1">
                        <Nav className="flex-column gap-3">
                            <Link
                                href="/dashboard"
                                className={`nav-link d-flex align-items-center ${isActive("/dashboard")
                                    ? "text-primary fw-semibold"
                                    : "text-secondary"
                                    }`}
                                onClick={() => setShow(false)}
                            >
                                <Grid className="me-2" />
                                Dashboard
                            </Link>

                            <Link
                                href="/orders"
                                className={`nav-link d-flex align-items-center ${isActive("/orders")
                                    ? "text-primary fw-semibold"
                                    : "text-secondary"
                                    }`}
                                onClick={() => setShow(false)}
                            >
                                <Bag className="me-2" />
                                Orders
                            </Link>

                            <Link
                                href="/messages"
                                className={`nav-link d-flex align-items-center ${isActive("/messages")
                                    ? "text-primary fw-semibold"
                                    : "text-secondary"
                                    }`}
                                onClick={() => setShow(false)}
                            >
                                <ChatDots className="me-2" />
                                Messages
                            </Link>

                            <Link
                                href="/calendar"
                                className={`nav-link d-flex align-items-center ${isActive("/calendar")
                                    ? "text-primary fw-semibold"
                                    : "text-secondary"
                                    }`}
                                onClick={() => setShow(false)}
                            >
                                <Calendar3 className="me-2" />
                                Calendar
                            </Link>

                            <Link
                                href="/menu"
                                className={`nav-link d-flex align-items-center ${isActive("/menu")
                                    ? "text-primary fw-semibold"
                                    : "text-secondary"
                                    }`}
                                onClick={() => setShow(false)}
                            >
                                <Grid className="me-2" />
                                Menu
                            </Link>

                            <Dropdown>
                                <Dropdown.Toggle
                                    variant="light"
                                    className={`w-100 text-start d-flex align-items-center ${inventoryActive
                                        ? "text-primary fw-semibold"
                                        : "text-secondary"
                                        }`}
                                >
                                    <BoxSeam className="me-2" />
                                    Inventory
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        href="/inventory"
                                        className={
                                            isActive("/inventory")
                                                ? "text-primary fw-semibold"
                                                : "text-secondary"
                                        }
                                        onClick={() => setShow(false)}
                                    >
                                        Inventory
                                    </Dropdown.Item>

                                    <Dropdown.Item
                                        href="/purchase-order"
                                        className={
                                            isActive("/purchase-order")
                                                ? "text-primary fw-semibold"
                                                : "text-secondary"
                                        }
                                        onClick={() => setShow(false)}
                                    >
                                        Purchase Order
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                            <Link
                                href="/reviews"
                                className={`nav-link d-flex align-items-center ${isActive("/reviews")
                                    ? "text-primary fw-semibold"
                                    : "text-secondary"
                                    }`}
                                onClick={() => setShow(false)}
                            >
                                <StarFill className="me-2" />
                                Reviews
                            </Link>

                            <Link
                                href="/drivers"
                                className={`nav-link d-flex align-items-center ${isActive("/drivers")
                                    ? "text-primary fw-semibold"
                                    : "text-secondary"
                                    }`}
                                onClick={() => setShow(false)}
                            >
                                <Truck className="me-2" />
                                Drivers
                            </Link>

                            <Link
                                href="/customers"
                                className={`nav-link d-flex align-items-center ${isActive("/customers")
                                    ? "text-primary fw-semibold"
                                    : "text-secondary"
                                    }`}
                                onClick={() => setShow(false)}
                            >
                                <People className="me-2" />
                                Customers
                            </Link>

                            {/* Master Data Menu Added */}
                            <Link
                                href="/master-data"
                                className={`nav-link d-flex align-items-center ${pathname === "/master-data" || pathname.startsWith("/master-data/")
                                    ? "text-primary fw-semibold"
                                    : "text-secondary"
                                    }`}
                                onClick={() => setShow(false)}
                            >
                                <WindowStack className="me-2" />
                                Master Data
                            </Link>
                        </Nav>
                    </div>

                    {/* FIXED MOBILE LOGOUT BUTTON */}
                    <div className="mt-auto pt-3 border-top flex-shrink-0">
                        <Button
                            type="button"
                            onClick={async () => {
                                await AuthService.logout();
                                router.replace("/signin");
                            }}
                            className="w-100 d-flex align-items-center justify-content-center gap-2 rounded-3 border-0 bg-danger text-white fw-semibold py-2"
                        >
                            <BoxArrowRight size={18} />
                            Logout
                        </Button>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}