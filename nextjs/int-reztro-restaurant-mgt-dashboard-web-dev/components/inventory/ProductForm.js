"use client";

import { useState, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { inventoryService } from "@/services/inventoryService";

export default function ProductForm({ initialData, onSubmit, buttonText, disabled }) {
  const [categories, setCategories] = useState([]);
  const [imageType, setImageType] = useState("url");
  const [imagePreview, setImagePreview] = useState(initialData?.image || initialData?.image_url || "");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      itemName: initialData?.itemName || initialData?.item_name || "",
      image: initialData?.image || initialData?.image_url || "",
      category: initialData?.inventory_category_id || "",
      status: initialData?.status || "Available",
      qtyInStock: initialData?.qtyInStock || initialData?.qty_in_stock || "",
      qtyInReorder: initialData?.qtyInReorder || initialData?.qty_in_reorder || "",
    },
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await inventoryService.getCategories();

      setCategories(response.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="product-form-card">
      <Row className="g-4">
        <Col lg={8}>
          <div className="form-section">
            <h5>Product Information</h5>

            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                placeholder="Fresh Salmon"
                isInvalid={!!errors.itemName}
                disabled={disabled}
                {...register("itemName", {
                  required: "Product name is required",
                  minLength: {
                    value: 3,
                    message: "Minimum 3 characters required",
                  },
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only letters are allowed",
                  },
                })}
              />
              <Form.Control.Feedback type="invalid">{errors.itemName?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <div className="image-option-tabs d-flex gap-2 mb-2">
                <Button type="button" size="sm" className={imageType === "url" ? "active" : ""} onClick={() => setImageType("url")}>Image URL</Button>
                <Button type="button" size="sm" className={imageType === "file" ? "active" : ""} onClick={() => setImageType("file")}>Choose File</Button>
              </div>

              {imageType === "url" ? (
                <Form.Control
                  placeholder="Paste image URL"
                  isInvalid={!!errors.image}
                  disabled={disabled}
                  {...register("image")}
                  onChange={(e) => { setValue("image", e.target.value); setImagePreview(e.target.value); }}
                />
              ) : (
                <Form.Control
                  type="file"
                  accept="image/*"
                  disabled={disabled}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const imageUrl = URL.createObjectURL(file);
                    setImagePreview(imageUrl);
                    setValue("image", imageUrl);
                  }}
                />
              )}
              {imagePreview && <div className="image-preview mt-3"><img src={imagePreview} alt="" style={{ height: "100px", borderRadius: "8px", objectFit: "cover" }} /></div>}
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    disabled={disabled}
                    isInvalid={!!errors.category}
                    {...register("category", {
                      required: "Category is required"
                    })}
                  >
                    <option value="">Select Category</option>

                    {categories.map((cat) => (
                      <option
                        key={cat.inventory_category_id}
                        value={cat.inventory_category_id}
                      >
                        {cat.category_name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.category?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select 
                  disabled={disabled} 
                  isInvalid={!!errors.status} 
                  {...register("status", {
                    required: "Status is required"
                  })}>
                    <option value="Available">Available</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.status?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Col>

        <Col lg={4}>
          <div className="form-section">
            <h5>Stock Details</h5>

            <Form.Group className="mb-3">
              <Form.Label>Qty in Stock</Form.Label>
              <Form.Control type="number" min="0" placeholder="45" isInvalid={!!errors.qtyInStock} disabled={disabled}
                {...register("qtyInStock", {
                  required: "Qty in Stock is required",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Negative value not allowed",
                  },
                  pattern: {
                    value: /^\d+$/,
                    message: "Only numbers are allowed",
                  },
                })} />
              <Form.Control.Feedback type="invalid">
                {errors.qtyInStock?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Qty in Reorder</Form.Label>
              <Form.Control type="number" min="0" placeholder="50" isInvalid={!!errors.qtyInReorder} disabled={disabled} {...register("qtyInReorder", {
                required: "Qty in Reorder is required",
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Negative value not allowed",
                },
                pattern: {
                  value: /^\d+$/,
                  message: "Only numbers are allowed",
                },
              })} />
              <Form.Control.Feedback type="invalid">
                {errors.qtyInReorder?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" className="w-100 product-submit-btn" disabled={disabled}>{buttonText}</Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
}