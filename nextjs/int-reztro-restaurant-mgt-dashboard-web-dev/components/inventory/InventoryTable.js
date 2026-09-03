"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Button,
  Card,
  Form,
  InputGroup,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import { Search, Sliders, PencilSquare } from "react-bootstrap-icons";
import DataTable from "@/components/common/DataTable";
import { inventoryService } from "@/services/inventoryService";
import Link from "next/link";
import "@/styles/inventory/InventoryTable.scss";

const getStatusClass = (status) => {
  const s = status?.toLowerCase() || "";
  if (s === "low stock") return "low";
  if (s === "out of stock" || s === "out") return "out";
  return "available";
};

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Category");
  const [status, setStatus] = useState("All Status");
  const [showFilter, setShowFilter] = useState(false);
  const [categories, setCategories] = useState([]);

  // Live backend connection trigger
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const res = await inventoryService.getInventoryItems();
        setInventoryItems(
          Array.isArray(res.data) ? res.data : res.data?.items || [],
        );

        // Categories fetch
        const catRes = await inventoryService.getCategories();
        const catList = catRes?.data || catRes || [];
        setCategories(Array.isArray(catList) ? catList : []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to parse data matrix.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase();
    return inventoryItems.filter((item) => {
      const name = item.itemName || item.item_name || "";
      const itemCategory = item.category || item.item_category || "";
      const itemStatus = item.stock_status || item.status || "Available"; // stock_status

      const searchMatch =
        name.toLowerCase().includes(keyword) ||
        itemCategory.toLowerCase().includes(keyword);
      const categoryMatch =
        category === "All Category" || itemCategory === category;
      const statusMatch =
        status === "All Status" ||
        itemStatus.toLowerCase() === status.toLowerCase();

      return searchMatch && categoryMatch && statusMatch;
    });
  }, [search, category, status, inventoryItems]);

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: () => <Form.Check />,
        cell: () => <Form.Check />,
        enableSorting: false,
      },
      {
        accessorKey: "itemName",
        header: "Item",
        cell: ({ row }) => {
          const item = row.original;
          const imgSrc = item.image || item.image_url;
          return (
            <div className="inventory-item d-flex align-items-center gap-2">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt=""
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div className="item-placeholder" />
              )}
              <div>
                <span>{item.itemName || item.item_name}</span>
                <small>{item.category || item.item_category}</small>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "category",
        header: "Category",
        meta: { className: "desktop-only-col" },
        cell: ({ row }) => row.original.category || row.original.item_category,
      },
      {
        accessorKey: "status",
        header: "Status",
        meta: { className: "desktop-only-col" },
        cell: ({ row }) => (
          <span
            className={`status-badge ${getStatusClass(row.original.stock_status)}`}
          >
            {row.original.stock_status}
          </span>
        ),
      },
      {
        accessorKey: "qtyInStock",
        header: "Qty in Stock",
        cell: ({ row }) => {
          const item = row.original;
          const stock = Number(item.qtyInStock || item.qty_in_stock || 0);
          const reorder = Number(item.qtyInReorder || item.qty_in_reorder || 1);
          const percentage = Math.min((stock / (reorder || 1)) * 100, 100);

          return (
            <div className="stock-cell">
              <div className="stock-progress d-flex align-items-center gap-2">
                <div className="progress-track">
                  <span style={{ width: `${percentage}%` }} />
                </div>
                <strong>{stock}</strong>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "qtyInReorder",
        header: "Qty in Reorder",
        meta: { className: "text-center" },
        cell: ({ row }) =>
          row.original.qtyInReorder || row.original.qty_in_reorder || 0,
      },
      {
        id: "action",
        header: "Action",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="action-btns d-flex align-items-center gap-2">
            <Link
              href={`/inventory/reorder-stock?id=${row.original?.inventory_id || row.original?.id || row.original?.inventory_item_id}`}
              className="btn btn-sm btn-light"
            >
              Reorder
            </Link>

            <Link
              href={`/inventory/update-stock?id=${row.original?.inventory_id || row.original?.id || row.original?.inventory_item_id}`}
              className="btn btn-sm update-stock-btn"
            >
              Update Stock
            </Link>

            <Link
              href={`/inventory/edit-product?id=${row.original?.inventory_id || row.original?.id || row.original?.inventory_item_id}`}
              className="btn btn-sm btn-light d-flex align-items-center justify-content-center"
              title="Edit Item Details"
            >
              <PencilSquare size={14} />
            </Link>
          </div>
        ),
      },
    ],
    [],
  );

  if (loading)
    return (
      <Card className="border-0 p-5 text-center">
        <Spinner animation="border" variant="warning" />
      </Card>
    );
  if (error)
    return (
      <Alert variant="danger" className="m-3">
        Error details: {error}
      </Alert>
    );

  return (
    <Card className="inventory-table-card border-0">
      <Card.Header className="bg-white border-0">
        <div className="inventory-mobile-search d-flex align-items-center gap-2 d-lg-none">
          <InputGroup className="inventory-search">
            <InputGroup.Text>
              <Search size={18} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search for item"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
          <Button
            type="button"
            className="inventory-filter-toggle"
            onClick={() => setShowFilter(true)}
          >
            <Sliders size={20} />
          </Button>
        </div>

        <Modal show={showFilter} onHide={() => setShowFilter(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Filters</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="All Category">All Category</option>

                {categories.map((cat) => (
                  <option
                    key={cat.inventory_category_id || cat.id}
                    value={cat.category_name || cat.name}
                  >
                    {cat.category_name || cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button className="w-100" onClick={() => setShowFilter(false)}>
              Apply Filter
            </Button>
          </Modal.Body>
        </Modal>

        <div className="inventory-table-top d-flex align-items-center justify-content-between gap-3 flex-wrap">
          <div className="inventory-tabs d-flex align-items-center gap-2">
            <button type="button" className="active">
              Inventory
            </button>
            <Link href="/purchase-order" className="tab-link">
              Purchase Order
            </Link>
          </div>

          <div className="inventory-actions d-none d-lg-flex align-items-center gap-2">
            <InputGroup className="inventory-search">
              <InputGroup.Text>
                <Search size={13} />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search for item"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>

            <Form.Select
              className="inventory-filter"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All Category">All Category</option>
              {categories.map((cat) => (
                <option
                  key={cat.inventory_category_id || cat.id}
                  value={cat.category_name || cat.name}
                >
                  {cat.category_name || cat.name}
                </option>
              ))}
            </Form.Select>

            <Form.Select
              className="inventory-filter"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>All Status</option>
              <option>Available</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </Form.Select>

            <Link
              href="/inventory/add-product"
              className="add-product-btn text-decoration-none d-inline-flex justify-content-center align-items-center"
            >
              Add Product
            </Link>
          </div>
        </div>
      </Card.Header>

      <Card.Body>
        <DataTable data={filteredData} columns={columns} pageSize={10} />
      </Card.Body>
    </Card>
  );
}
