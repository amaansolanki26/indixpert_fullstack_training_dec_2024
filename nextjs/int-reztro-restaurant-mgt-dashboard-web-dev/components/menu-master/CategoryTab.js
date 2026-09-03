"use client";

import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, ButtonGroup } from "react-bootstrap";
import { menuService } from "@/services/menuService";
import { toast } from "react-toastify";

export default function CategoryTab() {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ category_name: "" });

  const [filter, setFilter] = useState("active");

  const load = async () => {
    try {
      const res = await menuService.getMenuCategories();
      const list = res?.data || res?.data?.data;
      setData(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories");
      setData([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    try {
      if (!form.category_name?.trim()) {
        toast.error("Category name required");
        return;
      }

      if (editId) {
        await menuService.updateMenuCategory(editId, form);
        toast.success("Updated");
      } else {
        await menuService.createMenuCategory(form);
        toast.success("Created");
      }

      setShow(false);
      setForm({ category_name: "" });
      setEditId(null);
      load();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.detail || "Error");
    }
  };

  const handleEdit = (item) => {
    setForm({ category_name: item?.category_name || "" });
    setEditId(item?.category_id);
    setShow(true);
  };

  const handleDelete = async (id) => {
    try {
      await menuService.deleteMenuCategory(id);
      toast.success("Deleted");
      load();
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  const handleRestore = async (item) => {
    try {
      await menuService.restoreMenuCategory(item.category_id);

      toast.success("Restored");
      load();
    } catch (error) {
      console.error(error);
      toast.error("Restore failed");
    }
  };

  const filteredData = data.filter((item) => {
    if (filter === "active") return item.is_active === true;
    if (filter === "inactive") return item.is_active === false;
    return true;
  });

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mt-3">
        {/* FILTER */}
        <div>
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
        <Button onClick={() => setShow(true)}>Add Category</Button>
      </div>

      {/* TABLE */}
      <Table className="mt-3" bordered hover>
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={item.category_id || index}>
                {/* SR NO */}
                <td>{index + 1}</td>

                {/* ID */}
                <td>{item.category_id}</td>

                {/* NAME */}
                <td>{item.category_name}</td>

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
                        onClick={() => handleDelete(item.category_id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleRestore(item)}
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
                No categories found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* MODAL */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editId ? "Update Category" : "Add Category"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Control
            placeholder="Enter category name"
            value={form.category_name}
            onChange={(e) => {
              const val = e.target.value;

              const formattedCategory =
                val.charAt(0).toUpperCase() + val.slice(1);

              setForm({ category_name: formattedCategory });
            }}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
