"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "@/styles/purchase/purchaseForm.scss";
import { inventoryService } from "@/services/inventoryService";
import { purchaseService } from "@/services/purchaseService";


export default function PurchaseForm({
  initialData,
  onSubmit,
  buttonText,
  disabled,
}) {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [itemSearch, setItemSearch] = useState("");
  const [showItemDropdown, setShowItemDropdown] = useState(false);

  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      inventoryId: initialData?.inventoryId || initialData?.inventory_id || "",
      orderId: initialData?.orderId || initialData?.order_id || "",
      itemName: initialData?.itemName || initialData?.item_name || "",
      itemCategory:
        initialData?.itemCategory || initialData?.item_category || "",
      vendorSupplier:
        initialData?.vendorSupplier || initialData?.vendor_supplier || "",
      price: initialData?.price || "",
      qty: initialData?.qty || initialData?.quantity || "",
      status: initialData?.status || "Pending",
      deliveryProgress:
        initialData?.deliveryProgress || initialData?.delivery_progress || 0,
      arrivalDate: initialData?.arrivalDate || initialData?.arrival_date || "",
    },
  });

  const [lastPoNo, setLastPoNo] = useState(null);

  useEffect(() => {
    const loadLastPo = async () => {
      try {
        const response = await purchaseService.getPurchaseOrders();

        const orders = response.data || [];

        if (orders.length > 0) {
          const lastOrder = orders.sort(
            (a, b) => b.purchase_id - a.purchase_id
          )[0];

          setLastPoNo(lastOrder.po_no);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadLastPo();
  }, []);

  useEffect(() => {
    if (initialData) {
      const formattedData = {
        inventoryId:
          initialData.inventory_id ??
          initialData.inventoryId ??
          "",

        orderId:
          initialData.po_no ??
          initialData.order_id ??
          initialData.orderId ??
          "",

        itemName:
          initialData.item_name ??
          initialData.itemName ??
          "",

        itemCategory:
          initialData.category_name ??
          initialData.item_category ??
          initialData.itemCategory ??
          "",

        vendorSupplier:
          initialData.vendor_supplier ??
          initialData.vendorSupplier ??
          initialData.vendor ??
          "",

        price:
          initialData.price ?? "",

        qty:
          initialData.quantity ??
          initialData.qty ??
          "",

        status:
          initialData.status ??
          "Pending",

        deliveryProgress:
          initialData.delivery_progress ??
          initialData.deliveryProgress ??
          0,

        arrivalDate:
          initialData.arrival_date
            ? initialData.arrival_date.split("T")[0]
            : "",
      };

      reset(formattedData);
      setItemSearch(formattedData.itemName);
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (!initialData) {
      const next = lastPoNo
        ? `PO${parseInt(lastPoNo.replace("PO", "")) + 1}`
        : "PO1001";

      setValue("orderId", next);
    }
  }, [lastPoNo]);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const response = await inventoryService.getInventoryItems();
        setInventoryItems(response.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadInventory();
  }, []);

  // const filteredItems = useMemo(() => {
  //   const search = itemSearch.trim().toLowerCase();
  //   if (!search) return [];
  //   return inventoryItems
  //     .filter((item) => (item.item_name || "").toLowerCase().includes(search))
  //     .slice(0, 8);
  // }, [inventoryItems, itemSearch]);
  const filteredItems = useMemo(() => {
    const search = itemSearch.trim().toLowerCase();

    if (!search) {
      return inventoryItems.slice(0, 20);
    }

    return inventoryItems
      .filter((item) =>
        (item.item_name || "").toLowerCase().includes(search)
      )
      .slice(0, 20);
  }, [inventoryItems, itemSearch]);

  const handleSelectItem = (itemId) => {
    const selectedItem = inventoryItems.find(
      (item) => String(item.inventory_id || item.id) === String(itemId)
    );

    if (!selectedItem) return;

    setValue("itemName", selectedItem.item_name || "");
    setValue("inventoryId", selectedItem.inventory_id || "");

    setValue(
      "itemCategory",
      selectedItem.category?.category_name ||
      selectedItem.category_name ||
      selectedItem.item_category ||
      ""
    );

    setValue(
      "vendorSupplier",
      selectedItem.vendor_supplier ||
      selectedItem.vendorSupplier ||
      selectedItem.vendor?.supplier_name ||
      selectedItem.supplier_name ||
      selectedItem.supplier ||
      ""
    );

    setValue("price", selectedItem.price || "");

    setItemSearch(selectedItem.item_name);

    // Dropdown close
    setShowItemDropdown(false);
  };

  const watchedPrice = watch("price");
  const watchedQty = watch("qty");
  const watchedStatus = watch("status");

  useEffect(() => {
    if (watchedStatus === "Delivered") {
      setValue("deliveryProgress", 100);
    } else if (
      watchedStatus === "Pending" &&
      watch("deliveryProgress") === 100
    ) {
      setValue("deliveryProgress", 0);
    }
  }, [watchedStatus, setValue]);

  const readOnlyStyle = {
    backgroundColor: "#d0d3d2",
    borderColor: "#d0d3d2",
    cursor: "not-allowed",
  };

  const handleFormSubmit = (data) => {
    const totalAmount = Number(data.price || 0) * Number(data.qty || 0);
    onSubmit({ ...data, total: totalAmount });
  };

  return (
    <Form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="purchase-form-card"
    >
      <Row className="g-4">
        <Col lg={8}>
          <div className="form-section">
            <h5>Purchase Information</h5>
            <Form.Group className="mb-3">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                {...register("itemName", {
                  required: "Item name is required",
                })}
                placeholder="Search item by name"
                value={itemSearch}
                readOnly={isEdit}
                style={isEdit ? readOnlyStyle : {}}
                onChange={(e) => {
                  if (isEdit) return;

                  setItemSearch(e.target.value);
                  setValue("itemName", e.target.value);
                  setShowItemDropdown(true);
                }}
                onFocus={() => {
                  if (!isEdit) {
                    setShowItemDropdown(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setShowItemDropdown(false);
                  }, 200);
                }}
              />
              {showItemDropdown && filteredItems.length > 0 && (
                <div
                  className="position-absolute bg-white border rounded-4 shadow-sm mt-1"
                  style={{
                    zIndex: 20,
                    width: "100%",
                    maxHeight: "210px",
                    maxWidth: "450px",
                    overflowY: "auto",
                  }}
                >
                  {filteredItems.map((item) => (
                    <button
                      key={item.inventory_id}
                      type="button"
                      className="w-100 text-start border-0 bg-white px-3 py-3 border-bottom"
                      onClick={() => handleSelectItem(item.inventory_id)}
                    >
                      <div className="fw-semibold">{item.item_name}</div>
                    </button>
                  ))}
                </div>
              )}
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Inventory Item ID</Form.Label>
                  <Form.Control
                    type="number"
                    isInvalid={!!errors.inventoryId}
                    readOnly
                    style={readOnlyStyle}
                    {...register("inventoryId", {
                      required: "Inventory Item is required",
                    })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Order ID</Form.Label>
                  <Form.Control
                    placeholder="PO1001"
                    isInvalid={!!errors.orderId}
                    readOnly
                    style={readOnlyStyle}
                    {...register("orderId", {
                      required: "Order ID is required",
                    })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Item Category</Form.Label>
                  <Form.Control
                    readOnly
                    style={readOnlyStyle}
                    isInvalid={!!errors.itemCategory}
                    {...register("itemCategory", {
                      required: "Category is required",
                    })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Vendor / Supplier</Form.Label>
                  <Form.Control
                    readOnly={isEdit}
                    style={isEdit ? readOnlyStyle : {}}
                    disabled={disabled}
                    isInvalid={!!errors.vendorSupplier}
                    {...register("vendorSupplier", {
                      required: "Vendor supplier is required",
                    })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Col>

        <Col lg={4}>
          <div className="form-section">
            <h5>Order Details</h5>
            <Form.Group className="mb-3">
              <Form.Label>Price ($)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                disabled={disabled}
                isInvalid={!!errors.price}
                {...register("price", { required: "Price is required" })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                disabled={disabled}
                isInvalid={!!errors.qty}
                {...register("qty", { required: "Quantity is required" })}
              />
            </Form.Group>

            {watchedPrice && watchedQty && (
              <div className="mb-3 px-2 py-1 bg-light rounded text-muted small">
                <strong>Calculated Total:</strong> $
                {(Number(watchedPrice) * Number(watchedQty)).toFixed(2)}
              </div>
            )}

            {!isEdit && (
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  disabled={disabled}
                  {...register("status", { required: "Status is required" })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </Form.Select>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Delivery Progress (%)</Form.Label>
              <Form.Control
                type="number"
                disabled={disabled}
                {...register("deliveryProgress", {
                  required: "Delivery progress is required",
                })}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Arrival Date</Form.Label>
              <Form.Control
                type="date"
                disabled={disabled}
                isInvalid={!!errors.arrivalDate}
                {...register("arrivalDate", {
                  required: "Arrival date is required",
                })}
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 purchase-submit-btn"
              disabled={disabled}
            >
              {buttonText}
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
}
