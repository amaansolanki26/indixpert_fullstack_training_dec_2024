"use client";

import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, ButtonGroup } from "react-bootstrap";
import { menuService } from "@/services/menuService";
import { toast } from "react-toastify";

export default function PromotionTab() {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);

  const [filter, setFilter] = useState("active");

  const [form, setForm] = useState({
    promotion_title: "",
    promotion_code: "",
    discount_type: "Percentage",
    discount_value: "",
    start_date: "",
    end_date: "",
    min_order_amount: "",
    max_discount_amount: "",
  });

  const load = async () => {
    try {
      const res = await menuService.getPromotions();

      const list = res?.data || res?.data;

      setData(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load promotions");
      setData([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({
      promotion_title: "",
      promotion_code: "",
      discount_type: "Percentage",
      discount_value: "",
      start_date: "",
      end_date: "",
      min_order_amount: "",
      max_discount_amount: "",
    });

    setEditId(null);
  };

  const handleSave = async () => {
    try {
      if (editId) {
        await menuService.updatePromotion(editId, form);
        toast.success("Promotion updated");
      } else {
        await menuService.createPromotion(form);
        toast.success("Promotion created");
      }

      setShow(false);
      resetForm();
      load();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.detail || "Save failed");
    }
  };

  const handleEdit = (item) => {
    setEditId(item.promotion_id);

    setForm({
      promotion_title: item.promotion_title || "",
      promotion_code: item.promotion_code || "",
      discount_type: item.discount_type || "Percentage",
      discount_value: item.discount_value || "",
      start_date: item.start_date || "",
      end_date: item.end_date || "",
      min_order_amount: item.min_order_amount || "",
      max_discount_amount: item.max_discount_amount || "",
    });

    setShow(true);
  };

  const handleDelete = async (id) => {
    try {
      await menuService.deletePromotion(id);

      toast.success("Promotion deleted");

      load();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.detail || "Delete failed");
    }
  };

  const handleRestore = async (id) => {
    try {
      await menuService.restorePromotion(id);

      toast.success("Promotion restored");
      load();
    } catch (error) {
      console.log(error?.response?.data);
      console.log(error?.response?.status);

      toast.error(
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Restore failed",
      );
    }
  };

  const formatDateTime = (date) => {
    return new Date(date + "Z")
      .toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", "")
      .replace("am", "AM")
      .replace("pm", "PM");
  }


  const filteredData = data.filter((item) => {
    if (filter === "active") return item.is_active;
    if (filter === "inactive") return !item.is_active;
    return true;
  });

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mt-3">
        {/* FILTER */}
        <div className="mt-3">
          <ButtonGroup>
            <Button
              variant={filter === "all" ? "primary" : "outline-primary"}
              onClick={() => setFilter("all")}
            >
              All
            </Button>

            <Button
              variant={filter === "active" ? "primary" : "outline-primary"}
              onClick={() => setFilter("active")}
            >
              Active
            </Button>

            <Button
              variant={filter === "inactive" ? "primary" : "outline-primary"}
              onClick={() => setFilter("inactive")}
            >
              Inactive
            </Button>
          </ButtonGroup>
        </div>

        {/* ADD BUTTON */}
        <Button onClick={() => setShow(true)}>Add Promotion</Button>
      </div>

      <Table bordered className="mt-3">
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Title</th>
            <th>Code</th>
            <th>Type</th>
            <th>Value</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Min Order</th>
            <th>Max Discount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={item.promotion_id || index}>
                {/* SR NO */}
                <td>{index + 1}</td>

                {/* TITLE */}
                <td>{item.promotion_title}</td>

                {/* CODE */}
                <td>{item.promotion_code}</td>

                {/* TYPE */}
                <td>{item.discount_type}</td>

                {/* VALUE */}
                <td>{item.discount_value}</td>

                {/* START DATE */}
                <td>{item.start_date ? formatDateTime(item.start_date) : "-"}</td>

                {/* END DATE */}
                <td>{item.end_date ? formatDateTime(item.end_date) : "-"}</td>

                {/* MIN ORDER */}
                <td>{item.min_order_amount ?? "-"}</td>

                {/* MAX DISCOUNT */}
                <td>{item.max_discount_amount ?? "-"}</td>

                {/* STATUS */}
                <td>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: item.is_active ? "#0f5132" : "#842029",
                      background: item.is_active ? "#d1e7dd" : "#f8d7da",
                    }}
                  >
                    {item.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* ACTION */}
                <td>
                  {item.is_active ? (
                    <div className="d-flex gap-2">
                      <Button size="sm" onClick={() => handleEdit(item)}>
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(item.promotion_id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleRestore(item.promotion_id)}
                    >
                      Restore
                    </Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={11} className="text-center py-3">
                No promotions found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editId ? "Update Promotion" : "Add Promotion"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Promotion Title</Form.Label>
            <Form.Control
              value={form.promotion_title}
              onChange={(e) =>
                setForm({
                  ...form,
                  promotion_title: e.target.value.toUpperCase(),
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Promotion Code</Form.Label>
            <Form.Control
              value={form.promotion_code}
              onChange={(e) =>
                setForm({
                  ...form,
                  promotion_code: e.target.value.toUpperCase(),
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Discount Type</Form.Label>

            <Form.Select
              value={form.discount_type}
              onChange={(e) =>
                setForm({
                  ...form,
                  discount_type: e.target.value,
                })
              }
            >
              <option value="Percentage">Percentage</option>
              <option value="Flat">Flat</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Discount Value</Form.Label>

            <Form.Control
              type="number"
              min="0"
              placeholder="0"
              value={form.discount_value}
              onChange={(e) => {
                const rawValue = e.target.value;

                if (rawValue === "") {
                  setForm({
                    ...form,
                    discount_value: "",
                  });
                  return;
                }

                const val = Number(rawValue);
                const safeValue = val < 0 ? 0 : val;

                setForm({
                  ...form,
                  discount_value: safeValue,
                });
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3 mt-3">
            <Form.Label>Start Date & Time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={form.start_date}
              onChange={(e) =>
                setForm({
                  ...form,
                  start_date: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>End Date & Time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={form.end_date}
              onChange={(e) =>
                setForm({
                  ...form,
                  end_date: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Minimum Order Amount</Form.Label>
            <Form.Control
              type="number"
              min="0"
              placeholder="0"
              value={form.min_order_amount}
              onChange={(e) =>
                setForm({
                  ...form,
                  min_order_amount: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Maximum Discount Amount</Form.Label>
            <Form.Control
              type="number"
              min="0"
              placeholder="0"
              value={form.max_discount_amount}
              onChange={(e) =>
                setForm({
                  ...form,
                  max_discount_amount: e.target.value,
                })
              }
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>

          <Button onClick={handleSave}>{editId ? "Update" : "Save"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
