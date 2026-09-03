"use client";

import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { inventoryService } from "@/services/inventoryService";

const UNIT_OPTIONS = ["kg", "g", "ltr", "ml", "pcs", "box", "packet"];

export default function EditInventoryItemPage() {
  const [id, setId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [itemData, setItemData] = useState(null);

  const router = useRouter();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setId(params.get("id"));
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  // 1. Data Fetching (Categories & Item Details)
  useEffect(() => {
    if (id === null) return;

    const fetchData = async () => {
      try {
        const catRes = await inventoryService.getCategories();

        const catList =
          catRes?.data?.categories ||
          catRes?.data ||
          [];

        setCategories(Array.isArray(catList) ? catList : []);

        const response =
          await inventoryService.getInventoryItemById(id);

        const item =
          response?.data?.item ||
          response?.data ||
          {};

        setItemData(item);
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 2. Form Reset Logic
  useEffect(() => {
    if (itemData && categories.length > 0) {
      let catId =
        itemData.category?.inventory_category_id ||
        itemData.category_id ||
        itemData.category?.id;

      if (!catId) {
        const categoryName =
          typeof itemData.category === "string"
            ? itemData.category
            : itemData.category_name || itemData.item_category || "";

        if (categoryName) {
          const matchedCat = categories.find(
            (c) =>
              String(c.category_name || c.name).toLowerCase() ===
              String(categoryName).toLowerCase(),
          );
          if (matchedCat) {
            catId = matchedCat.inventory_category_id || matchedCat.id;
          }
        }
      }

      reset({
        item_name: itemData.item_name || itemData.itemName || "",
        category_id: catId ? String(catId) : "",
        unit: itemData.unit ? String(itemData.unit).toLowerCase() : "",
        image_url: itemData.image_url || itemData.image || "",
        stock_status:
          itemData.stock?.stock_status || itemData.stock_status || "Available",
        qty_in_stock:
          itemData.stock?.qty_in_stock ?? itemData.qty_in_stock ?? 0,
        qty_in_reorder:
          itemData.stock?.qty_in_reorder ?? itemData.qty_in_reorder ?? 0,
      });
    }
  }, [itemData, categories, reset]);

  const submitHandler = async (data) => {
    try {
      const payload = {
        category: {
          inventory_category_id: Number(data.category_id),
        },
        item_name: data.item_name?.trim(),
        image_url: data.image_url?.trim(),
        unit: data.unit,
        stock: {
          stock_status: data.stock_status,
          qty_in_stock: Number(data.qty_in_stock),
          qty_in_reorder: Number(data.qty_in_reorder),
        },
      };

      await inventoryService.updateInventoryItem(id, payload);
      toast.success("Inventory item updated successfully");
      router.push("/inventory");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update inventory item",
      );
    }
  };

  if (id === null || loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const readOnlyStyle = {
    backgroundColor: "#f0f2f5",
    color: "#6c757d",
    cursor: "not-allowed",
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
        <h4 className="fw-semibold">Edit Inventory Item</h4>
      </Card.Header>

      <Card.Body className="p-4">
        <Form onSubmit={handleSubmit(submitHandler)}>
          <Row className="g-4">
            {/* ITEM NAME (Live Validation Feedback) */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Item Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter item name"
                  isInvalid={!!errors.item_name} // Error hone par border red karega
                  {...register("item_name", {
                    required: "Item name is required",
                    pattern: {
                      value: /^[a-zA-Z\s]+$/,
                      message: "Numbers and special characters are not allowed",
                    },
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {errors?.item_name?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* CATEGORY DROPDOWN (Live Validation Feedback) */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Category <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  isInvalid={!!errors.category_id}
                  {...register("category_id", {
                    required: "Please select a category",
                  })}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => {
                    const currentCatId = cat.inventory_category_id || cat.id;
                    return (
                      <option key={currentCatId} value={String(currentCatId)}>
                        {cat.category_name || cat.name}
                      </option>
                    );
                  })}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors?.category_id?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* UNIT DROPDOWN (Live Validation Feedback) */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Unit <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  isInvalid={!!errors.unit}
                  {...register("unit", { required: "Please select a unit" })}
                >
                  <option value="">Select Unit</option>
                  {UNIT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors?.unit?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* IMAGE URL */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  {...register("image_url")}
                />
              </Form.Group>
            </Col>

            {/* STOCK DETAILS SECTION (READ ONLY) */}
            <Col md={12}>
              <hr className="my-2" />
              <h6 className="fw-semibold mb-0 mt-2 text-secondary">
                Stock Details (Read Only)
              </h6>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Current Stock</Form.Label>
                <Form.Control
                  type="number"
                  readOnly
                  style={readOnlyStyle}
                  {...register("qty_in_stock")}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Reorder Level</Form.Label>
                <Form.Control
                  type="number"
                  readOnly
                  style={readOnlyStyle}
                  {...register("qty_in_reorder")}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Stock Status</Form.Label>
                <Form.Control
                  type="text"
                  readOnly
                  style={readOnlyStyle}
                  {...register("stock_status")}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-3 mt-5">
            <Button type="submit" variant="primary" className="px-4">
              Save Changes
            </Button>
            <Button
              variant="outline-secondary"
              className="px-4"
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
