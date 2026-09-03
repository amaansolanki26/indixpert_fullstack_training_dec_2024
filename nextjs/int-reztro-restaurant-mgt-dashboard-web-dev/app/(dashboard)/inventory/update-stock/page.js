"use client";

import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { inventoryService } from "@/services/inventoryService";

export default function UpdateStockPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setId(params.get("id"));
  }, []);

  const currentStock = Number(watch("qty_in_stock") || 0);
  const reorderLevel = Number(watch("qty_in_reorder") || 0);


  const stockStatus =
    currentStock <= 0
      ? "Out of Stock"
      : currentStock <= reorderLevel
        ? "Low Stock"
        : "Available";

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await inventoryService.getInventoryItemById(id);

        const item = response?.data?.item || response?.data || {};

        // Category handles both string and object formats safely
        const displayCategory =
          typeof item.category === "object"
            ? item.category?.category_name || item.category?.name
            : item.category_name ||
            item.category ||
            item.item_category ||
            item.itemCategory ||
            "";

        reset({
          item_name: item.item_name || item.itemName,
          category: displayCategory,
          qty_in_stock:
            item.qty_in_stock !== undefined
              ? item.qty_in_stock
              : item.qtyInStock,
          qty_in_reorder:
            item.qty_in_reorder !== undefined
              ? item.qty_in_reorder
              : item.qtyInReorder,
        });
      } catch (error) {
        toast.error("Failed to load item");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    } else {
      setLoading(false);
    }
  }, [id, reset]);

  const submitHandler = async (data) => {
    try {
      // PATCH API method for partial stock updates
      await inventoryService.updateInventoryStock(id, {
        qty_in_stock: Number(data.qty_in_stock),
        qty_in_reorder: Number(data.qty_in_reorder),
      });

      toast.success("Stock updated successfully");

      router.push("/inventory");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update stock");
    }
  };

  if (loading || !id) {
    return (
      <div className="text-center p-5">
        <Spinner />
      </div>
    );
  }

  // Common style object for readOnly fields to look clean and distinct
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
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Item Name</Form.Label>

                <Form.Control
                  readOnly
                  style={readOnlyStyle} // Added readOnly background style
                  {...register("item_name")}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>

                <Form.Control
                  readOnly
                  style={readOnlyStyle} // Added readOnly background style
                  {...register("category")}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Current Stock</Form.Label>

                <Form.Control
                  type="number"
                  {...register("qty_in_stock", {
                    required: "Stock is required",
                    min: 0,
                  })}
                />

                <small className="text-danger">
                  {errors?.qty_in_stock?.message}
                </small>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Reorder Level</Form.Label>

                <Form.Control
                  type="number"
                  {...register("qty_in_reorder", {
                    required: "Reorder quantity is required",
                    min: 1,
                  })}
                />

                <small className="text-danger">
                  {errors?.qty_in_reorder?.message}
                </small>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Label>Stock Status</Form.Label>

                <Form.Control
                  value={stockStatus}
                  readOnly
                  style={readOnlyStyle} // Added readOnly background style
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-2">
            <Button type="submit">Update Stock</Button>

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
