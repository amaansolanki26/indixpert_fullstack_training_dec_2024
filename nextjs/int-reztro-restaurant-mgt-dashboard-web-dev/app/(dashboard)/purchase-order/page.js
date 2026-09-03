"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Button,
  Card,
  Form,
  InputGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Search, Sliders2, X, Plus, PencilSquare } from "react-bootstrap-icons";
import DataTable from "@/components/common/DataTable";
import Link from "next/link";
import { purchaseService } from "@/services/purchaseService";
import { toast } from "react-toastify";
import "@/styles/purchase/purchaseOrder.scss";

export default function PurchaseOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [categoriesList, setCategoriesList] = useState([]);

  const [showFilter, setShowFilter] = useState(false);
  const [showTabletSearch, setShowTabletSearch] = useState(false);

  const [updatedDates, setUpdatedDates] = useState({});



  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await purchaseService.getPurchaseOrders();
  
      const dataList = Array.isArray(response.data)
        ? response.data
        : response.data?.orders || [];
      setOrders(dataList);

      const uniqueCategories = Array.from(
        new Set(
          dataList
            .map((item) => item.category_name || item.item_category)
            .filter(Boolean),
        ),
      );
      setCategoriesList(uniqueCategories);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch orders.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const handleProgressClick = async (item) => {
    const currentProgress = Number(
      item.deliveryProgress || item.delivery_progress || 0,
    );

    if (currentProgress >= 75) return;

    let newProgress = 75;
    let newStatus = "Shipped";

    const orderId = item.purchase_order_id || item.order_id || item.id;
    const currentLiveDate = new Date().toISOString();

    try {
      await purchaseService.updatePurchaseOrderStatus(orderId, {
        delivery_progress: newProgress,
        order_status: newStatus,
        status: newStatus,
        arrival_date: currentLiveDate,
        arrivalDate: currentLiveDate,
        updated_at: currentLiveDate,
      });

      setUpdatedDates((prev) => ({
        ...prev,
        [orderId]: currentLiveDate,
      }));

      toast.success(`Order is now Shipped (${newProgress}%)`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update progress.");
    }
  };

  const handleReceiveAction = async (item) => {
    const orderId = item.purchase_order_id || item.order_id || item.id;
    const currentLiveDate = new Date().toISOString();

    try {
      await purchaseService.updatePurchaseOrderStatus(orderId, {
        delivery_progress: 100,
        order_status: "Delivered",
        status: "Delivered",
        arrival_date: currentLiveDate,
        arrivalDate: currentLiveDate,
        updated_at: currentLiveDate,
      });

      setUpdatedDates((prev) => ({
        ...prev,
        [orderId]: currentLiveDate,
      }));

      toast.success("Order marked as fully Delivered!");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status.");
    }
  };

  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase();

    return orders.filter((item) => {
      const orderIdStr = item.orderId || item.order_id || "";
      const poNoStr = item.po_no || "";
      const itemNameStr = item.itemName || item.item_name || "";
      const vendorStr =
        item.vendorSupplier || item.vendor_supplier || item.vendor || "";
      const currentStatus = item.status || item.order_status || "";
      const currentCategory = item.category_name || item.item_category || "";

      const matchSearch =
        itemNameStr.toLowerCase().includes(keyword) ||
        vendorStr.toLowerCase().includes(keyword) ||
        orderIdStr.toLowerCase().includes(keyword) ||
        poNoStr.toLowerCase().includes(keyword);

      const matchStatus =
        status === "All" ||
        currentStatus.toLowerCase() === status.toLowerCase();

      const matchCategory =
        categoryFilter === "All" ||
        currentCategory.toLowerCase() === categoryFilter.toLowerCase();

      return matchSearch && matchStatus && matchCategory;
    });
  }, [search, status, categoryFilter, orders]);

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: () => <Form.Check />,
        cell: () => <Form.Check />,
        enableSorting: false,
      },
      {
        accessorKey: "orderId",
        header: "Order ID",
        cell: ({ row }) => {
          const item = row.original;
          const rawDate = item.orderDate || item.order_date || item.created_at;
          return (
            <div className="po-order-cell">
              <strong>{item.po_no || item.order_id}</strong>
              <small>{formatDate(rawDate)}</small>
            </div>
          );
        },
      },
      {
        accessorKey: "itemName",
        header: "Item",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="po-item-cell">
              <small className="po-mobile-category">
                {item.category_name || item.item_category}
              </small>
              <strong>{item.itemName || item.item_name}</strong>
              <span className="po-desktop-only">
                {item.category_name || item.item_category}
              </span>
              <span className="po-mobile-vendor">
                {item.vendorSupplier || item.vendor_supplier}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "vendorSupplier",
        header: "Vendor/Supplier",
        meta: { className: "po-desktop-only" },
        cell: ({ row }) =>
          row.original.vendorSupplier ||
          row.original.vendor_supplier ||
          row.original.vendor ||
          "",
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => (
          <span className="po-price">
            ${Number(row.original.price || 0).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: "qty",
        header: "Qty",
        cell: ({ row }) => row.original.qty || row.original.quantity || 0,
      },
      {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => (
          <span className="po-price">
            $
            {Number(
              row.original.total || row.original.total_amount || 0,
            ).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        meta: { className: "po-desktop-only" },
        cell: ({ row }) => {
          const currentStatus = row.original.status || row.original.order_status || "Pending";
          return (
            <span className={`po-status ${currentStatus.toLowerCase()}`}>
              {currentStatus}
            </span>
          );
        },
      },
      {
        accessorKey: "deliveryProgress",
        header: "Delivery Status",
        cell: ({ row }) => {
          const item = row.original;
          const orderId = item.purchase_order_id || item.order_id || item.id;
          const progress = Number(item.deliveryProgress || item.delivery_progress || 0);
          const currentStatus = item.status || item.order_status || "Pending";          

          const rawArrivalDate = updatedDates[orderId] || item.arrival_date || item.arrivalDate || item.updated_at || item.expected_delivery_date || item.delivery_date;

          return (
            <div className="po-delivery-cell">
              <span
                className={`po-status po-mobile-status ${currentStatus.toLowerCase()}`}
              >
                {currentStatus}
              </span>

              <div
                className="po-progress-wrap"
                onClick={() => handleProgressClick(item)}
                style={{ cursor: progress < 75 ? "pointer" : "default" }}
                title={progress < 75 ? "Click to increase progress to 75%" : "Shipped / Delivered"}
              >
                <div className="po-progress">
                  <span
                    className={progress === 100 ? "completed" : ""}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <strong>{progress}%</strong>
              </div>

              <small>Arrival: {formatDate(rawArrivalDate)}</small>
            </div>
          );
        },
      },
      {
        id: "action",
        header: "Action",
        enableSorting: false,
        meta: { className: "po-mobile-hide" },
        cell: ({ row }) => {
          const item = row.original;
          const orderId = item.purchase_order_id || item.order_id || item.id;
          const progress = Number(item.deliveryProgress || item.delivery_progress || 0);
          const currentStatus =
            item.status || item.order_status || "Pending";

          return (
            <div className="d-flex align-items-center gap-2">

              <Button
                as={Link}
                href={`/purchase-order/edit-purchase?id=${orderId}`}
                variant="outline-secondary"
                size="sm"
                disabled={
                  currentStatus === "Shipped" ||
                  currentStatus === "Delivered"
                }
                className="d-inline-flex align-items-center justify-content-center p-1 px-2 rounded-2"
              >
                <PencilSquare size={14} className="me-1" /> Edit
              </Button>

              <Button
                type="button"
                className="receive-btn"
                size="sm"
                disabled={progress < 75 || progress === 100}
                onClick={() => handleReceiveAction(item)}
              >
                Receive
              </Button>
            </div>
          );
        },
      },
    ],
    [orders, updatedDates],
  );

  if (loading) {
    return (
      <Card className="purchase-order-card border-0 p-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="purchase-order-card border-0 p-4">
        <Alert variant="danger">Error loading data: {error}</Alert>
      </Card>
    );
  }

  return (
    <Card className="purchase-order-card border-0">
      <Card.Header className="bg-white border-0">
        <div className="purchase-mobile-search d-flex align-items-center gap-2 d-lg-none">
          <InputGroup className="purchase-search">
            <InputGroup.Text>
              <Search size={18} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search message, PO number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
          <Button
            type="button"
            className="purchase-filter-toggle"
            onClick={() => setShowFilter(true)}
          >
            <Sliders2 />
          </Button>

          <Link
            href="/purchase-order/add-purchase"
            className="purchase-mobile-add text-decoration-none d-inline-flex align-items-center justify-content-center"
          >
            <Plus />
          </Link>
        </div>

        <div className="purchase-table-top d-flex justify-content-between align-items-center flex-wrap">
          <div className="purchase-tabs d-flex gap-1">
            {["All", "Pending", "Shipped", "Delivered"].map((item) => (
              <button
                key={item}
                type="button"
                className={status === item ? "active" : ""}
                onClick={() => setStatus(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="purchase-actions d-none d-lg-flex">
            <InputGroup
              className={`purchase-search ${showTabletSearch ? "show-tablet-search" : ""}`}
            >
              <InputGroup.Text onClick={() => setShowTabletSearch(true)}>
                <Search size={13} />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search item, vendor, PO number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>

            <Form.Select
              className="purchase-category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Category</option>
              {categoriesList.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </Form.Select>

            <Link
              href="/purchase-order/add-purchase"
              className="add-purchase-btn text-decoration-none d-inline-flex align-items-center justify-content-center"
            >
              Add Purchase
            </Link>
          </div>
        </div>
      </Card.Header>

      {showFilter && (
        <div className="purchase-mobile-filter-popup d-md-none">
          <div
            className="purchase-mobile-filter-backdrop"
            onClick={() => setShowFilter(false)}
          />
          <div className="purchase-mobile-filter-content">
            <button
              type="button"
              className="purchase-mobile-filter-close"
              onClick={() => setShowFilter(false)}
            >
              <X />
            </button>
            <h5>Filter</h5>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Category</option>
                {categoriesList.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button
              type="button"
              className="add-purchase-btn w-100"
              onClick={() => setShowFilter(false)}
            >
              Apply Filter
            </Button>
          </div>
        </div>
      )}

      <Card.Body className="pt-0">
        <DataTable data={filteredData} columns={columns} pageSize={10} />
      </Card.Body>
    </Card>
  );
}