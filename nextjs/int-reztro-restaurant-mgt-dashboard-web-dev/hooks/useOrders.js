"use client";

import { useEffect, useState } from "react";
import { orderService } from "@/services/orderService";

export function useOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getResponseData = (response) => {
        return (
            response?.data?.orders ||
            response?.data?.data ||
            response?.data?.items ||
            response?.data ||
            response?.orders ||
            response?.result ||
            response?.results ||
            response ||
            []
        );
    };

    const fetchOrderItems = async (orderId) => {
        try {
            if (!orderId || !orderService.getOrderItemsByOrderId) return [];

            const itemsResponse = await orderService.getOrderItemsByOrderId(orderId);

            const itemsData = getResponseData(itemsResponse);

            return Array.isArray(itemsData) ? itemsData : [];
        } catch (error) {
            console.log(error?.message || "Failed to fetch order items");
            return [];
        }
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await orderService.getOrders();

            const orderList = getResponseData(response);

            const ordersWithItems = Array.isArray(orderList)
                ? await Promise.all(
                    orderList.map(async (order) => {
                        const orderId = order.order_id || order.id;

                        const alreadyItems =
                            order.items ||
                            order.order_items ||
                            order.orderItems ||
                            [];

                        if (Array.isArray(alreadyItems) && alreadyItems.length > 0) {
                            return {
                                ...order,
                                items: alreadyItems,
                            };
                        }

                        const items = await fetchOrderItems(orderId);

                        return {
                            ...order,
                            items,
                        };
                    })
                )
                : [];

            const mappedOrders = Array.isArray(ordersWithItems)
                ? ordersWithItems.map((order) => {
                    const firstItem =
                        order.items?.[0] ||
                        order.order_items?.[0] ||
                        order.orderItems?.[0] ||
                        order;

                    return {
                        id: order.order_id || order.id,

                        orderId:
                            order.order_no ||
                            order.order_number ||
                            `#ORD-${order.order_id || order.id}`,

                        date: order.order_date
                            ? new Date(order.order_date + "Z").toLocaleDateString("en-CA", {
                                timeZone: "Asia/Kolkata",
                            })
                            : "-",

                        time: order.order_date
                            ? new Date(order.order_date + "Z")
                                .toLocaleTimeString("en-IN", {
                                    timeZone: "Asia/Kolkata",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                })
                                .toUpperCase()
                            : "-",

                        customer:
                            order.customer_name ||
                            order.full_name ||
                            order.customer?.full_name ||
                            "-",

                        orderType:
                            order.order_type ||
                            order.orderType ||
                            "Dine-In",

                        tableNo:
                            order.table_no ||
                            order.tableNo ||
                            order.table_number ||
                            order.table ||
                            order.dining_table ||
                            order.table_name ||
                            null,

                        guestCount:
                            order.guest_count ||
                            order.guestCount ||
                            null,

                        address:
                            order.delivery_address ||
                            order.customer_address ||
                            order.address ||
                            "-",

                        qty:
                            Array.isArray(order.items) && order.items.length > 0
                                ? order.items.reduce(
                                    (sum, item) => sum + Number(item.quantity || item.qty || 0),
                                    0
                                )
                                : order.total_qty ||
                                order.qty ||
                                order.quantity ||
                                firstItem?.quantity ||
                                0,

                        amount:
                            (order.order_status || order.status) === "Completed"
                                ? order.total_amount || order.amount || 0
                                : order.subtotal || order.total_amount || order.amount || 0,

                        subtotal:
                            order.subtotal ||
                            order.sub_total ||
                            order.order_subtotal ||
                            0,

                        status:
                            order.order_status ||
                            order.status ||
                            "On Process",

                        menu:
                            firstItem?.menu_name ||
                            firstItem?.name ||
                            firstItem?.item_name ||
                            order.menu_name ||
                            order.name ||
                            "N/A",

                        category:
                            firstItem?.category_name ||
                            firstItem?.category ||
                            firstItem?.menu_category ||
                            order.category_name ||
                            order.category ||
                            order.menu_category ||
                            "N/A",

                        image:
                            firstItem?.image_url ||
                            firstItem?.menu_image ||
                            firstItem?.item_image ||
                            order.image_url ||
                            order.menu_image ||
                            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",

                        items: order.items || [],

                        rawDate: order.order_date || order.created_at || null,
                    };
                })
                : [];

            setOrders(mappedOrders);
        } catch (error) {
            setError(error.message || "Failed to fetch orders");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return {
        orders,
        loading,
        error,
        refetchOrders: fetchOrders,
    };
}