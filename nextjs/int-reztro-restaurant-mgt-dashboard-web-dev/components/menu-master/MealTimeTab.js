"use client";

import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, ButtonGroup } from "react-bootstrap";
import { menuService } from "@/services/menuService";
import { toast } from "react-toastify";

export default function MealTimeTab() {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ meal_time_name: "" });
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("active");

  // GET
  const load = async () => {
    try {
      const res = await menuService.getMealTimes();
      const list = res?.data?.data || res?.data || [];
      setData(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load meal times");
      setData([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // FILTER
  const filteredData = data.filter((item) => {
    if (filter === "active") return item.is_active === true;
    if (filter === "inactive") return item.is_active === false;
    return true;
  });

  // SAVE
  const save = async () => {
    try {
      const inputName = form.meal_time_name?.trim();

      if (!inputName) {
        toast.error("Meal Time Name required");
        return;
      }

      // --- EXISTING VALUE CHECK START ---
      const isExisting = data.some(
        (item) =>
          item.meal_time_name.toLowerCase() === inputName.toLowerCase() &&
          item.meal_time_id !== editId,
      );

      if (isExisting) {
        toast.error("This meal time name already exists!");
        return;
      }
      // --- EXISTING VALUE CHECK END ---

      if (editId) {
        await menuService.updateMealTime(editId, form);
        toast.success("Updated");
      } else {
        await menuService.createMealTime(form);
        toast.success("Created");
      }

      setShow(false);
      setForm({ meal_time_name: "" });
      setEditId(null);
      load();
    } catch (err) {
      console.error(err);
      toast.error("Error saving meal time");
    }
  };

  // EDIT
  const handleEdit = (item) => {
    setForm({ meal_time_name: item.meal_time_name });
    setEditId(item.meal_time_id);
    setShow(true);
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await menuService.deleteMealTime(id);
      toast.success("Deleted");
      load();
    } catch (err) {
      console.error(err);

      const errorMessage = err?.message || "";

      if (
        errorMessage.includes("Database error") ||
        errorMessage.includes("deleting meal time")
      ) {
        toast.error(
          "This meal time is used in food items, so it cannot be deleted!",
        );
      } else {
        toast.error(errorMessage || "Delete failed");
      }
    }
  };

  // RESTORE
  const handleRestore = async (id) => {
    try {
      await menuService.restoreMealTime(id);
      toast.success("Restored");
      load();
    } catch (err) {
      console.error(err);
      toast.error("Restore failed");
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
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

        <Button onClick={() => setShow(true)}>Add Meal Time</Button>
      </div>

      {/* TABLE */}
      <Table bordered hover>
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>ID</th>
            <th>Meal Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={item.meal_time_id}>
                <td>{index + 1}</td>
                <td>{item.meal_time_id}</td>
                <td>{item.meal_time_name}</td>

                <td>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: item.is_active ? "#198754" : "#dc3545",
                      background: item.is_active ? "#e8f5ee" : "#fdeaea",
                    }}
                  >
                    {item.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td>
                  {item.is_active ? (
                    <div className="d-flex gap-2">
                      <Button size="sm" onClick={() => handleEdit(item)}>
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(item.meal_time_id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleRestore(item.meal_time_id)}
                    >
                      Restore
                    </Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-3">
                No meal times found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* MODAL */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editId ? "Update Meal Time" : "Add Meal Time"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Control
            placeholder="Enter meal time name"
            value={form.meal_time_name}
            onChange={(e) => {
              const val = e.target.value;
              
              const formattedMealTime =
                val.charAt(0).toUpperCase() + val.slice(1);

              setForm({ meal_time_name: formattedMealTime });
            }}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={save}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
