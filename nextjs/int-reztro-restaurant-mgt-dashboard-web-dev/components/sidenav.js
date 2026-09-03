"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, Nav } from "react-bootstrap";
import { useRouter, usePathname } from "next/navigation";

import Logo from "@/public/Logo.svg";
import SymbolLogo from "@/public/Symbol.svg";

import {
  Grid,
  Calendar3,
  BoxSeam,
  ChevronDown,
  BoxArrowRight,
  ReceiptCutoff,
  ChatLeftText,
  WindowStack,
  People,
  CarFront,
} from "react-bootstrap-icons";
import { Star } from "lucide-react";
import { AuthService } from "@/services/authService";

export default function Sidenav() {
  const router = useRouter();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="d-none d-lg-flex p-4 flex-column h-100 border-end" style={{ minHeight: "100vh" }}>
        <Link href="/dashboard" className="mb-5 text-decoration-none">
          <Image src={Logo} alt="Logo" width={170} height={50} priority />
        </Link>

        <div className="d-flex flex-column flex-grow-1">
          <div className="flex-grow-1">
            <SidebarMenu />
          </div>

          <div className="mt-auto d-flex flex-column gap-3 pt-3">
            <div className="p-3 rounded-4 bg-success d-flex flex-column align-items-center">
              <p className="small mb-3 mt-5 text-center">
                Streamline restaurant <br />
                management with real- <br />
                time insights.
              </p>

              <button className="btn btn-primary text-white rounded-3 w-100">
                Upgrade Now
              </button>
            </div>

            {/* LOGOUT */}
            <Button
              type="button"
              onClick={async () => {
                await AuthService.logout();
                router.replace("/signin");
              }}
              className="w-100 d-flex align-items-center justify-content-center gap-2 rounded-3 border-0 bg-primary text-white fw-semibold py-2"
            >
              <BoxArrowRight size={18} />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Tablet / Mobile Icon Sidebar */}
      <div className="d-none d-md-flex d-lg-none p-3 flex-column h-100 align-items-center border-end" style={{ minHeight: "100vh" }}>
        <Link href="/dashboard" className="mb-5">
          <Image
            src={SymbolLogo}
            alt="Logo Icon"
            width={42}
            height={42}
            priority
          />
        </Link>

        <div className="d-flex flex-column flex-grow-1 align-items-center w-100">
          <div className="flex-grow-1 d-flex flex-column align-items-center w-100">
            <SidebarMenu iconsOnly />
          </div>

          {/* Fixed Logout Button Container for Tablet View */}
          <div className="mt-auto pt-3 border-top w-100 d-flex justify-content-center">
            <Button
              type="button"
              onClick={async () => {
                await AuthService.logout();
                router.replace("/signin");
              }}
              className="border-0 bg-light text-secondary d-flex align-items-center justify-content-center rounded-3 p-2"
              style={{ width: "42px", height: "42px" }}
              title="Logout"
            >
              <BoxArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function SidebarMenu({ iconsOnly = false }) {
  const router = useRouter();
  const pathname = usePathname();

  // Orders matching logic
  const ordersActive =
    pathname === "/orders" ||
    pathname.startsWith("/orders/") ||
    pathname.toLowerCase().includes("orderdetails");

  const inventoryActive =
    pathname === "/inventory" ||
    pathname.startsWith("/inventory/") ||
    pathname === "/purchase-order" ||
    pathname.startsWith("/purchase-order/");

  const inventorySubActive =
    pathname === "/inventory" || pathname.startsWith("/inventory/");

  const purchaseOrderSubActive =
    pathname === "/purchase-order" || pathname.startsWith("/purchase-order/");

  const menuActive =
    pathname === "/menu" ||
    pathname.toLowerCase().includes("menudetails") ||
    pathname.startsWith("/menu/edit") ||
    pathname.startsWith("/menu/add");

  const driversActive =
    pathname === "/drivers" || pathname.startsWith("/drivers/");

  const customersActive =
    pathname === "/customers" || pathname.startsWith("/customers/");

  // Master Data matching logic
  const MasterDataActive =
    pathname === "/master-data" ||
    pathname.startsWith("/master-data/") ||
    pathname === "/menu-master" ||
    pathname.startsWith("/menu-master/");

  // Calendar matching logic
  const calendarActive =
    pathname === "/calendar" ||
    pathname.startsWith("/calendar/") ||
    pathname.toLowerCase().includes("schedule");

  const [inventoryOpen, setInventoryOpen] = useState(inventoryActive);

  useEffect(() => {
    if (inventoryActive) setInventoryOpen(true);
    else setInventoryOpen(false);
  }, [inventoryActive]);

  return (
    <Nav className="flex-column gap-2">
      {/* Dashboard */}
      {iconsOnly ? (
        <Link
          href="/dashboard"
          className={`nav-link sidebar-link border-0 d-flex justify-content-center align-items-center rounded-3 p-2 fw-semibold ${pathname === "/dashboard" ? "text-white bg-primary" : "text-secondary"
            }`}
          style={{ width: "42px", height: "42px" }}
        >
          <Grid />
        </Link>
      ) : (
        <Link
          href="/dashboard"
          className={`nav-link sidebar-link fw-semibold ${pathname === "/dashboard" ? "active-sidebar" : "text-secondary"
            }`}
        >
          <Grid className="me-2" />
          {!iconsOnly && " Dashboard"}
        </Link>
      )}

      {/* Orders */}
      {iconsOnly ? (
        <Link
          href="/orders"
          className={`nav-link sidebar-link border-0 d-flex justify-content-center align-items-center rounded-3 p-2 fw-semibold ${ordersActive ? "text-white bg-primary" : "text-secondary"
            }`}
          style={{ width: "42px", height: "42px" }}
        >
          <ReceiptCutoff />
        </Link>
      ) : (
        <Link
          href="/orders"
          className={`nav-link sidebar-link fw-semibold ${ordersActive ? "active-sidebar" : "text-secondary"
            }`}
        >
          <ReceiptCutoff className="me-2" />
          {!iconsOnly && " Orders"}
        </Link>
      )}

      {/* Messages */}
      {iconsOnly ? (
        <Link
          href="/messages"
          className={`nav-link sidebar-link border-0 d-flex justify-content-center align-items-center rounded-3 p-2 fw-semibold ${pathname === "/messages" ? "text-white bg-primary" : "text-secondary"
            }`}
          style={{ width: "42px", height: "42px" }}
        >
          <ChatLeftText />
        </Link>
      ) : (
        <Link
          href="/messages"
          className={`nav-link sidebar-link fw-semibold ${pathname === "/messages" ? "active-sidebar" : "text-secondary"
            }`}
        >
          <ChatLeftText className="me-2" />
          {!iconsOnly && " Messages"}
        </Link>
      )}

      {/* Calendar */}
      {iconsOnly ? (
        <Link
          href="/calendar"
          className={`nav-link sidebar-link border-0 d-flex justify-content-center align-items-center rounded-3 p-2 fw-semibold ${calendarActive ? "text-white bg-primary" : "text-secondary"
            }`}
          style={{ width: "42px", height: "42px" }}
        >
          <Calendar3 />
        </Link>
      ) : (
        <Link
          href="/calendar"
          className={`nav-link sidebar-link fw-semibold ${calendarActive ? "active-sidebar" : "text-secondary"
            }`}
        >
          <Calendar3 className="me-2" />
          {!iconsOnly && " Calendar"}
        </Link>
      )}

      {/* Menu */}
      {iconsOnly ? (
        <Link
          href="/menu"
          className={`nav-link sidebar-link border-0 d-flex justify-content-center align-items-center rounded-3 p-2 fw-semibold ${menuActive ? "text-white bg-primary" : "text-secondary"
            }`}
          style={{ width: "42px", height: "42px" }}
        >
          <WindowStack />
        </Link>
      ) : (
        <Link
          href="/menu"
          className={`nav-link sidebar-link fw-semibold ${menuActive ? "active-sidebar" : "text-secondary"
            }`}
        >
          <WindowStack className="me-2" />
          {!iconsOnly && " Menu"}
        </Link>
      )}

      {/* Inventory */}
      {iconsOnly ? (
        <Link
          href="/inventory"
          className={`nav-link sidebar-link border-0 d-flex justify-content-center align-items-center rounded-3 p-2 fw-semibold ${inventoryActive ? "text-white bg-primary" : "text-secondary"
            }`}
          style={{ width: "42px", height: "42px" }}
        >
          <BoxSeam />
        </Link>
      ) : (
        <>
          <button
            type="button"
            onClick={() => {
              if (!inventoryOpen) {
                setInventoryOpen(true);
                router.push("/inventory");
              } else {
                setInventoryOpen(false);
              }
            }}
            className={`nav-link sidebar-link border-0 bg-transparent w-100 text-start d-flex align-items-center fw-semibold ${inventoryActive ? "text-primary" : "text-secondary"
              }`}
          >
            <BoxSeam />
            Inventory

            <ChevronDown
              size={12}
              className={`ms-2 ${inventoryOpen ? "rotate-180" : ""}`}
            />
          </button>

          {inventoryOpen && (
            <div className="ms-5 mt-1 d-flex flex-column gap-2">
              <Link
                href="/inventory"
                className={`dropdown-item rounded-3 p-2 fw-semibold ${inventorySubActive
                  ? "submenu-active"
                  : "submenu-item text-muted"
                  }`}
              >
                Inventory
              </Link>

              <Link
                href="/purchase-order"
                className={`dropdown-item rounded-3 p-2 fw-semibold ${purchaseOrderSubActive
                  ? "submenu-active"
                  : "submenu-item text-muted"
                  }`}
              >
                Purchase Order
              </Link>
            </div>
          )}
        </>
      )}

      {/* Reviews */}
      {iconsOnly ? (
        <Link
          href="/reviews"
          className={`nav-link sidebar-link border-0 d-flex justify-content-center align-items-center rounded-3 p-2 fw-semibold ${pathname === "/reviews" ? "text-white bg-primary" : "text-secondary"
            }`}
          style={{ width: "42px", height: "42px" }}
        >
          <Star size={17} />
        </Link>
      ) : (
        <Link
          href="/reviews"
          className={`nav-link sidebar-link fw-semibold ${pathname === "/reviews" ? "active-sidebar" : "text-secondary"
            }`}
        >
          <Star className="me-2 mb-1" size={17} />
          {!iconsOnly && " Reviews"}
        </Link>
      )}

      {/* Drivers */}
      {iconsOnly ? (
        <Link
          href="/drivers"
          className={`nav-link sidebar-link border-0 d-flex justify-content-center align-items-center rounded-3 p-2 fw-semibold ${driversActive ? "text-white bg-primary" : "text-secondary"
            }`}
          style={{ width: "42px", height: "42px" }}
        >
          <CarFront />
        </Link>
      ) : (
        <Link
          href="/drivers"
          className={`nav-link sidebar-link fw-semibold ${driversActive ? "active-sidebar" : "text-secondary"
            }`}
        >
          <CarFront className="me-2" />
          {!iconsOnly && " Drivers"}
        </Link>
      )}

      {/* Customers */}
      {iconsOnly ? (
        <Link
          href="/customers"
          className={`nav-link sidebar-link border-0 d-flex justify-content-center align-items-center rounded-3 p-2 fw-semibold ${customersActive ? "text-white bg-primary" : "text-secondary"
            }`}
          style={{ width: "42px", height: "42px" }}
        >
          <People />
        </Link>
      ) : (
        <Link
          href="/customers"
          className={`nav-link sidebar-link fw-semibold ${customersActive ? "active-sidebar" : "text-secondary"
            }`}
        >
          <People className="me-2" />
          {!iconsOnly && " Customers"}
        </Link>
      )}

      {/* Master Data */}
      {iconsOnly ? (
        <Link
          href="/master-data"
          className={`nav-link sidebar-link border-0 d-flex justify-content-center align-items-center rounded-3 p-2 fw-semibold ${MasterDataActive ? "text-white bg-primary" : "text-secondary"
            }`}
          style={{ width: "42px", height: "42px" }}
        >
          <WindowStack />
        </Link>
      ) : (
        <Link
          href="/master-data"
          className={`nav-link sidebar-link fw-semibold ${MasterDataActive ? "active-sidebar" : "text-secondary"
            }`}
        >
          <WindowStack className="me-2" />
          {!iconsOnly && " Master Data"}
        </Link>
      )}
    </Nav>
  );
}

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href="#"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    className="text-decoration-none"
  >
    {children}
  </a>
));

CustomToggle.displayName = "CustomToggle";