"use client";

import { Suspense, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  Row,
  Col,
  Table,
  Badge,
  Button,
  Container,
} from "react-bootstrap";

import { CheckCircle, X, CircleDashed, Pencil, CreditCard } from "lucide-react";

import { useOrderDetails } from "@/hooks/useOrderDetails";
import { orderService } from "@/services/orderService";
import {
  ChatDots,
  Check,
  GeoAlt,
  Telephone,
  Shop,
  Person,
  Envelope,
  ArrowsAngleExpand,
  Plus,
  Dash,
  Crosshair,
} from "react-bootstrap-icons";
import { PiBowlSteam } from "react-icons/pi";
import { toast } from "react-toastify";

function OrderDetailsContent() {
  const router = useRouter();

  // Stable params to avoid re-render loops
  const searchParams = useSearchParams();
  const id = useMemo(() => searchParams.get("id"), [searchParams]);

  const [cancelLoading, setCancelLoading] = useState(false);

  // Dynamic Zoom State for + and - buttons
  const [zoom, setZoom] = useState(14);

  // Call order details hook
  const { order, loading, error } = useOrderDetails(id);

  // ALL HOOKS MUST BE BEFORE EARLY RETURNS
  const mapEmbedUrl = useMemo(() => {
    if (!order?.deliveryAddress) return "";

    // Setup Map Directions (Restaurant to Customer)
    const restaurantAddr = order.restaurantAddress
      ? order.restaurantAddress.trim()
      : "Restaurant, India";
    const saddr = encodeURIComponent(restaurantAddr);

    let customerAddr = order.deliveryAddress.trim();
    if (!customerAddr.toLowerCase().includes("india")) {
      customerAddr = `${customerAddr}, India`;
    }
    const daddr = encodeURIComponent(customerAddr);

    // z=${zoom} controls the live dynamic zooming
    return `https://maps.google.com/maps?saddr=${saddr}&daddr=${daddr}&t=m&z=${zoom}&output=embed&iwloc=near`;
  }, [order?.restaurantAddress, order?.deliveryAddress, zoom]);

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
    Pending: {
      class: "bg-warning text-dark",
      icon: <CircleDashed size={12} />,
    },
    Processing: {
      class: "bg-danger text-dark",
      icon: <CircleDashed size={12} />,
    },
  };

  const canCancelOrder = ["On Process"].includes(order?.status);
  const canUpdateOrder = ["On Process"].includes(order?.status);

  const handleUpdateOrder = () => {
    router.push(`/orders/edit?id=${id}`);
  };

  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?",
    );
    if (!confirmCancel) return;

    try {
      setCancelLoading(true);
      await orderService.cancelOrder(id);
      toast.success("Order cancelled successfully");
      router.push("/orders");
    } catch (error) {
      toast.error(error.message || "Failed to cancel order");
    } finally {
      setCancelLoading(false);
    }
  };

  const [pickupLoading, setPickupLoading] = useState(false);
  const [localOrder, setLocalOrder] = useState(null);

  const handlePickup = async () => {
    try {
      setPickupLoading(true);

      await orderService.updateOrderStatus(id, {
        order_status: "Completed",
        tracking_note: "Order picked up successfully",
      });

      toast.success("Order completed successfully");

      //IMPORTANT: instantly UI update
      setLocalOrder((prev) => ({
        ...prev,
        status: "Completed",
      }));
    } catch (error) {
      toast.error(error.message || "Failed to complete order");
    } finally {
      setPickupLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      await paymentService.updatePaymentStatus(id, {
        payment_status: "Paid",
      });

      if (order.orderType === "Dine-In") {
        await orderService.updateOrderStatus(id, {
          order_status: "Completed",
          tracking_note: "Payment completed successfully",
        });

        setLocalOrder((prev) => ({
          ...prev,
          status: "Completed",
        }));
      }

      toast.success("Payment completed successfully");
    } catch (error) {
      toast.error("Payment failed");
    }
  };

  // EARLY RETURNS
  if (loading) {
    return <div className="p-4 text-center">Loading order details...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-danger">{error}</div>;
  }

  if (!order) {
    return <div className="p-4 text-center">Order Not Found</div>;
  }

  const currentOrder = localOrder || order;

  // -------------------------------------------------------------
  // ROBUST TRACKING DATA LOGIC
  // -------------------------------------------------------------
  const fixedTrackingSteps = [
    "Order Placed",
    "Order Confirmed",
    "Preparing Food",
    "Out For Delivery",
    "Delivered",
  ];

  const trackingMap = new Map();
  (order.tracking || []).forEach((item) => {
    const key = String(item.status || item.title || item.name || "")
      .toLowerCase()
      .trim();
    trackingMap.set(key, item);
  });

  const currentStatusLower = String(order.status || "")
    .toLowerCase()
    .trim();
  let autoCompleteIndex = -1;
  if (currentStatusLower === "pending" || currentStatusLower === "placed")
    autoCompleteIndex = 0;
  else if (currentStatusLower === "confirmed") autoCompleteIndex = 1;
  else if (
    currentStatusLower === "preparing food" ||
    currentStatusLower === "on process" ||
    currentStatusLower === "processing"
  )
    autoCompleteIndex = 2;
  else if (
    currentStatusLower === "out for delivery" ||
    currentStatusLower === "shipped"
  )
    autoCompleteIndex = 3;
  else if (
    currentStatusLower === "delivered" ||
    currentStatusLower === "completed"
  )
    autoCompleteIndex = 4;

  const orderPlacedDate =
    order.createdDate ||
    order.created_at ||
    order.createdAt ||
    order.orderDate ||
    order.date;

  const orderPlacedTime = order.createdTime || order.orderTime || order.time;

  const trackingSteps = fixedTrackingSteps.map((status, index) => {
    const searchKey = status.toLowerCase();
    const data = trackingMap.get(searchKey);

    const isCompleted = !!data || index <= autoCompleteIndex;

    let stepDate = data?.date;
    let stepTime = data?.time;

    if (
      ["Order Placed", "Order Confirmed", "Preparing Food"].includes(status) &&
      (stepDate === "-" || !stepDate)
    ) {
      stepDate = order.deliveryDateTime?.date || "-";
    }

    if (
      ["Order Placed", "Order Confirmed", "Preparing Food"].includes(status) &&
      (stepTime === "-" || !stepTime)
    ) {
      stepTime = order.deliveryDateTime?.time || "-";
    }

    return {
      status: data?.status || data?.title || status,
      message: data?.message || "",
      date: stepDate || "-",
      time: stepTime || "-",
      completed: isCompleted,
    };
  });

  const isPaid =
    order?.payment?.payment_status === "Paid" ||
    order?.payment?.status === "Paid" ||
    order?.payment_status === "Paid";

  const canShowOrderActions =
    !isPaid && order?.status !== "Completed" && order?.status !== "Cancelled";

  const showPaymentStatusOnly = isPaid || order?.status === "Completed";

  // -------------------------------------------------------------
  // ROBUST DRIVER DATA EXTRACTION
  // -------------------------------------------------------------
  const driverName = order.driverName || order.driver?.name || "Jack Anderson";
  const driverStatus = order.driverStatus || order.driver?.status || "Online";
  const driverPhone =
    order.driverPhone || order.driver?.phone || "(555) 345-7890";
  const vehicleType =
    order.vehicleType ||
    order.driver?.vehicleType ||
    order.driver?.vehicle?.type ||
    order.vehicle?.type ||
    "Motorcycle";
  const vehicleNumber =
    order.vehicleNumber ||
    order.driver?.vehicleNumber ||
    order.driver?.vehicle?.number ||
    order.vehicle?.number ||
    "MM1340";
  const driverImage =
    order.driverImage || order.driver?.image || order.driver?.avatar || null;

  return (
    <div className="bg-dashboard py-4">
      <Container fluid>
        {/* MAIN LAYOUT */}
        <Row className="g-4 align-items-start">
          {/* LEFT */}
          <Col xl={7} xxl={7}>
            <div className="p-4 bg-white rounded-4 h-100">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <h3 className="fw-bold mb-0">
                    Order ID{" "}
                    <span className="text-primary">#{order.orderId}</span>
                  </h3>
                  <Badge
                    bg="info"
                    text="primary"
                    className="fw-normal px-2 py-1"
                  >
                    {order.orderType}
                  </Badge>
                </div>

                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <Badge
                    className={`d-flex align-items-center gap-2 px-2 py-2 rounded-pill fw-normal border-0 ${statusConfig[order.status]?.class ||
                      "bg-secondary text-white"
                      }`}
                  >
                    {statusConfig[order.status]?.icon}
                    {order.status}
                  </Badge>

                  {!isPaid &&
                    order.status !== "Completed" &&
                    order.status !== "Cancelled" && (
                      <>
                        {/* ---------------- Update Order ---------------- */}

                        {canUpdateOrder && (
                          <>
                            {/* Desktop */}
                            <Button
                              variant="outline-danger"
                              className="rounded-3 px-3 d-none d-xxl-inline-flex align-items-center gap-2"
                              onClick={handleUpdateOrder}
                            >
                              <Pencil size={16} />
                              Update Order
                            </Button>

                            {/* Mobile */}
                            <Button
                              variant="light"
                              className="rounded-circle shadow-sm border d-xxl-none d-flex align-items-center justify-content-center"
                              style={{
                                width: "46px",
                                height: "46px",
                                background: "#FFF4EF",
                                color: "#FF6B35",
                              }}
                              onClick={handleUpdateOrder}
                              title="Update Order"
                            >
                              <Pencil size={18} />
                            </Button>
                          </>
                        )}

                        {/* ---------------- Cancel ---------------- */}

                        {canCancelOrder && (
                          <>
                            {/* Desktop */}
                            <Button
                              variant="outline-dark"
                              className="rounded-3 px-3 d-none d-xxl-inline-flex"
                              onClick={handleCancelOrder}
                              disabled={cancelLoading}
                            >
                              {cancelLoading ? "Cancelling..." : "Cancel Order"}
                            </Button>

                            {/* Mobile */}
                            <Button
                              variant="light"
                              className="rounded-circle shadow-sm border d-xxl-none d-flex align-items-center justify-content-center"
                              style={{
                                width: "46px",
                                height: "46px",
                                background: "#FFF5F5",
                                color: "#DC3545",
                              }}
                              onClick={handleCancelOrder}
                              disabled={cancelLoading}
                              title="Cancel Order"
                            >
                              <X size={18} />
                            </Button>
                          </>
                        )}

                        {/* ---------------- Pay Bill ---------------- */}

                        <>
                          {/* Desktop */}
                          <Button
                            variant="primary"
                            className="rounded-3 px-3 text-white d-none d-xxl-inline-flex"
                            onClick={() =>
                              router.push(`/orders/payment?id=${id}`)
                            }
                          >
                            Pay Bill
                          </Button>

                          {/* Mobile */}
                          <Button
                            variant="light"
                            className="rounded-circle shadow-sm border d-xxl-none d-flex align-items-center justify-content-center"
                            style={{
                              width: "46px",
                              height: "46px",
                              background: "#EEF6FF",
                              color: "#0D6EFD",
                            }}
                            onClick={() =>
                              router.push(`/orders/payment?id=${id}`)
                            }
                            title="Pay Bill"
                          >
                            <CreditCard size={18} />
                          </Button>
                        </>
                      </>
                    )}
                </div>
              </div>

              {/* ORDER LIST */}
              <Card className="border rounded-4 mb-4 overflow-hidden">
                <Card.Body className="p-3 p-md-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-semibold mb-0">Order List</h5>
                    <div className="text-muted fs-4 lh-1">...</div>
                  </div>
                  <Table responsive borderless className="mb-0">
                    <thead className="border-bottom">
                      <tr className="text-muted small fw-normal">
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Notes</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(order.items || []).map((item) => (
                        <tr
                          key={item.id}
                          className="align-middle border-bottom"
                        >
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="rounded-4 flex-shrink-0 object-fit-cover"
                                style={{ width: "52px", height: "52px" }}
                              />
                              <div>
                                <div className="fw-medium text-dark">
                                  {item.name}
                                </div>
                                <div className="text-muted small">
                                  {item.category || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>{item.qty}</td>
                          <td>
                            <span className="text-muted small">
                              {item.notes || "-"}
                            </span>
                          </td>
                          <td className="fw-medium text-dark">${item.price}</td>
                          <td className="fw-medium text-dark">
                            ${(item.qty * item.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <div className="d-flex justify-content-end align-items-center gap-3 mt-4 pt-2">
                    <span className="text-muted">Total Amount</span>
                    <h4 className="fw-bold mb-0">
                      ${Number(order.subtotal || 0).toFixed(2)}
                    </h4>
                  </div>
                </Card.Body>
              </Card>

              {order.orderType === "Online" && (
                <Row className="g-3">
                  <Col lg={6}>
                    <Card className="border rounded-4 h-100">
                      <Card.Body className="p-3 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <h5 className="fw-semibold mb-0">Customer</h5>
                          <div className="text-muted fs-4 lh-1">...</div>
                        </div>

                        <div className="text-center mb-4">
                          {order.customerImage ? (
                            <img
                              src={order.customerImage}
                              alt={order.customerName}
                              className="rounded-circle mx-auto mb-3 object-fit-cover"
                              style={{ width: "80px", height: "80px" }}
                            />
                          ) : (
                            <div
                              className="bg-warning-subtle rounded-circle mx-auto mb-3"
                              style={{ width: "80px", height: "80px" }}
                            />
                          )}
                          <h6 className="fw-bold mb-0 text-dark">
                            {order.customerName || "Frank Miller"}
                          </h6>
                        </div>

                        <div className="mt-auto">
                          <hr className="border-secondary-subtle mb-4 mt-0" />

                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="text-muted small d-flex align-items-center flex-shrink-0 me-3">
                              <Person size={15} className="me-2" /> Address
                            </div>
                            <div className="small fw-medium text-dark text-end text-truncate">
                              {order.deliveryAddress || "789 Oak Lane"}
                            </div>
                          </div>

                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="text-muted small d-flex align-items-center flex-shrink-0 me-3">
                              <Envelope size={14} className="me-2" /> Email
                            </div>
                            <div className="small fw-medium text-dark text-end text-truncate">
                              {order.customerEmail || "millerfrank@email.com"}
                            </div>
                          </div>

                          <div className="d-flex justify-content-between align-items-center mb-4">
                            <div className="text-muted small d-flex align-items-center flex-shrink-0 me-3">
                              <Telephone size={14} className="me-2" /> Phone
                            </div>
                            <div className="small fw-medium text-dark text-end text-truncate">
                              {order.customerPhone || "(555) 345-7890"}
                            </div>
                          </div>

                          <div className="d-flex gap-3">
                            <Button
                              variant="outline-secondary"
                              className="w-100 rounded-3 py-2 fw-medium border-light-subtle"
                              style={{ fontSize: "13px", color: "#6c757d" }}
                            >
                              Send a Message
                            </Button>
                            <Button
                              variant="primary"
                              className="w-100 rounded-3 text-white py-2 fw-medium"
                              style={{ fontSize: "13px" }}
                            >
                              Make a Call
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* ORDER TRACKING */}
                  <Col lg={6}>
                    <Card className="border rounded-4 h-100">
                      <Card.Body className="p-3">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <h5 className="fw-semibold mb-0">Order Tracking</h5>
                          <div className="text-muted fs-4 lh-1">...</div>
                        </div>
                        <div className="gap-0 d-flex flex-column">
                          {[...trackingSteps]
                            .reverse()
                            .map((track, index, arr) => {
                              const actualIndex = arr.length - 1 - index;
                              const isOutForDeliveryStep = actualIndex === 3;
                              const isDeliveredStep = actualIndex === 4;

                              const displayDate =
                                track.completed && track.date
                                  ? track.date
                                  : "-";
                              const displayTime =
                                track.completed && track.time
                                  ? track.time
                                  : "-";

                              return (
                                <div
                                  key={track.status}
                                  className="d-flex align-items-start mb-2"
                                >
                                  {/* DATE & TIME SECTION */}
                                  <div
                                    className="small flex-shrink-0 pt-1"
                                    style={{ width: "76px" }}
                                  >
                                    <div
                                      className="text-muted"
                                      style={{ fontSize: "12px" }}
                                    >
                                      {displayDate}
                                    </div>
                                    <div
                                      className="text-dark fw-medium"
                                      style={{ fontSize: "13px" }}
                                    >
                                      {displayTime}
                                    </div>
                                  </div>

                                  {/* TIMELINE ICON AND CONNECTOR */}
                                  <div className="d-flex flex-column align-items-center mx-3">
                                    <div
                                      className={`d-flex align-items-center justify-content-center rounded-circle ${track.completed ? "bg-primary text-white" : "bg-white text-primary border border-primary"}`}
                                      style={{
                                        width: "38px",
                                        height: "38px",
                                        zIndex: 2,
                                      }}
                                    >
                                      {track.completed ? (
                                        <Check size={20} />
                                      ) : (
                                        <Person size={18} />
                                      )}
                                    </div>

                                    {index !== arr.length - 1 && (
                                      <div
                                        style={{
                                          width: "2px",
                                          height: "44px",
                                          backgroundColor: track.completed
                                            ? "var(--bs-primary)"
                                            : "transparent",
                                          borderLeft: track.completed
                                            ? "none"
                                            : "2px dashed var(--bs-primary)",
                                          opacity: track.completed ? 1 : 0.6,
                                        }}
                                      />
                                    )}
                                  </div>

                                  {/* DYNAMIC ACTION BUTTONS AND STATUS TEXT */}
                                  <div className="pb-4 pt-1 flex-grow-1">
                                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                      <div
                                        className={
                                          track.completed
                                            ? "fw-bold text-dark"
                                            : "fw-medium text-dark"
                                        }
                                        style={{ fontSize: "14px" }}
                                      >
                                        {track.status}
                                      </div>

                                      {/* 1. OUT FOR DELIVERY ACTION BUTTON */}
                                      {isOutForDeliveryStep &&
                                        !track.completed && (
                                          <Button
                                            size="sm"
                                            variant="primary"
                                            className="text-white rounded-3 px-2 py-1 small"
                                            style={{ fontSize: "11px" }}
                                            disabled={
                                              pickupLoading ||
                                              order.status === "Cancelled"
                                            }
                                            onClick={async () => {
                                              try {
                                                setPickupLoading(true);
                                                await orderService.updateOrderStatus(
                                                  id,
                                                  {
                                                    order_status: "On Process",
                                                    tracking_note:
                                                      "Order is out for delivery",
                                                  },
                                                );
                                                toast.success(
                                                  "Order dispatched successfully!",
                                                );
                                                router.refresh();
                                              } catch (err) {
                                                toast.error(
                                                  err.message ||
                                                  "Failed to update status",
                                                );
                                              } finally {
                                                setPickupLoading(false);
                                              }
                                            }}
                                          >
                                            Dispatch Order
                                          </Button>
                                        )}

                                      {/* 2. DELIVERED ACTION BUTTON */}
                                      {isDeliveredStep && !track.completed && (
                                        <Button
                                          size="sm"
                                          variant={isPaid ? "success" : "light"}
                                          className={`rounded-3 px-2 py-1 small ${isPaid ? "text-white" : "text-muted border"}`}
                                          style={{
                                            fontSize: "11px",
                                            cursor: isPaid
                                              ? "pointer"
                                              : "not-allowed",
                                          }}
                                          disabled={!isPaid || pickupLoading}
                                          onClick={async () => {
                                            try {
                                              setPickupLoading(true);
                                              await orderService.updateOrderStatus(
                                                id,
                                                {
                                                  order_status: "Completed",
                                                  tracking_note:
                                                    "Order delivered successfully",
                                                },
                                              );
                                              toast.success(
                                                "Order marked as Delivered",
                                              );
                                              router.refresh();
                                            } catch (err) {
                                              toast.error(
                                                err.message ||
                                                "Failed to finalize delivery",
                                              );
                                            } finally {
                                              setPickupLoading(false);
                                            }
                                          }}
                                        >
                                          {isPaid
                                            ? "Mark Delivered"
                                            : "Awaiting Payment"}
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}
            </div>
          </Col>

          {/* RIGHT */}
          <Col xl={5} xxl={5}>
            <div className="bg-white p-4 rounded-4">
              {order.orderType !== "Online" && (
                <Card className="border rounded-4">
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="fw-semibold mb-0">Customer Details</h5>
                      <div className="text-muted fs-4 lh-1">...</div>
                    </div>

                    <div className="text-center mb-4">
                      <img
                        src={order.customerImage}
                        alt={order.customerName}
                        className="rounded-circle object-fit-cover mb-3"
                        style={{
                          width: "80px",
                          height: "80px",
                          backgroundColor: "#fff0e6",
                        }}
                      />
                      <h6 className="fw-bold mb-0 text-dark">
                        {order.customerName || "Frank Miller"}
                      </h6>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="text-muted small d-flex align-items-center flex-shrink-0 me-3">
                        <Person size={15} className="me-2" /> Address
                      </div>
                      <div className="small fw-medium text-dark text-end text-truncate">
                        {order.customerAddress || "789 Oak Lane"}
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="text-muted small d-flex align-items-center flex-shrink-0 me-3">
                        <Envelope size={14} className="me-2" /> Email
                      </div>
                      <div className="small fw-medium text-dark text-end text-truncate">
                        {order.customerEmail || "millerfrank@email.com"}
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="text-muted small d-flex align-items-center flex-shrink-0 me-3">
                        <Telephone size={14} className="me-2" /> Phone
                      </div>
                      <div className="small fw-medium text-dark text-end text-truncate">
                        {order.customerPhone || "(555) 345-7890"}
                      </div>
                    </div>

                    {order.orderType === "Dine-In" && (
                      <>
                        <hr />
                        <div className="d-flex justify-content-between mb-2">
                          <div className="text-muted small">Table No:</div>
                          <div className="small fw-medium text-dark">
                            {order.tableNo}
                          </div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="text-muted small">Guest Count:</div>
                          <div className="small fw-medium text-dark">
                            {order.guestCount}
                          </div>
                        </div>
                      </>
                    )}
                    {order.orderType === "Takeaway" && (
                      <>
                        <hr />
                        <div className="d-flex justify-content-between mb-2">
                          <div className="text-muted small">Pickup Code:</div>
                          <div className="small fw-medium text-dark">
                            {order.pickupCode}
                          </div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="text-muted small">Pickup Time:</div>
                          <div className="small fw-medium text-dark">
                            {order.pickupTime}
                          </div>
                        </div>
                      </>
                    )}
                    <hr />

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <span className="text-muted small">Payment Status</span>

                      <Badge
                        bg={isPaid ? "primary" : "danger"}
                        className="px-3 py-2"
                      >
                        {isPaid ? "Paid" : "Unpaid"}
                      </Badge>
                    </div>

                    {order.orderType === "Takeaway" &&
                      order.status !== "Completed" && (
                        <Button
                          variant="success"
                          className="w-100 rounded-3"
                          onClick={handlePickup}
                          disabled={
                            pickupLoading ||
                            !isPaid
                          }
                        >
                          {pickupLoading
                            ? "Processing..."
                            : !isPaid
                              ? "Payment Required"
                              : "Pickup Order"}
                        </Button>
                      )}
                  </Card.Body>
                </Card>
              )}

              {/* ORDER Map */}
              {order.orderType === "Online" && (
                <>
                  <Card className="border rounded-4 mb-4">
                    <Card.Body className="p-0 overflow-hidden rounded-4">
                      <div
                        className="position-relative"
                        style={{ height: "684px", backgroundColor: "#f8f9fa" }}
                      >
                        <iframe
                          width="100%"
                          height="100%"
                          style={{
                            border: 0,
                            pointerEvents: "auto",
                            position: "relative",
                            zIndex: 1,
                          }}
                          loading="lazy"
                          allowFullScreen
                          src={mapEmbedUrl}
                        ></iframe>

                        <div
                          className="position-absolute shadow-sm rounded-3 bg-white d-flex align-items-center justify-content-center"
                          style={{
                            top: "20px",
                            right: "20px",
                            width: "32px",
                            height: "32px",
                            cursor: "pointer",
                            zIndex: 10,
                          }}
                          onClick={() =>
                            window.open(
                              `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(order.restaurantAddress || "")}&destination=${encodeURIComponent(order.deliveryAddress || "")}`,
                              "_blank",
                            )
                          }
                        >
                          <ArrowsAngleExpand size={14} className="text-muted" />
                        </div>

                        <div
                          className="position-absolute d-flex flex-column gap-2"
                          style={{
                            top: "40%",
                            right: "20px",
                            transform: "translateY(-50%)",
                            zIndex: 10,
                          }}
                        >
                          <div className="bg-white rounded-3 shadow-sm d-flex flex-column overflow-hidden">
                            <div
                              className="d-flex align-items-center justify-content-center border-bottom text-muted zoom-btn"
                              style={{
                                width: "32px",
                                height: "32px",
                                cursor: "pointer",
                                userSelect: "none",
                              }}
                              onClick={() =>
                                setZoom((prev) => Math.min(prev + 1, 21))
                              }
                            >
                              <Plus size={18} className="fw-bold text-dark" />
                            </div>
                            <div
                              className="d-flex align-items-center justify-content-center text-muted zoom-btn"
                              style={{
                                width: "32px",
                                height: "32px",
                                cursor: "pointer",
                                userSelect: "none",
                              }}
                              onClick={() =>
                                setZoom((prev) => Math.max(prev - 1, 1))
                              }
                            >
                              <Dash size={18} className="fw-bold text-dark" />
                            </div>
                          </div>

                          <div
                            className="bg-white rounded-3 shadow-sm d-flex align-items-center justify-content-center text-muted mt-1"
                            style={{
                              width: "32px",
                              height: "32px",
                              cursor: "pointer",
                            }}
                            onClick={() => setZoom(14)}
                          >
                            <Crosshair size={14} className="text-dark" />
                          </div>
                        </div>

                        <div
                          className="position-absolute bottom-0 start-50 translate-middle-x bg-white shadow-sm mb-4 rounded-4"
                          style={{
                            width: "92%",
                            maxWidth: "550px",
                            zIndex: 10,
                            padding: "20px",
                          }}
                        >
                          {/* Top Row: Flex Aligned */}
                          <div className="d-flex justify-content-between align-items-center mb-4">
                            <div
                              className="text-start"
                              style={{
                                flex: "1 1 0",
                                minWidth: 0,
                                paddingRight: "10px",
                              }}
                            >
                              <div
                                className="text-dark text-truncate fw-semibold mb-1"
                                style={{ fontSize: "15px" }}
                              >
                                {order.restaurantName || "Bella Italia"}
                              </div>
                              <div
                                className="text-muted d-flex align-items-center text-truncate"
                                style={{ fontSize: "13px" }}
                              >
                                <GeoAlt
                                  size={12}
                                  className="me-1 flex-shrink-0"
                                />
                                <span className="text-truncate">
                                  {order.restaurantAddress || "456 Olive St."}
                                </span>
                              </div>
                            </div>

                            <div className="text-center px-2 flex-shrink-0">
                              <div
                                className="text-dark fw-medium"
                                style={{
                                  fontSize: "12px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {order.distance || "4.5 miles — 30 min"}
                              </div>
                            </div>

                            <div
                              className="text-end"
                              style={{
                                flex: "1 1 0",
                                minWidth: 0,
                                paddingLeft: "10px",
                              }}
                            >
                              <div
                                className="text-dark text-truncate fw-semibold mb-1"
                                style={{ fontSize: "15px" }}
                              >
                                {order.customerName || "Frank Miller"}
                              </div>
                              <div
                                className="text-muted d-flex align-items-center justify-content-end text-truncate"
                                style={{ fontSize: "13px" }}
                              >
                                <GeoAlt
                                  size={12}
                                  className="me-1 flex-shrink-0"
                                />
                                <span className="text-truncate">
                                  {order.deliveryAddress || "789 Oak Lane"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Middle Row */}
                          <div className="d-flex align-items-center mb-4">
                            <div
                              className="rounded-circle border border-2 border-primary bg-white d-flex align-items-center justify-content-center flex-shrink-0 text-primary"
                              style={{
                                width: "32px",
                                height: "32px",
                                zIndex: 2,
                              }}
                            >
                              <PiBowlSteam size={16} />
                            </div>

                            <div
                              className="bg-primary flex-grow-1"
                              style={{
                                height: "3px",
                                margin: "0 -2px",
                                zIndex: 1,
                              }}
                            ></div>

                            <div
                              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm"
                              style={{
                                width: "24px",
                                height: "24px",
                                zIndex: 3,
                              }}
                            >
                              <span style={{ fontSize: "12px" }}>📦</span>
                            </div>

                            <div
                              className="flex-grow-1 bg-secondary-subtle"
                              style={{
                                height: "2px",
                                margin: "0 -2px",
                                zIndex: 1,
                              }}
                            ></div>

                            <div
                              className="rounded-circle border border-2 bg-white d-flex align-items-center justify-content-center flex-shrink-0"
                              style={{
                                width: "32px",
                                height: "32px",
                                borderColor: "#f1f1f1",
                                color: "#f1f1f1",
                                zIndex: 2,
                              }}
                            >
                              <GeoAlt
                                size={16}
                                className="text-primary"
                                style={{ opacity: 0.5 }}
                              />
                            </div>
                          </div>

                          {/* Bottom Row */}
                          <div className="d-flex justify-content-between">
                            <div className="text-start">
                              <div
                                className="text-muted mb-1"
                                style={{ fontSize: "12px", fontWeight: "400" }}
                              >
                                Delivery Time
                              </div>
                              <div style={{ fontSize: "14px" }}>
                                <span className="fw-bold text-dark">
                                  {order.deliveryDateTime?.time || "11:00 AM"}
                                </span>
                                <span
                                  className="text-muted ms-1"
                                  style={{ fontSize: "13px" }}
                                >
                                  {order.deliveryDateTime?.date
                                    ? `, ${order.deliveryDateTime.date}`
                                    : ", Oct 22, 2035"}
                                </span>
                              </div>
                            </div>

                            <div className="text-end">
                              <div
                                className="text-muted mb-1"
                                style={{ fontSize: "12px", fontWeight: "400" }}
                              >
                                Estimated Arrival Time
                              </div>
                              <div style={{ fontSize: "14px" }}>
                                <span className="fw-bold text-dark">
                                  {order.estimatedArrivalDateTimeParts?.time ||
                                    "11:30 AM"}
                                </span>
                                <span
                                  className="text-muted ms-1"
                                  style={{ fontSize: "13px" }}
                                >
                                  {order.estimatedArrivalDateTimeParts?.date
                                    ? `, ${order.estimatedArrivalDateTimeParts.date}`
                                    : ", Oct 22, 2035"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>

                  {/* DRIVER INFO SECTION */}
                  <Card className="border rounded-4">
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="fw-semibold mb-0">Driver</h5>
                        <div className="text-muted fs-4 lh-1">...</div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center gap-3">
                          {driverImage ? (
                            <img
                              src={driverImage}
                              alt={driverName}
                              className="rounded-circle object-fit-cover flex-shrink-0"
                              style={{ width: "64px", height: "64px" }}
                            />
                          ) : (
                            <div
                              className="rounded-circle bg-warning-subtle flex-shrink-0"
                              style={{ width: "64px", height: "64px" }}
                            />
                          )}
                          <div>
                            <h5 className="fw-semibold mb-1 text-dark">
                              {driverName}
                            </h5>
                            <div className="small text-muted d-flex align-items-center gap-1">
                              <span
                                className="rounded-circle bg-primary d-inline-block"
                                style={{ width: "7px", height: "7px" }}
                              />
                              {driverStatus}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <Button
                            type="button"
                            variant="light"
                            className="rounded-4 d-flex align-items-center justify-content-center"
                            style={{
                              width: "48px",
                              height: "48px",
                              backgroundColor: "#FFF0E6",
                            }}
                          >
                            <ChatDots size={20} className="text-dark" />
                          </Button>
                          <Button
                            type="button"
                            variant="light"
                            className="rounded-4 d-flex align-items-center justify-content-center"
                            style={{
                              width: "48px",
                              height: "48px",
                              backgroundColor: "#FFF0E6",
                            }}
                            onClick={() => {
                              if (
                                driverPhone &&
                                driverPhone !== "(555) 345-7890"
                              ) {
                                window.location.href = `tel:${driverPhone}`;
                              }
                            }}
                          >
                            <Telephone size={20} className="text-dark" />
                          </Button>
                        </div>
                      </div>
                      <hr />
                      <Row className="g-3">
                        <Col xs={4}>
                          <div className="text-muted small mb-1">Phone</div>
                          <div className="fw-medium text-dark text-truncate">
                            {driverPhone}
                          </div>
                        </Col>
                        <Col xs={4}>
                          <div className="text-muted small mb-1">
                            Vehicle Type
                          </div>
                          <div className="fw-medium text-dark text-truncate">
                            {vehicleType}
                          </div>
                        </Col>
                        <Col xs={4}>
                          <div className="text-muted small mb-1">
                            Vehicle Number
                          </div>
                          <div className="fw-medium text-dark text-truncate">
                            {vehicleNumber}
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={<div>Loading order details...</div>}>
      <OrderDetailsContent />
    </Suspense>
  );
}
