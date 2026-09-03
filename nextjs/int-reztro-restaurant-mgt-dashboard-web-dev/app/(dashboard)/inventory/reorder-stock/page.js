"use client";

import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { inventoryService } from "@/services/inventoryService";

export default function ReorderStockPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const inventoryId = params.get("id");

        setId(inventoryId);
    }, []);

    useEffect(() => {
        if (!id) return;

        const fetchItem = async () => {
            try {
                const response = await inventoryService.getInventoryItemById(id);
                const item = response?.data?.item || response?.data || {};

                const displayCategory =
                    typeof item.category === "object"
                        ? (item.category?.category_name || item.category?.name)
                        : (
                            item.category_name ||
                            item.category ||
                            item.item_category ||
                            item.itemCategory ||
                            ""
                        );

                reset({
                    item_name: item.item_name || item.itemName,
                    category: displayCategory,
                    current_stock:
                        item.qty_in_stock !== undefined
                            ? item.qty_in_stock
                            : item.qtyInStock,
                });
            } catch (error) {
                toast.error("Failed to load item details");
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id, reset]);

    const submitHandler = async (data) => {
        try {

            const payload = {
                inventory_id: Number(id),
                movement_type: "Stock In",
                quantity: Number(data.quantity),
                note: data.note?.trim() || "Reordered from dashboard",
            };


            await inventoryService.addStockMovement(payload);

            toast.success("Stock reordered successfully!");
            router.push("/inventory");
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to process reorder"
            );
        }
    };

    if (loading || !id) {
        return (
            <div className="text-center p-5">
                <Spinner />
            </div>
        );
    }

    const readOnlyStyle = {
        backgroundColor: "#f0f2f5",
        color: "#6c757d",
        cursor: "not-allowed",
    };

    return (
        <Card className="border-0">
            <Card.Body>
                <Form onSubmit={handleSubmit(submitHandler)}>
                    <Row>
                        {/* ITEM NAME */}
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Item Name</Form.Label>
                                <Form.Control
                                    readOnly
                                    style={readOnlyStyle}
                                    {...register("item_name")}
                                />
                            </Form.Group>
                        </Col>

                        {/* CATEGORY */}
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    readOnly
                                    style={readOnlyStyle}
                                    {...register("category")}
                                />
                            </Form.Group>
                        </Col>

                        {/* CURRENT STOCK (Just for user reference) */}
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Current Stock</Form.Label>
                                <Form.Control
                                    readOnly
                                    style={readOnlyStyle}
                                    {...register("current_stock")}
                                />
                            </Form.Group>
                        </Col>

                        {/* REORDER QUANTITY */}
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Reorder Quantity <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter quantity to add"
                                    {...register("quantity", {
                                        required: "Please enter reorder quantity",
                                        min: { value: 1, message: "Quantity must be at least 1" },
                                    })}
                                />
                                <small className="text-danger">
                                    {errors?.quantity?.message}
                                </small>
                            </Form.Group>
                        </Col>

                        {/* NOTE */}
                        <Col md={12}>
                            <Form.Group className="mb-4">
                                <Form.Label>Note (Optional)</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="e.g. Weekly restock"
                                    {...register("note")}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex gap-2">
                        <Button type="submit">
                            Confirm Reorder
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => router.push("/inventory")}
                        >
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
}