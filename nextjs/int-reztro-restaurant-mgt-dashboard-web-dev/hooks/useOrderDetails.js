"use client";

import { useEffect, useState } from "react";
import { orderService } from "@/services/orderService";

function orderDetailsAdapter(data) {

    const formatDateTimeParts = (value) => {
        if (!value) {
            return {
                time: "-",
                date: "-",
                full: "-",
            };
        }

        const dateValue = new Date(value + "Z");

        const time = dateValue.toLocaleTimeString("en-US", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

        const date = dateValue.toLocaleDateString("en-US", {
            timeZone: "Asia/Kolkata",
            month: "short",
            day: "2-digit",
            year: "numeric",
        });

        return {
            time,
            date,
            full: `${time}, ${date}`,
        };
    };

    return {
        id: data.order_id,
        orderId: data.order_no,
        orderType: data.order_type,
        status: data.order_status || data.status || "On Process",

        subtotal: Number(data.subtotal || 0),
        totalAmount: Number(data.subtotal || data.total_amount || 0),

        customer_id: data.customer_id || data.customerId || data.customer?.customer_id || null,
        customerName: data.customer_name,
        customerAddress:
            data.customer_address ||
            data.customerAddress ||
            data.address ||
            data.customer?.address ||

            data.customer?.customer_address ||
            data.delivery_address ||
            data.online_details?.delivery_address ||
            "N/A",
        customerEmail: data.customer_email || data.email || "N/A",
        customerPhone: data.customer_phone || data.phone || "N/A",
        customerImage: data.customer_image || data.profile_image_url || null,

        items: (data.items || []).map((item) => ({
            order_item_id: item.order_item_id || item.id,
            id: item.order_item_id || item.id,
            menu_id: item.menu_id || item.menuId,
            name: item.menu_name || item.name || "N/A",
            category:
                item.category_name ||
                item.category ||
                item.menu_category ||
                "Other",
            image:
                item.image_url ||
                item.image ||
                "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
            qty: item.quantity || item.qty || 0,
            price: Number(item.price || 0),
            total: Number(item.total_price || item.total || 0),
            notes: item.notes || "",
        })),

        tracking: (data.tracking || []).map((item) => ({
            id: item.tracking_id,
            status: item.tracking_status,
            message: item.tracking_message,
            date: item.created_at
                ? new Date(item.created_at + "Z").toLocaleDateString("en-US", {
                    timeZone: "Asia/Kolkata",
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                })
                : "-",
            time: item.created_at
                ? new Date(item.created_at + "Z")
                    .toLocaleTimeString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                    })
                    .toUpperCase()
                : "-",
            sortOrder: item.sort_order || 0,
        })),

        deliveryDateTime: formatDateTimeParts(
            data.updated_at || data.delivery_time || data.order_date || data.created_at
        ),

        estimatedArrivalDateTimeParts: formatDateTimeParts(
            data.estimated_arrival_time
        ),

        restaurantAddress:
            data.restaurant_address ||
            data.online_details?.restaurant_address ||
            "Reztro Restaurant, Jodhpur, Rajasthan, India",

        deliveryAddress:
            data.delivery_address ||
            data.online_details?.delivery_address ||
            data.customer_address ||
            data.address ||
            "N/A",

        pickupTime: data.pickup_time || "-",
        pickupCode: data.pickup_code || "-",

        tableNo: data.table_no || "-",
        guestCount: data.guest_count || "-",

        driverId: data.driver_id || null,
        driverName: data.driver_name || "Driver Not Assigned",
        driverPhone: data.driver_phone || "-",
        vehicleType: data.vehicle_type || "-",
        vehicleNumber: data.vehicle_number || "-",
        driverStatus: data.driver_status || "Online",

        payment: {
            id: data.payment_id || null,
            method: data.payment_method || "N/A",
            status: data.payment_status || "Unpaid",
            paidAmount: Number(data.paid_amount || 0),
        },
    };
}

export function useOrderDetails(id) {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await orderService.getOrderDetails(id);
                const itemsResponse = await orderService.getOrderItemsByOrderId(id);

                const orderData =
                    response?.data?.data ||
                    response?.data ||
                    response ||
                    null;

                let trackingData = [];

                if (orderData?.order_type === "Online") {
                    try {
                        const trackingResponse = await orderService.getOrderTracking(id);

                        trackingData =
                            trackingResponse?.data?.data ||
                            trackingResponse?.data ||
                            trackingResponse ||
                            [];
                    } catch (error) {
                        trackingData = [];
                    }
                }

                const itemsData =
                    itemsResponse?.data?.data ||
                    itemsResponse?.data?.items ||
                    itemsResponse?.data ||
                    [];


                const formattedOrder = orderData
                    ? orderDetailsAdapter({
                        ...orderData,
                        items: Array.isArray(itemsData) ? itemsData : [],
                        tracking: Array.isArray(trackingData) ? trackingData : [],
                    })
                    : null;

                setOrder(formattedOrder);
            } catch (err) {
                setError(err.message || "Failed to fetch order details");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id]);

    return {
        order,
        loading,
        error,
    };
}