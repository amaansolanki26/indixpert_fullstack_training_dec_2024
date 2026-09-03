"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

import { useOrders } from "@/hooks/useOrders";

import {
  Table,
  Button,
  Form,
  ButtonGroup,
  Dropdown,
  Row,
  Spinner,
  Alert,
} from "react-bootstrap";

import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import { List, Grid, ChevronsUpDown } from "lucide-react";
import TablePagination from "@/components/table_pagination";

import FilterGroup from "@/components/filter";
import SearchInput from "@/components/search";
import PageSizeSelector from "@/components/pagesize";
import Order_Card from "@/components/Order_Card";
import CardPagination from "@/components/pagination";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OrdersTable() {
  const router = useRouter();

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("This Month");
  const [rowSelection, setRowSelection] = useState({});

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [cardPagination, setCardPagination] = useState({
    pageIndex: 0,
    pageSize: 6,
  });

  const [isTablet, setIsTablet] = useState(false);
  const [view, setView] = useState("table");

  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
  } = useOrders();

  useEffect(() => {
    const handleResize = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth <= 991);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const processedOrders = useMemo(() => {
    return (orders || []).map((order) => {

      const rawOnlineDetails = order.online_details || order.onlineDetails;
      const nestedAddress = typeof rawOnlineDetails === "object"
        ? (rawOnlineDetails?.delivery_address || rawOnlineDetails?.address)
        : null;

      return {
        ...order,
        // Fallbacks agar backend snake_case bhej raha hai
        orderId: order.orderId || order.order_id || order.id || "-",
        orderType: order.orderType || order.order_type || "Online",
        customer: order.customer || order.customer_name || "-",
        status: order.status || order.order_status || "Pending",
        amount: order.amount || order.total_amount || 0,

        // Agar type 'Online' hai aur nested address mila toh use priority denge
        address: nestedAddress || order.address || order.customer_address || "-"
      };
    });
  }, [orders]);

  // const data = useMemo(() => {
  //   if (statusFilter === "All") return processedOrders;

  //   return processedOrders.filter((item) => item.status === statusFilter);
  // }, [processedOrders, statusFilter]);

  const data = useMemo(() => {
    let filtered = [...processedOrders];

    // Status Filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (item) => item.status === statusFilter
      );
    }

    // Date Filter
    const today = new Date();

    filtered = filtered.filter((item) => {
      if (!item.date) return true;

      const orderDate = new Date(item.date);

      if (dateFilter === "This Week") {
        const firstDay = new Date(today);
        firstDay.setDate(today.getDate() - today.getDay());

        return orderDate >= firstDay;
      }

      if (dateFilter === "This Month") {
        return (
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear()
        );
      }

      if (dateFilter === "This Year") {
        return orderDate.getFullYear() === today.getFullYear();
      }

      return true;
    });

    return filtered;
  }, [processedOrders, statusFilter, dateFilter]);

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));

    setCardPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  }, [statusFilter, globalFilter, dateFilter]);

  useEffect(() => {
    setCardPagination((prev) => {
      const totalPages = Math.ceil(data.length / prev.pageSize);

      if (totalPages === 0) {
        if (prev.pageIndex === 0) return prev;

        return {
          ...prev,
          pageIndex: 0,
        };
      }

      if (prev.pageIndex >= totalPages) {
        return {
          ...prev,
          pageIndex: totalPages - 1,
        };
      }

      return prev;
    });
  }, [data.length]);

  const getOrderTypeBadgeDot = (value) => {
    const dotColors = {
      "Dine-In": "bg-primary",
      Takeaway: "bg-danger",
      Online: "bg-dark",
    };

    return dotColors[value] || "bg-secondary";
  };

  const getStatusClass = (value) => {
    const styles = {
      Completed: "bg-primary text-white",
      Cancelled: "bg-dark text-white",
      "On Process": "bg-danger text-dark",
      Pending: "bg-warning text-dark",
      Processing: "bg-danger text-dark",
    };

    return styles[value] || "bg-secondary text-white";
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        id: "select",
        enableSorting: false,
        header: ({ table }) => (
          <Form.Check
            type="checkbox"
            className="m-0 p-0"
            checked={table.getIsAllPageRowsSelected()}
            ref={(el) =>
              el && (el.indeterminate = table.getIsSomePageRowsSelected())
            }
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            onClick={(e) => e.stopPropagation()}
          />
        ),
        cell: ({ row }) => (
          <Form.Check
            type="checkbox"
            className="m-0 p-0"
            checked={row.getIsSelected()}
            ref={(el) => el && (el.indeterminate = row.getIsSomeSelected())}
            onChange={row.getToggleSelectedHandler()}
            onClick={(e) => e.stopPropagation()}
          />
        ),
      },
    ];

    if (isTablet) {
      return [
        ...baseColumns,
        {
          header: "Order",
          accessorKey: "orderId",
          cell: ({ row }) => (
            <div className="d-flex flex-column">
              <span className="fw-semibold">
                {row.original.orderId || "-"}
              </span>

              <small className="text-muted">
                {row.original.customer || "-"}
              </small>
            </div>
          ),
        },
        {
          header: "Date",
          accessorKey: "date",
          cell: ({ row }) => (
            <div className="d-flex flex-column">
              <span>{row.original.date || "-"}</span>

              <small className="text-muted">{row.original.time || "-"}</small>
            </div>
          ),
        },
        {
          header: "Order Type",
          accessorKey: "orderType",
          cell: ({ row, getValue }) => {
            const value = getValue() || "-";

            return (
              <div className="d-flex flex-column">
                <span className="badge bg-info text-dark px-3 py-2 rounded-3 d-inline-flex align-items-center gap-2">
                  <span
                    className={`rounded-circle ${getOrderTypeBadgeDot(value)}`}
                    style={{
                      width: "8px",
                      height: "8px",
                    }}
                  />

                  {value}
                </span>

                <small className="text-muted mt-1 text-wrap" style={{ maxWidth: "150px" }}>
                  {row.original.address || "-"}
                </small>
              </div>
            );
          },
        },
        {
          header: "Amount",
          accessorKey: "amount",
          cell: ({ getValue }) => (
            <span className="fw-semibold text-primary">
              ${Number(getValue() || 0).toFixed(2)}
            </span>
          ),
        },
        {
          header: "Status",
          accessorKey: "status",
          cell: ({ getValue }) => {
            const value = getValue() || "-";

            return (
              <span
                className={`badge px-3 py-2 rounded-3 ${getStatusClass(
                  value
                )}`}
              >
                {value}
              </span>
            );
          },
        },
      ];
    }

    return [
      ...baseColumns,
      {
        header: "Order ID",
        accessorKey: "orderId",
        cell: ({ getValue }) => (
          <span className="text-secondary">{getValue() || "-"}</span>
        ),
      },
      {
        header: "Date",
        accessorKey: "date",
        cell: ({ row }) => (
          <div className="d-flex flex-column">
            <span>{row.original.date || "-"}</span>

            <small className="text-muted">{row.original.time || "-"}</small>
          </div>
        ),
      },
      {
        header: "Customer",
        accessorKey: "customer",
        cell: ({ getValue }) => (
          <span className="fw-semibold">{getValue() || "-"}</span>
        ),
      },
      {
        header: "Order Type",
        accessorKey: "orderType",
        cell: ({ getValue }) => {
          const value = getValue() || "-";

          return (
            <span className="badge bg-info text-dark px-3 py-2 rounded-3 d-inline-flex align-items-center gap-2">
              <span
                className={`rounded-circle ${getOrderTypeBadgeDot(value)}`}
                style={{
                  width: "8px",
                  height: "8px",
                }}
              />

              {value}
            </span>
          );
        },
      },
      {
        header: "Address",
        accessorKey: "address",
        cell: ({ getValue }) => (
          <span className="text-wrap d-inline-block" style={{ maxWidth: "200px" }}>
            {getValue() || "-"}
          </span>
        ),
      },
      {
        header: "Qty",
        accessorKey: "qty",
        cell: ({ getValue }) => <span>{getValue() || 0}</span>,
      },
      {
        header: "Amount",
        accessorKey: "amount",
        cell: ({ getValue }) => (
          <span className="fw-semibold text-primary">
            ${Number(getValue() || 0).toFixed(2)}
          </span>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => {
          const value = getValue() || "-";

          return (
            <span
              className={`badge px-3 py-2 rounded-3 ${getStatusClass(value)}`}
            >
              {value}
            </span>
          );
        },
      },
    ];
  }, [isTablet]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
      rowSelection,
      pagination,
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    autoResetPageIndex: false,
    autoResetAll: false,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const filteredCards = data;

  const paginatedCards = filteredCards.slice(
    cardPagination.pageIndex * cardPagination.pageSize,
    (cardPagination.pageIndex + 1) * cardPagination.pageSize
  );

  return (
    <>
      {view === "table" && (
        <div className="p-4 bg-white rounded-4 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
            <FilterGroup
              options={["All", "On Process", "Completed", "Cancelled"]}
              value={statusFilter}
              onChange={setStatusFilter}
            />

            <div className="d-flex align-items-center gap-2">
              <Button
                as={Link}
                href="/orders/create"
                variant="primary"
                className="text-white rounded-3 px-3"
              >
                New Order
              </Button>

              <ButtonGroup>
                <Button
                  size="sm"
                  variant={view === "table" ? "primary" : "info"}
                  onClick={() => setView("table")}
                >
                  <List
                    size={16}
                    className={
                      view === "table" ? "text-white" : "text-secondary"
                    }
                  />
                </Button>

                <Button
                  size="sm"
                  variant={view === "card" ? "primary" : "info"}
                  onClick={() => setView("card")}
                >
                  <Grid
                    size={16}
                    className={
                      view === "card" ? "text-white" : "text-secondary"
                    }
                  />
                </Button>
              </ButtonGroup>

              <SearchInput
                value={globalFilter}
                onChange={setGlobalFilter}
                placeholder="Search order ID, customer, etc"
              />

              <Dropdown>
                <Dropdown.Toggle
                  variant="light"
                  className="rounded-3 border-0 d-flex align-items-center gap-2 no-caret"
                >
                  {dateFilter}
                  <ChevronDown size={16} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    active={dateFilter === "This Week"}
                    onClick={() => setDateFilter("This Week")}
                  >
                    This Week
                  </Dropdown.Item>

                  <Dropdown.Item
                    active={dateFilter === "This Month"}
                    onClick={() => setDateFilter("This Month")}
                  >
                    This Month
                  </Dropdown.Item>

                  <Dropdown.Item
                    active={dateFilter === "This Year"}
                    onClick={() => setDateFilter("This Year")}
                  >
                    This Year
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          {ordersError && (
            <Alert variant="danger" className="rounded-4">
              {ordersError}
            </Alert>
          )}

          <div className="table-scroll w-100 table-responsive">
            <Table className="custom-table">
              <thead className="text-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={
                          header.column.getCanSort()
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                        className="px-3 py-2 text-secondary fw-normal"
                      >
                        <div
                          className={
                            header.column.id === "select"
                              ? ""
                              : "d-flex gap-1 align-items-center"
                          }
                        >
                          {header.column.id === "select" ? (
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )
                          ) : (
                            <span className="small">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </span>
                          )}

                          {header.column.getCanSort() &&
                            header.column.id !== "select" && (
                              <span className="text-muted small">
                                {{
                                  asc: <ChevronUp size={14} />,
                                  desc: <ChevronDown size={14} />,
                                }[header.column.getIsSorted()] ?? (
                                    <ChevronsUpDown size={14} />
                                  )}
                              </span>
                            )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {ordersLoading ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-5 text-muted"
                    >
                      <Spinner
                        animation="border"
                        size="sm"
                        className="me-2"
                      />
                      Loading orders...
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-5 text-muted"
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        router.push(
                          `/orders/orderdetails?id=${row.original.id}`
                        )
                      }
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-3 py-2">
                          {flexRender(
                            cell.column.columnDef.cell ??
                            cell.column.columnDef.accessorKey,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-3">
            <PageSizeSelector
              table={table}
              pageSize={pagination.pageSize}
              total={table.getFilteredRowModel().rows.length}
            />

            <TablePagination table={table} pagination={pagination} />
          </div>
        </div>
      )}

      {view === "card" && (
        <>
          <section className="rounded-4">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
              <FilterGroup
                options={["All", "On Process", "Completed", "Cancelled"]}
                value={statusFilter}
                onChange={setStatusFilter}
                mode="card"
              />

              <div className="d-flex align-items-center gap-2">
                <Button
                  as={Link}
                  href="/orders/create"
                  variant="primary"
                  className="text-white rounded-3 px-3"
                >
                  New Order
                </Button>

                <ButtonGroup>
                  <Button
                    size="sm"
                    variant={view === "table" ? "primary" : "info"}
                    onClick={() => setView("table")}
                  >
                    <List
                      size={16}
                      className={
                        view === "table" ? "text-white" : "text-secondary"
                      }
                    />
                  </Button>

                  <Button
                    size="sm"
                    variant={view === "card" ? "primary" : "info"}
                    onClick={() => setView("card")}
                  >
                    <Grid
                      size={16}
                      className={
                        view === "card" ? "text-white" : "text-secondary"
                      }
                    />
                  </Button>
                </ButtonGroup>

                <Dropdown>
                  <Dropdown.Toggle
                    variant="light"
                    className="rounded-3 border-0 d-flex align-items-center gap-2 no-caret"
                  >
                    {dateFilter}
                    <ChevronDown size={16} />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      active={dateFilter === "This Week"}
                      onClick={() => setDateFilter("This Week")}
                    >
                      This Week
                    </Dropdown.Item>

                    <Dropdown.Item
                      active={dateFilter === "This Month"}
                      onClick={() => setDateFilter("This Month")}
                    >
                      This Month
                    </Dropdown.Item>

                    <Dropdown.Item
                      active={dateFilter === "This Year"}
                      onClick={() => setDateFilter("This Year")}
                    >
                      This Year
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

            {ordersError && (
              <Alert variant="danger" className="rounded-4">
                {ordersError}
              </Alert>
            )}

            {ordersLoading ? (
              <div className="text-center py-5 text-muted">
                <Spinner animation="border" size="sm" className="me-2" />
                Loading orders...
              </div>
            ) : paginatedCards.length === 0 ? (
              <div className="text-center py-5 text-muted">
                No orders found
              </div>
            ) : (
              <Row className="g-3">
                {paginatedCards.map((item) => (
                  <Order_Card
                    key={item.id}
                    item={item}
                    onDetails={() =>
                      router.push(`/orders/orderdetails?id=${item.id}`)
                    }
                  />
                ))}
              </Row>
            )}

            <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-3">
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted small">Show</span>

                <Form.Select
                  size="sm"
                  value={cardPagination.pageSize}
                  onChange={(e) => {
                    const size = Number(e.target.value);

                    setCardPagination((prev) => ({
                      ...prev,
                      pageSize: size,
                      pageIndex: 0,
                    }));
                  }}
                  style={{ width: "80px" }}
                >
                  <option value={6}>6</option>
                  <option value={9}>9</option>
                  <option value={12}>12</option>
                </Form.Select>

                <span className="text-muted small">
                  of {filteredCards.length}
                </span>
              </div>

              <CardPagination
                pageIndex={cardPagination.pageIndex}
                pageSize={cardPagination.pageSize}
                total={filteredCards.length}
                onPageChange={(index) =>
                  setCardPagination((prev) => ({
                    ...prev,
                    pageIndex: index,
                  }))
                }
              />
            </div>
          </section>
        </>
      )}
    </>
  );
}