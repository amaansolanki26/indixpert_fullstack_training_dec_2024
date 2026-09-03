"use client";

import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, ButtonGroup } from "react-bootstrap";
import { menuService } from "@/services/menuService";
import { toast } from "react-toastify";

export default function TagTab() {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ tag_name: "" });

  const [filter, setFilter] = useState("active");

  const load = async () => {
    try {
      const res = await menuService.getTags();

      const list = res?.data || res?.data?.data;

      setData(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load tags");
      setData([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    try {
      if (!form.tag_name?.trim()) {
        toast.error("Tag name required");
        return;
      }

      if (editId) {
        await menuService.updateTag(editId, form);
        toast.success("Updated");
      } else {
        await menuService.createTag(form);
        toast.success("Created");
      }

      setShow(false);
      setForm({ tag_name: "" });
      setEditId(null);
      load();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.detail || "Error");
    }
  };

  const handleEdit = (item) => {
    setForm({ tag_name: item.tag_name || "" });
    setEditId(item.tag_id);
    setShow(true);
  };

  const handleDelete = async (id) => {
    try {
      await menuService.deleteTag(id);
      toast.success("Deleted");
      load();
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  const handleRestore = async (item) => {
    try {
      await menuService.restoreTag(item.tag_id);

      toast.success("Restored");
      load();
    } catch (error) {
      console.log(error?.response?.data);
      toast.error(error?.response?.data?.detail || "Restore failed");
    }
  };

  // FILTER LOGIC
  const filteredData = data.filter((item) => {
    if (filter === "active") return item.is_active === true;
    if (filter === "inactive") return item.is_active === false;
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
        <Button
          onClick={() => {
            setEditId(null);
            setForm({ tag_name: "" });
            setShow(true);
          }}
        >
          Add Tag
        </Button>
      </div>

      {/* TABLE */}
      <Table className="mt-3" bordered hover>
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>ID</th>
            <th>Tag Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={item.tag_id || index}>
                {/* SR NO */}
                <td>{index + 1}</td>

                {/* ID */}
                <td>{item.tag_id}</td>

                {/* TAG NAME */}
                <td>{item.tag_name}</td>

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
                        onClick={() => handleDelete(item.tag_id)}
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
                No tags found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* MODAL */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Update Tag" : "Add Tag"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            placeholder="Enter tag name"
            value={form.tag_name}
            onChange={(e) => {
              const val = e.target.value;

              const formattedTag = val.charAt(0).toUpperCase() + val.slice(1);

              setForm({ tag_name: formattedTag });
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
    </>
  );
}
