"use client";

import dynamic from "next/dynamic";
import { Card, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { useMemo, useState, useEffect } from "react";
import { inventoryService } from "@/services/inventoryService";
import "@/styles/inventory/InventoryOverview.scss";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function InventoryOverview() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [stockHistory, setStockHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supplyFilter, setSupplyFilter] = useState("Last 8 Months");
  const [stockFilter, setStockFilter] = useState("This Month");

  useEffect(() => {
    const fetchLiveInventoryData = async () => {
      try {
        setLoading(true);
        const [itemsRes, historyRes] = await Promise.all([
          inventoryService.getInventoryItems(),
          inventoryService.getStockHistory(),
        ]);

        setInventoryItems(
          Array.isArray(itemsRes) ? itemsRes : itemsRes?.data || [],
        );
        setStockHistory(
          Array.isArray(historyRes) ? historyRes : historyRes?.data || [],
        );

      } catch (err) {
        setError(err.message || "Failed to load live database indicators.");
      } finally {
        setLoading(false);
      }
    };
    fetchLiveInventoryData();
  }, []);

  const dynamicChartData = useMemo(() => {
    if (!stockHistory.length) return [];

    const monthlyGroups = {};

    stockHistory.forEach((item) => {
      if (!item.created_at) return;

      const dateObj = new Date(item.created_at);
      const monthLabel = dateObj.toLocaleString("en-US", { month: "short" });
      const year = dateObj.getFullYear();
      const key = `${monthLabel} ${year}`;

      if (!monthlyGroups[key]) {
        monthlyGroups[key] = {
          label: monthLabel,
          value: 0,
          sortKey: dateObj.getTime(),
        };
      }

      const movementType = item.movement_type ? item.movement_type.trim() : "";
      if (movementType === "Stock In") {
        monthlyGroups[key].value += Number(item.quantity || 0);
      }
    });

    return Object.values(monthlyGroups).sort((a, b) => a.sortKey - b.sortKey);
  }, [stockHistory]);

  const filteredChartData = useMemo(() => {
    if (supplyFilter === "Last 6 Months") return dynamicChartData.slice(-6);
    if (supplyFilter === "Last 8 Months") return dynamicChartData.slice(-8);
    return dynamicChartData;
  }, [supplyFilter, dynamicChartData]);

  const totalInSupply = useMemo(() => {
    return filteredChartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [filteredChartData]);

  // 2. STOCK LEVEL STATUS: Database exact strings mapping ("Available", "Low Stock", "Out of Stock")
  const stockLevelMetrics = useMemo(() => {
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    inventoryItems.forEach((item) => {
      const status = item.stock_status?.trim();

      if (status === "Available") {
        inStock++;
      } else if (status === "Low Stock") {
        lowStock++;
      } else if (status === "Out of Stock") {
        outOfStock++;
      } else {
        const qty = Number(item.qty_in_stock || 0);
        const reorderQty = Number(item.qty_in_reorder || 0);
        if (qty === 0) outOfStock++;
        else if (qty <= reorderQty) lowStock++;
        else inStock++;
      }
    });

    return {
      total: inventoryItems.length,
      eventCounts: {
        Meetings: 0,
      },
    };
  }, [inventoryItems]);

  // Dynamic Event labels fallbacks logic
  const calculatedStockSummary = useMemo(() => {
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    inventoryItems.forEach((item) => {
      const status = item.stock_status?.trim();
      if (status === "Available") inStock++;
      else if (status === "Low Stock") lowStock++;
      else if (status === "Out of Stock") outOfStock++;
    });

    return [
      { label: "In Stock", value: inStock },
      { label: "Low Stock", value: lowStock },
      { label: "Out of Stock", value: outOfStock },
    ];
  }, [inventoryItems]);

  const stockBars = useMemo(() => {
    const totalBars = 24;
    const totalProducts = inventoryItems.length;
    const bars = [];
    if (!totalProducts) return bars;

    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    inventoryItems.forEach((item) => {
      const status = item.stock_status?.trim();
      if (status === "Available") inStock++;
      else if (status === "Low Stock") lowStock++;
      else outOfStock++;
    });

    const inStockBars = Math.round((inStock / totalProducts) * totalBars);
    const lowStockBars = Math.round((lowStock / totalProducts) * totalBars);
    const outOfStockBars = totalBars - inStockBars - lowStockBars;

    for (let i = 0; i < totalBars; i++) {
      if (i < inStockBars) bars.push({ id: i, type: "inStock" });
      else if (i < inStockBars + lowStockBars)
        bars.push({ id: i, type: "lowStock" });
      else bars.push({ id: i, type: "outOfStock" });
    }
    return bars;
  }, [inventoryItems]);

  const supplyChartOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "inherit",
      parentHeightOffset: 0,
    },
    colors: ["#FF6B1E"],
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.3,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },
    markers: {
      size: 4,
      colors: ["#FF6B1E"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6, strokeWidth: 3 },
    },
    grid: {
      borderColor: "#eeeeee",
      strokeDashArray: 0,
      padding: { left: 10, right: 18, top: 0, bottom: 0 },
    },
    xaxis: {
      categories: filteredChartData.map((item) => item.label),
      tickPlacement: "between",
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { offsetY: 2, style: { colors: "#8f8f8f", fontSize: "11px" } },
    },
    yaxis: {
      tickAmount: 4,
      labels: { offsetX: -15, style: { colors: "#8f8f8f", fontSize: "11px" } },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: { y: { formatter: (value) => `${value} Products` } },
  };

  const supplyChartSeries = [
    {
      name: "Products",
      data: filteredChartData.map((item) => item.value),
    },
  ];

  if (loading)
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner animation="border" variant="warning" />
      </div>
    );
  if (error)
    return (
      <Alert variant="danger" className="m-3">
        {error}
      </Alert>
    );

  return (
    <Row className="g-3 inventory-overview-row">
      <Col xs={12} xl={7} xxl={8}>
        <Card className="inventory-overview-card border-0">
          <Card.Body>
            <div className="overview-card-head d-flex align-items-center justify-content-between">
              <div>
                <p>Supply Overview</p>
                <h3>{totalInSupply.toLocaleString()}</h3>
              </div>
              <Form.Select
                className="overview-select shadow-none"
                value={supplyFilter}
                onChange={(e) => setSupplyFilter(e.target.value)}
              >
                <option>Last 8 Months</option>
                <option>Last 6 Months</option>
              </Form.Select>
            </div>
            <div className="supply-chart">
              {filteredChartData.length > 0 ? (
                <Chart
                  options={supplyChartOptions}
                  series={supplyChartSeries}
                  type="area"
                  height={165}
                />
              ) : (
                <div className="text-center py-5 text-muted small">
                  No stock movements history tracked yet.
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col xs={12} xl={5} xxl={4}>
        <Card className="inventory-overview-card stock-level-card border-0">
          <Card.Body>
            <div className="overview-card-head d-flex align-items-start justify-content-between">
              <div>
                <p className="mb-3">Stock Level</p>
                <h3>
                  {inventoryItems.length}
                  <span> Products</span>
                </h3>
              </div>
              <Form.Select
                className="overview-select shadow-none"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </Form.Select>
            </div>

            <div className="stock-bars">
              {stockBars.map((bar) => (
                <span key={bar.id} className={bar.type} />
              ))}
            </div>

            <div className="stock-legends d-flex align-items-center justify-content-between">
              {calculatedStockSummary.map((item, idx) => {
                const className =
                  item.label === "In Stock"
                    ? "inStock"
                    : item.label === "Low Stock"
                      ? "lowStock"
                      : "outOfStock";
                return (
                  <div key={idx}>
                    <span className={`dot ${className}`} />
                    <p>{item.label}</p>
                    <strong>{item.value} Products</strong>
                  </div>
                );
              })}
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
