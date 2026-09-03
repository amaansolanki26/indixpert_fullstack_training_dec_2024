"use client";

import { useEffect, useState } from "react";
import { Button, Form, Table, Modal, ButtonGroup } from "react-bootstrap";
import { inventoryService } from "@/services/inventoryService";
import { toast } from "react-toastify";

export default function InventoryCategoryTab() {
    const [categories, setCategories] = useState([]);
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [editId, setEditId] = useState(null);
    const [filter, setFilter] = useState("active");

    // GET
    const fetchCategories = async () => {
        try {
            const res = await inventoryService.getCategories();
            setCategories(res?.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load inventory categories");
            setCategories([]);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // FILTER
    const filteredData = categories.filter((item) => {
        if (filter === "active") return item.is_active === true;
        if (filter === "inactive") return item.is_active === false;
        return true;
    });

    // SAVE
    const handleSave = async () => {
        try {
            const inputName = name?.trim();

            if (!inputName) {
                toast.error("Category name required");
                return;
            }

            // --- EXISTING VALUE CHECK ---
            const isExisting = categories.some(
                (item) =>
                    item.category_name.toLowerCase() === inputName.toLowerCase() &&
                    item.inventory_category_id !== editId
            );

            if (isExisting) {
                toast.error("This category name already exists!");
                return;
            }

            if (editId) {
                await inventoryService.updateCategory(editId, {
                    category_name: inputName,
                });
                toast.success("Updated successfully");
            } else {
                await inventoryService.addCategory({
                    category_name: inputName,
                });
                toast.success("Created successfully");
            }

            setName("");
            setEditId(null);
            setShow(false);
            fetchCategories();
        } catch (error) {
            console.error(error);
            const errorMessage = error?.message || "Save failed";
            toast.error(errorMessage);
        }
    };

    // EDIT
    const handleEdit = (item) => {
        setEditId(item.inventory_category_id);
        setName(item.category_name);
        setShow(true);
    };

    // DELETE
    const handleDelete = async (id) => {
        try {
            await inventoryService.deleteCategory(id);
            toast.success("Deleted successfully");
            fetchCategories();
        } catch (error) {
            console.error(error);
            const errorMessage = error?.message || "";

            if (errorMessage.includes("Database error") || errorMessage.includes("deleting")) {
                toast.error("This category is used in inventory items, so it cannot be deleted!");
            } else {
                toast.error(errorMessage || "Delete failed");
            }
        }
    };

    // RESTORE
    const handleRestore = async (id) => {
        try {
            await inventoryService.restoreCategory(id);
            toast.success("Restored successfully");
            fetchCategories();
        } catch (error) {
            console.error(error);
            toast.error(error?.message || "Restore failed");
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

                <Button onClick={() => { setEditId(null); setName(""); setShow(true); }}>
                    Add Category
                </Button>
            </div>

            {/* TABLE */}
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>Sr. No</th>
                        <th>ID</th>
                        <th>Category Name</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredData.length > 0 ? (
                        filteredData.map((item, index) => (
                            <tr key={item.inventory_category_id || index}>
                                <td>{index + 1}</td>
                                <td>{item.inventory_category_id}</td>
                                <td>{item.category_name}</td>
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
                                                onClick={() => handleDelete(item.inventory_category_id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="success"
                                            onClick={() => handleRestore(item.inventory_category_id)}
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
                        {editId ? "Edit Category" : "Add Category"}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Control
                        value={name}
                        onChange={(e) => {
                            const val = e.target.value;
                            const formattedName = val.charAt(0).toUpperCase() + val.slice(1);
                            setName(formattedName);
                        }}
                        placeholder="Enter category name"
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
        </div>
    );
}