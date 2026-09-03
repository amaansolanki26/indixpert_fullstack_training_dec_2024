"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Alert,
    Badge,
    Button,
    Card,
    Col,
    Container,
    Form,
    Row,
    Spinner,
} from "react-bootstrap";
import { ArrowLeft, CreditCard } from "lucide-react";
import { useOrderDetails } from "@/hooks/useOrderDetails";
import { paymentService } from "@/services/paymentService";
import { orderService } from "@/services/orderService";
import { menuService } from "@/services/menuService";

function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const id = searchParams.get("id");

    const { order, loading, error } = useOrderDetails(id);

    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [transactionId, setTransactionId] = useState("");
    const [promoCode, setPromoCode] = useState("");
    const [pageError, setPageError] = useState("");
    const [payLoading, setPayLoading] = useState(false);
    const [promotions, setPromotions] = useState([]);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const paymentStatus =
        order?.payment?.status || "Pending";
    const subtotal = Number(order?.subtotal || order?.totalAmount || 0);

    const [discountAmount, setDiscountAmount] = useState(
        Number(order?.discount_amount || 0)
    );
    useEffect(() => {
        if (order) {
            setDiscountAmount(Number(order.discount_amount || 0));
        }
    }, [order]);

    const taxAmount = useMemo(() => {
        return Number((subtotal * 0.05).toFixed(2));
    }, [subtotal]);

    const totalAmount = useMemo(() => {
        return Number((subtotal + taxAmount - discountAmount).toFixed(2));
    }, [subtotal, taxAmount, discountAmount]);

    useEffect(() => {
        loadPromotions();
    }, []);

    const loadPromotions = async () => {
        try {
            const response = await menuService.getPromotions();

            const data =
                response?.data?.data ||
                response?.data ||
                [];

            const today = new Date();

            const active = data.filter((promo) => {

                if (!promo.is_active)
                    return false;

                if (
                    promo.start_date &&
                    new Date(promo.start_date) > today
                )
                    return false;

                if (
                    promo.end_date &&
                    new Date(promo.end_date) < today
                )
                    return false;

                return true;
            });

            setPromotions(active);

        } catch (err) {
            console.log(err);
        }
    };

    const handleApplyPromo = () => {
        if (paymentStatus === "Paid") {
            return;
        }

        setPageError("");

        const code = promoCode.trim().toUpperCase();

        if (!code) {
            setDiscountAmount(0);
            setSelectedPromotion(null);
            return;
        }

        const promo = promotions.find(
            (item) =>
                item.promotion_code?.toUpperCase() === code
        );

        if (!promo) {
            setDiscountAmount(0);
            setSelectedPromotion(null);
            setPageError("Invalid Promo Code");
            return;
        }

        if (
            promo.min_order_amount &&
            subtotal < Number(promo.min_order_amount)
        ) {
            setDiscountAmount(0);

            setPageError(
                `Minimum order amount should be $${promo.min_order_amount}`
            );

            return;
        }

        let discount = 0;

        if (promo.discount_type === "Percentage") {

            discount =
                subtotal *
                Number(promo.discount_value) /
                100;

            if (
                promo.max_discount_amount &&
                discount >
                Number(promo.max_discount_amount)
            ) {
                discount = Number(
                    promo.max_discount_amount
                );
            }

        } else if (
            promo.discount_type === "Flat"
        ) {

            discount = Number(
                promo.discount_value
            );

        }

        setDiscountAmount(
            Number(discount.toFixed(2))
        );

        setSelectedPromotion(promo);
    };

    const handlePayNow = async () => {
        if (paymentStatus === "Paid") {
            setPageError("This bill has already been paid.");
            return;
        }
        try {
            setPayLoading(true);
            setPageError("");

            const paymentResponse =
                await paymentService.getPaymentByOrderId(id);

            const paymentData =
                paymentResponse?.data?.data ||
                paymentResponse?.data ||
                paymentResponse;

            const paymentId =
                paymentData?.payment_id ||
                paymentData?.PaymentID ||
                paymentData?.id;

            if (!paymentId) {
                throw new Error("Payment ID not found");
            }

            await paymentService.updatePaymentById(paymentId, {
                payment_method: paymentMethod,
                payment_status: "Paid",
                transaction_id: transactionId || null,
            });

            await orderService.updateOrder(id, {
                customer_id: order.customer_id,

                order_type: order.orderType,

                order_status:
                    order.orderType === "Dine-In"
                        ? "Completed"
                        : "On Process",

                subtotal: subtotal,

                tax_amount: taxAmount,

                discount_amount: discountAmount,

                total_amount: totalAmount,

                items: order.items,

                payment: {
                    payment_method: paymentMethod,
                    payment_status: "Paid",
                    transaction_id: transactionId || null,
                }
            });

            router.refresh()
            router.push(`/orders/orderdetails?id=${id}`);
        } catch (error) {
            setPageError(
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.message ||
                "Payment failed"
            );
        } finally {
            setPayLoading(false);
        }
    };

    if (!id) return <div>Order id not found</div>;
    if (loading) return <div>Loading payment...</div>;
    if (error) return <div>{error}</div>;
    if (!order) return <div>Order not found</div>;

    return (
        <div className="bg-dashboard py-4 min-vh-100">
            <Container fluid>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Button
                        type="button"
                        variant="light"
                        className="rounded-3 border"
                        onClick={() => router.push("/orders")}
                    >
                        <ArrowLeft size={16} className="me-2" />
                        Back to Orders
                    </Button>
                </div>

                {pageError && (
                    <Alert variant="danger" className="rounded-4">
                        {pageError}
                    </Alert>
                )}

                <Row className="justify-content-center">
                    <Col xl={7} lg={9}>
                        <Card className="border-0 rounded-4 shadow-sm">
                            <Card.Body className="p-4">
                                <div className="d-flex justify-content-between align-items-start mb-4">
                                    <div>
                                        <h4 className="fw-bold mb-1">
                                            Payment Bill
                                        </h4>

                                        <p className="text-muted mb-0">
                                            Order #{order.orderId}
                                        </p>
                                    </div>

                                    <Badge
                                        bg={
                                            paymentStatus === "Paid"
                                                ? "primary"
                                                : "warning"
                                        }
                                        text={
                                            paymentStatus === "Paid"
                                                ? "white"
                                                : "dark"
                                        }
                                        className="rounded-pill px-3 py-2"
                                    >
                                        {paymentStatus}
                                    </Badge>
                                </div>

                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Subtotal</span>
                                    <strong>${subtotal.toFixed(2)}</strong>
                                </div>

                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Tax 5%</span>
                                    <strong>${taxAmount.toFixed(2)}</strong>
                                </div>

                                <Row className="g-2 align-items-end mb-3">
                                    <Col md={8}>
                                        <Form.Label>Promo Code</Form.Label>
                                        <Form.Control
                                            placeholder="SAVE10 / FLAT5"
                                            value={promoCode}
                                            disabled={paymentStatus === "Paid"}
                                            onChange={(e) =>
                                                setPromoCode(e.target.value)
                                            }
                                        />
                                    </Col>

                                    <Col md={4}>
                                        <Button
                                            type="button"
                                            variant="primary"
                                            className="w-100 rounded-3 text-white"
                                            onClick={handleApplyPromo}
                                            disabled={paymentStatus === "Paid"}
                                        >
                                            Apply
                                        </Button>
                                    </Col>
                                    {promotions.length > 0 && (
                                        <div className="mt-3">

                                            <div className="fw-semibold small mb-2">
                                                Available Offers
                                            </div>

                                            <div className="d-flex flex-wrap gap-2">

                                                {promotions.map((promo) => (

                                                    <Badge
                                                        key={promo.promotion_id}
                                                        bg={paymentStatus === "Paid" ? "secondary" : "primary"}
                                                        style={{
                                                            cursor:
                                                                paymentStatus === "Paid"
                                                                    ? "not-allowed"
                                                                    : "pointer",
                                                            opacity:
                                                                paymentStatus === "Paid"
                                                                    ? 0.6
                                                                    : 1,
                                                        }}
                                                        onClick={() => {
                                                            if (paymentStatus === "Paid") return;

                                                            setPromoCode(promo.promotion_code);
                                                        }}
                                                    >
                                                        {promo.promotion_code}
                                                    </Badge>

                                                ))}

                                            </div>

                                        </div>
                                    )}
                                </Row>

                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Discount</span>
                                    <strong className="text-success">
                                        - ${discountAmount.toFixed(2)}
                                    </strong>
                                </div>

                                <hr />

                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="fw-bold mb-0">
                                        Total Amount
                                    </h5>

                                    <h2 className="fw-bold text-primary mb-0">
                                        ${totalAmount.toFixed(2)}
                                    </h2>
                                </div>

                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Label>Payment Method</Form.Label>

                                        <Form.Select
                                            value={paymentMethod}
                                            onChange={(e) =>
                                                setPaymentMethod(e.target.value)
                                            }
                                        >
                                            <option value="Cash">Cash</option>
                                            <option value="Card">Card</option>
                                            <option value="UPI">UPI</option>
                                            <option value="Online">Online</option>
                                        </Form.Select>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Label>
                                            Transaction ID Optional
                                        </Form.Label>

                                        <Form.Control
                                            placeholder="Enter transaction id"
                                            value={transactionId}
                                            onChange={(e) =>
                                                setTransactionId(e.target.value)
                                            }
                                        />
                                    </Col>
                                </Row>

                                <Button
                                    type="button"
                                    variant="primary"
                                    className="w-100 rounded-3 text-white mt-4 py-2"
                                    disabled={
                                        payLoading ||
                                        paymentStatus === "Paid"
                                    }
                                    onClick={handlePayNow}
                                >
                                    {paymentStatus === "Paid" ? (
                                        <>
                                            Payment Completed
                                        </>
                                    ) : payLoading ? (
                                        <>
                                            <Spinner
                                                animation="border"
                                                size="sm"
                                                className="me-2"
                                            />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard
                                                size={18}
                                                className="me-2"
                                            />
                                            Pay Now
                                        </>
                                    )}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div>Loading payment...</div>}>
            <PaymentContent />
        </Suspense>
    );
}