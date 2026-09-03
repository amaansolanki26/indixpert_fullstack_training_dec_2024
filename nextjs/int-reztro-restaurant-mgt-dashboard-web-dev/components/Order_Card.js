"use client";

import { CircleDashed } from "lucide-react";
import { Card, Col } from "react-bootstrap";
import { CheckCircle, X } from "react-bootstrap-icons";
import { useRouter } from "next/navigation";

export default function Order_Card({ item = {}, onDetails }) {
  const router = useRouter();

  const statusConfig = {
    Completed: {
      class: "bg-success text-primary",
      icon: <CheckCircle size={12} />,
    },
    Cancelled: {
      class: "bg-secondary-subtle text-dark",
      icon: <X size={18} />,
    },
    "On Process": {
      class: "bg-danger text-dark",
      icon: <CircleDashed size={12} />,
    },
  };

  const orderItems =
    item.items ||
    item.orderItems ||
    item.order_items ||
    item.menuItems ||
    item.menus ||
    [];

  const customerName =
    item.customerName ||
    item.customer ||
    item.customer_name ||
    "-";

  const orderId =
    item.orderId ||
    item.order_id ||
    item.id ||
    "-";

  const orderStatus = item.status || item.order_status || "On Process";

  const subtotal =
    item.status === "Completed"
      ? item.totalAmount || item.total_amount || item.amount || 0
      : item.subtotal || item.sub_total || item.order_subtotal || item.amount || 0;

  const isValidImageUrl = (imageUrl) => {
    if (!imageUrl) return false;

    const url = String(imageUrl).trim();

    return (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("/")
    );
  };

  const formatCardDate = (dateValue) => {
    if (!dateValue || dateValue === "-") return "-";

    return new Date(dateValue).toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Col md={6} lg={4}>
      <Card className="border-0 shadow-sm rounded-4 p-3 h-100">
        {/* TOP */}
        <div className="d-flex justify-content-between text-muted small mb-2">
          <span>{formatCardDate(item.rawDate || item.date)}</span>
          <span>{item.time || "-"}</span>
        </div>

        {/* NAME + STATUS */}
        <div className="d-flex justify-content-between align-items-start mb-1">
          {/* LEFT */}
          <div>
            <div className="fw-semibold fs-5">{customerName}</div>
            <div className="text-primary small mt-1">#{orderId}</div>
          </div>

          {/* RIGHT */}
          <div className="d-flex flex-column align-items-end gap-1">
            {/* STATUS */}
            <span
              className={`px-3 py-1 rounded-pill small d-flex align-items-center gap-1 ${statusConfig[orderStatus]?.class || "bg-secondary text-white"
                }`}
            >
              {statusConfig[orderStatus]?.icon}
              {orderStatus}
            </span>

            {/* TYPE + TABLE */}
            <div className="d-flex align-items-center gap-2 text-muted small mt-1">
              <span>{item.orderType || item.order_type || "-"}</span>

              {item.tableNo && (
                <span className="badge bg-secondary-subtle text-dark rounded-2 fw-normal">
                  Table {item.tableNo}
                </span>
              )}
            </div>
          </div>
        </div>

        <hr className="my-2" />

        {/* ITEMS */}
        <div className="mb-3">
          <div className="fw-semibold mb-2">Items</div>

          <div
            className="d-flex flex-column gap-2 pe-1"
            style={{ height: "140px", overflowY: "auto" }}
          >
            {orderItems.length > 0 ? (
              orderItems.map((it, index) => {
                const itemName = it.name || it.menu_name || it.item_name || "Item";
                const itemQty = it.qty || it.quantity || 1;
                const itemPrice = it.price || it.amount || 0;
                const itemImage =
                  it.image ||
                  it.image_url ||
                  it.menu_image ||
                  it.item_image ||
                  it.menuImage ||
                  "";

                return (
                  <div
                    key={it.id || it.item_id || index}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="position-relative overflow-hidden rounded-3 bg-light d-flex align-items-center justify-content-center"
                        style={{
                          width: 40,
                          height: 40,
                        }}
                      >
                        {isValidImageUrl(itemImage) ? (
                          <img
                            src={itemImage}
                            alt={itemName || "Food Image"}
                            className="w-100 h-100 object-fit-cover"
                          />
                        ) : (
                          <span className="small text-muted">
                            {itemName?.slice(0, 1)?.toUpperCase() || "I"}
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="small">{itemName}</div>
                        <div className="text-muted small">x{itemQty}</div>
                      </div>
                    </div>

                    <div className="small text-secondary">
                      ${Number(itemPrice || 0).toFixed(2)}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-100 d-flex align-items-center justify-content-center text-muted small">
                No items found
              </div>
            )}
          </div>
        </div>

        <hr className="my-2" />

        {/* TOTAL */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="fw-semibold">Total</span>
          <span className="fw-semibold text-primary">
            ${Number(subtotal || 0).toFixed(2)}
          </span>
        </div>

        {/* BUTTONS */}
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-light btn-sm w-100 rounded-3"
            onClick={onDetails}
          >
            See Details
          </button>

          <button
            type="button"
            className="btn btn-success btn-sm w-100 rounded-3 text-dark"
            onClick={() => router.push(`/orders/payment?id=${item.id || item.order_id}`)}
          >
            Pay Bills
          </button>
        </div>
      </Card>
    </Col>
  );
}