"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import Chart from "react-apexcharts";

import {
  Container,
  Row,
  Col,
  Card,
  ProgressBar,
  Form,
  Button,
  Spinner,
  Dropdown,
  Modal,
} from "react-bootstrap";

import {
  StarFill,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChatLeftText,
} from "react-bootstrap-icons";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

// Services and Instances
import { reviewService } from "@/services/reviewService";
import { menuService } from "@/services/menuService";
import { customerService } from "@/services/customerService";

/* ==========================================================================
     PAGINATION COMPONENT
   ========================================================================== */
function TablePagination({ table, pagination }) {
  const totalPages = table.getPageCount();
  const currentPage = pagination.pageIndex + 1;
  let pages = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages = [1];
    if (currentPage > 3) pages.push("dots-left");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("dots-right");
    pages.push(totalPages);
  }

  return (
    <div className="d-flex align-items-center gap-2 flex-wrap">
      <Button
        size="sm"
        variant="light"
        className="rounded-3 px-3 py-2 border"
        onClick={() => table.setPageIndex(Math.max(pagination.pageIndex - 1, 0))}
        disabled={pagination.pageIndex === 0}
      >
        <ChevronLeft />
      </Button>

      {pages.map((page, index) => {
        if (page === "dots-left" || page === "dots-right") {
          return <span key={`dots-${index}`} className="px-2 text-muted">...</span>;
        }
        const pageIndex = page - 1;
        return (
          <Button
            key={`${page}-${index}`}
            size="sm"
            className={`rounded-3 px-3 py-2 border ${pagination.pageIndex === pageIndex ? "text-white" : "text-dark"}`}
            variant={pagination.pageIndex === pageIndex ? "primary" : "light"}
            onClick={() => table.setPageIndex(pageIndex)}
          >
            {page}
          </Button>
        );
      })}

      <Button
        size="sm"
        variant="light"
        className="rounded-3 px-3 py-2 border"
        onClick={() => table.setPageIndex(Math.min(pagination.pageIndex + 1, totalPages - 1))}
        disabled={pagination.pageIndex >= totalPages - 1}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}

/* ==========================================================================
     MAIN DASHBOARD COMPONENT
   ========================================================================== */
export default function ReviewsPage() {
  const [dbCategories, setDbCategories] = useState([]);
  const [dbMenuItems, setDbMenuItems] = useState([]);
  const [dbCustomers, setDbCustomers] = useState([]); // Master customers list holder

  // Default values mapping to Figma design template
  const [ratingSummary, setRatingSummary] = useState({
    period: "This Month",
    averageRating: "4.7",
    totalReviews: 350,
    foodQuality: 4.8,
    service: 4.6,
    ambiance: 4.7,
    valueForMoney: 4.5,
    cleanliness: 4.5
  });

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartReviews, setChartReviews] = useState([]);

  // Dropdown Filter States
  const [selectedRating, setSelectedRating] = useState("All Rating");
  const [selectedCategory, setSelectedCategory] = useState("All Category");
  const [selectedMenu, setSelectedMenu] = useState("All Menu");
  const [targetMenuId, setTargetMenuId] = useState(null);

  // Table Specific Timeline Dropdown Filter State (Add Review ke baaju waala)
  const [tableTimeFilter, setTableTimeFilter] = useState("This Year");

  // Pagination State
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4,
  });

  // Analytics Filter States
  const [reviewStatisticsFilter, setReviewStatisticsFilter] = useState("This Year");
  const [ratingPeriodFilter, setRatingPeriodFilter] = useState("This Month");

  // Modal State for Add Review Form
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: "",
    menu_id: "",
    rating: 5,
    comment: "",
    food_quality: 5,
    service: 5,
    ambiance: 5,
    value_for_money: 5,
    cleanliness: 5,
  });

  /* ==========================================================================
       DYNAMIC TIMELINE CHART MATRICES PREPARATION
     ========================================================================== */
  const reviewChartData = useMemo(() => {
    const now = new Date();

    if (reviewStatisticsFilter === "This Week") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const currentDay = now.getDay();
      const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
      const monday = new Date(now);
      monday.setDate(now.getDate() + distanceToMonday);
      monday.setHours(0, 0, 0, 0);

      return days.map((label, index) => {
        const start = new Date(monday);
        start.setDate(monday.getDate() + index);
        const end = new Date(start);
        end.setDate(start.getDate() + 1);

        const filteredReviews = chartReviews.filter((review) => {
          const d = new Date(review.created_at);
          return d >= start && d < end;
        });

        return {
          label,
          positiveReview: filteredReviews.filter((r) => r.review_type === "Positive" || Number(r.rating) >= 4).length,
          negativeReview: filteredReviews.filter((r) => r.review_type === "Negative" || Number(r.rating) <= 2).length,
        };
      });
    }

    if (reviewStatisticsFilter === "This Month") {
      const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
      return weeks.map((label, index) => {
        const startDate = index * 7 + 1;
        const endDate = index === 4 ? 31 : startDate + 6;

        const filteredReviews = chartReviews.filter((review) => {
          const date = new Date(review.created_at);
          return (
            date.getFullYear() === now.getFullYear() &&
            date.getMonth() === now.getMonth() &&
            date.getDate() >= startDate &&
            date.getDate() <= endDate
          );
        });

        return {
          label,
          positiveReview: filteredReviews.filter((r) => r.review_type === "Positive" || Number(r.rating) >= 4).length,
          negativeReview: filteredReviews.filter((r) => r.review_type === "Negative" || Number(r.rating) <= 2).length,
        };
      });
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map((label, monthIndex) => {
      const filteredReviews = chartReviews.filter((review) => {
        const date = new Date(review.created_at);
        return date.getFullYear() === now.getFullYear() && date.getMonth() === monthIndex;
      });

      return {
        label,
        positiveReview: filteredReviews.filter((r) => r.review_type === "Positive" || Number(r.rating) >= 4).length,
        negativeReview: filteredReviews.filter((r) => r.review_type === "Negative" || Number(r.rating) <= 2).length,
      };
    });
  }, [chartReviews, reviewStatisticsFilter]);

  /* ==========================================================================
       DATA FETCH & SYNC LIFECYCLE HANDLERS
     ========================================================================== */
  const loadMasterLists = async () => {
    try {
      const [categoriesRes, itemsRes, customersRes] = await Promise.all([
        menuService.getMenuCategories(),
        menuService.getMenuItems(),
        customerService.getCustomers()
      ]);
      if (categoriesRes?.data) setDbCategories(categoriesRes.data);
      if (itemsRes?.data) setDbMenuItems(itemsRes.data);
      if (customersRes?.data) setDbCustomers(customersRes.data);
    } catch (err) {
      console.error("Master lists loading error:", err);
    }
  };

  const syncDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      await loadMasterLists();

      let responseDataList = [];

      if (targetMenuId) {
        const menuSpecificData = await reviewService.getReviewsByMenu(targetMenuId);
        responseDataList = menuSpecificData?.data || [];
      } else {
        const fallbackList = await reviewService.getReviewsList();
        responseDataList = fallbackList?.data || [];
      }

      setChartReviews(responseDataList);

      let ratingData = [...responseDataList];

      const now = new Date();

      if (ratingPeriodFilter === "This Week") {
        const currentDay = now.getDay();
        const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;

        const monday = new Date(now);
        monday.setDate(now.getDate() + distanceToMonday);
        monday.setHours(0, 0, 0, 0);

        const nextMonday = new Date(monday);
        nextMonday.setDate(monday.getDate() + 7);

        ratingData = ratingData.filter((r) => {
          const date = new Date(r.created_at);
          return date >= monday && date < nextMonday;
        });
      }

      else if (ratingPeriodFilter === "This Month") {
        ratingData = ratingData.filter((r) => {
          const date = new Date(r.created_at);
          return (
            date.getFullYear() === now.getFullYear() &&
            date.getMonth() === now.getMonth()
          );
        });
      }

      else if (ratingPeriodFilter === "This Year") {
        ratingData = ratingData.filter((r) => {
          const date = new Date(r.created_at);
          return date.getFullYear() === now.getFullYear();
        });
      }

      if (ratingData.length > 0) {
        const totalReviews = ratingData.length;

        setRatingSummary({
          averageRating: (
            ratingData.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
            totalReviews
          ).toFixed(1),

          totalReviews,

          foodQuality: (
            ratingData.reduce((sum, r) => sum + Number(r.food_quality || 0), 0) /
            totalReviews
          ).toFixed(1),

          service: (
            ratingData.reduce((sum, r) => sum + Number(r.service || 0), 0) /
            totalReviews
          ).toFixed(1),

          ambiance: (
            ratingData.reduce((sum, r) => sum + Number(r.ambiance || 0), 0) /
            totalReviews
          ).toFixed(1),

          valueForMoney: (
            ratingData.reduce((sum, r) => sum + Number(r.value_for_money || 0), 0) /
            totalReviews
          ).toFixed(1),

          cleanliness: (
            ratingData.reduce((sum, r) => sum + Number(r.cleanliness || 0), 0) /
            totalReviews
          ).toFixed(1),

          period: ratingPeriodFilter,
        });
      }


      if (responseDataList.length > 0) {
        const totalReviews = responseDataList.length;

        const averageRating = (
          responseDataList.reduce(
            (sum, review) => sum + Number(review.rating || 0),
            0
          ) / totalReviews
        ).toFixed(1);

        const foodQuality = (
          responseDataList.reduce(
            (sum, review) => sum + Number(review.food_quality || 0),
            0
          ) / totalReviews
        ).toFixed(1);

        const service = (
          responseDataList.reduce(
            (sum, review) => sum + Number(review.service || 0),
            0
          ) / totalReviews
        ).toFixed(1);

        const ambiance = (
          responseDataList.reduce(
            (sum, review) => sum + Number(review.ambiance || 0),
            0
          ) / totalReviews
        ).toFixed(1);

        const valueForMoney = (
          responseDataList.reduce(
            (sum, review) => sum + Number(review.value_for_money || 0),
            0
          ) / totalReviews
        ).toFixed(1);

        const cleanliness = (
          responseDataList.reduce(
            (sum, review) => sum + Number(review.cleanliness || 0),
            0
          ) / totalReviews
        ).toFixed(1);

        setRatingSummary({
          averageRating,
          totalReviews,
          foodQuality,
          service,
          ambiance,
          valueForMoney,
          cleanliness,
          period: ratingPeriodFilter,
        });
      }

      let processedList = [...responseDataList];

      // Filters check
      if (selectedRating !== "All Rating") {
        const matchStar = parseInt(selectedRating);
        processedList = processedList.filter((r) => Math.floor(r.rating) === matchStar);
      }

      if (selectedCategory !== "All Category") {
        processedList = processedList.filter((r) => r.category_name === selectedCategory || r.category === selectedCategory);
      }

      if (tableTimeFilter === "This Week") {
        const currentDay = now.getDay();
        const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
        const monday = new Date(now);
        monday.setDate(now.getDate() + distanceToMonday);
        monday.setHours(0, 0, 0, 0);

        const nextMonday = new Date(monday);
        nextMonday.setDate(monday.getDate() + 7);

        processedList = processedList.filter((r) => {
          const rDate = new Date(r.created_at);
          return rDate >= monday && rDate < nextMonday;
        });
      } else if (tableTimeFilter === "This Month") {
        processedList = processedList.filter((r) => {
          const rDate = new Date(r.created_at);
          return rDate.getFullYear() === now.getFullYear() && rDate.getMonth() === now.getMonth();
        });
      } else if (tableTimeFilter === "This Year") {
        processedList = processedList.filter((r) => {
          const rDate = new Date(r.created_at);
          return rDate.getFullYear() === now.getFullYear();
        });
      }

      setReviews(processedList);
    } catch (error) {
      console.error("Database querying sync error:", error);
    } finally {
      setLoading(false);
    }
  }, [targetMenuId, selectedRating, selectedCategory, ratingPeriodFilter, tableTimeFilter]);

  useEffect(() => {
    syncDashboardData();
  }, [syncDashboardData]);

  /* ==========================================================================
       ADD NEW REVIEW FORM SUBMITTER
     ========================================================================== */
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "comment" || name === "review_type" ? value : Number(value)
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_id) {
      alert("Please select a customer first.");
      return;
    }
    if (!formData.menu_id) {
      alert("Please select a menu item before saving.");
      return;
    }
    try {
      setLoading(true);
      await reviewService.createReview(formData);
      setShowAddModal(false);
      setFormData({
        customer_id: "",
        menu_id: "",
        rating: 5,
        comment: "",
        food_quality: 5,
        service: 5,
        ambiance: 5,
        value_for_money: 5,
        cleanliness: 5,
      });
      await syncDashboardData();
    } catch (err) {
      console.error("Failed to append current evaluation entry row:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================================
       CHART LOGIC
     ========================================================================== */
  const reviewChart = useMemo(() => {
    return {
      series: [
        { name: "Positive Review", data: reviewChartData.map((item) => item.positiveReview) },
        { name: "Negative Review", data: reviewChartData.map((item) => item.negativeReview) },
      ],
      options: {
        chart: { type: "bar", toolbar: { show: false } },
        plotOptions: {
          bar: { horizontal: false, columnWidth: "40%", borderRadius: 4 },
        },
        colors: ["#ff6b1a", "#2d2d2d"],
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ["transparent"] },
        xaxis: { categories: reviewChartData.map((item) => item.label) },
        yaxis: { min: 0 },
        legend: { show: false },
        tooltip: { shared: true, intersect: false },
      },
    };
  }, [reviewChartData]);

  /* ==========================================================================
       TABLE STRUCTURAL BUILD
     ========================================================================== */
  const columns = useMemo(
    () => [
      {
        accessorKey: "itemName",
        cell: ({ row, table }) => {
          const item = row.original;
          const allFetchedReviews = table.options.data || [];
          const currentMenuId = item.menu_id;

          const siblingReviews = allFetchedReviews.filter((r) => r.menu_id === currentMenuId);
          const displayReviewsCount = item.totalReviews || siblingReviews.length || 1;

          const displayOverallRate = useMemo(() => {
            if (item.overallRate) return Number(item.overallRate).toFixed(1);
            if (siblingReviews.length === 0) return "0.0";
            const totalScore = siblingReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
            return (totalScore / siblingReviews.length).toFixed(1);
          }, [siblingReviews, item.overallRate]);

          const menuTitle = item.menu_name || item.name || "Tasty Dish Item";
          const subCategory = item.category_name || "General";
          const feedbackText = item.comment || item.reviewText || "No review content text.";
          const clientSignature = item.customer_name || item.full_name || `Customer #${item.customer_id}`;

          const localizedDate = useMemo(() => {
            const rawDate = item.created_at || item.reviewDate;
            if (!rawDate) return "Recent";
            const dateObj = new Date(rawDate);
            if (isNaN(dateObj.getTime())) return "Recent";
            return dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
          }, [item.created_at, item.reviewDate]);

          return (
            <div className="py-3 border-bottom">
              <Row className="g-4 align-items-start">
                <Col lg={3}>
                  <div className="d-flex gap-3">
                    <img
                      src={item.image_url || item.image || item.menu_image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=60"}
                      alt={menuTitle}
                      className="rounded-4 bg-secondary-subtle flex-shrink-0 object-cover"
                      style={{ width: "92px", height: "92px", objectFit: "cover" }}
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=60"; }}
                    />
                    <div>
                      <h5 className="fw-semibold mb-1">{menuTitle}</h5>
                      <small className="text-muted d-block mb-3">{subCategory}</small>
                      <div className="small text-muted d-flex flex-column gap-1">
                        <span><ChatLeftText size={12} className="me-2" />{displayReviewsCount} Reviews</span>
                        <span><Star size={12} className=" me-2" />{displayOverallRate} Overall Rate</span>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col lg={9}>
                  <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
                    <div className="d-flex gap-1 text-warning">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarFill key={star} size={13} opacity={star <= Math.floor(item.rating) ? 1 : 0.2} />
                      ))}
                    </div>
                    <small className="fw-semibold">
                      {item.rating ? `${Number(item.rating).toFixed(item.rating % 1 === 0 ? 0 : 1)}/5` : "5/5"}
                    </small>
                    <small className="text-muted">• {localizedDate}</small>
                  </div>
                  <p className="text-muted mb-4" style={{ lineHeight: "1.8" }}>{feedbackText}</p>
                  <h6 className="fw-semibold mb-0">{clientSignature}</h6>
                </Col>
              </Row>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: reviews,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Container fluid className="p-3 p-lg-4">
      {/* METRICS & OVERVIEW SECTION */}
      <Row className="g-4 mb-4">
        {/* RATINGS */}
        <Col xl={5}>
          <Card className="border-0 rounded-4 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-5">
                <h5 className="fw-semibold mb-0">Ratings</h5>

                <Dropdown onSelect={(val) => setRatingPeriodFilter(val)}>
                  <Dropdown.Toggle variant="light" size="sm" bsPrefix=" " className="rounded-3 border-0 shadow-none">
                    {ratingPeriodFilter} <ChevronDown size={12} className="ms-1" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {["This Week", "This Month", "This Year"].map((p) => (
                      <Dropdown.Item key={p} eventKey={p}>{p}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              <Row className="align-items-center">
                <Col md={5}>
                  <div className="bg-dark bg-opacity-10 rounded-4 text-center p-4 h-100 d-flex flex-column justify-content-center">
                    <h1 className="fw-bold mb-2" style={{ fontSize: "65px" }}>{ratingSummary.averageRating}</h1>
                    <div className="d-flex justify-content-center gap-1 text-warning mb-2">
                      {[1, 2, 3, 4, 5].map((item) => <StarFill key={item} size={16} />)}
                    </div>
                    <small className="text-muted">{ratingSummary.totalReviews} Reviews</small>
                  </div>
                </Col>

                <Col md={7}>
                  <div className="d-flex flex-column gap-4">
                    {["Food Quality", "Service", "Ambiance", "Value for Money", "Cleanliness"].map((label, idx) => {
                      const keys = ["foodQuality", "service", "ambiance", "valueForMoney", "cleanliness"];
                      const score = ratingSummary[keys[idx]] || 0;
                      return (
                        <div key={label}>
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted fw-medium">{label}</small>
                            <small className="fw-semibold">{score}</small>
                          </div>
                          <ProgressBar now={score * 20} variant="primary" style={{ height: "6px", borderRadius: "20px" }} />
                        </div>
                      );
                    })}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* REVIEW STATISTICS */}
        <Col xl={7}>
          <Card className="border-0 rounded-4 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-semibold mb-0">Review Statistics</h5>
                <Dropdown onSelect={(val) => setReviewStatisticsFilter(val)}>
                  <Dropdown.Toggle variant="light" size="sm" bsPrefix=" " className="rounded-3 border-0 shadow-none">
                    {reviewStatisticsFilter} <ChevronDown size={13} className="ms-1" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {["This Week", "This Month", "This Year"].map((item) => (
                      <Dropdown.Item key={item} eventKey={item}>{item}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              <div className="d-flex gap-4 mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff6b1a" }} />
                  <span>Positive Review</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#2d2d2d" }} />
                  <span>Negative Review</span>
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <div style={{ minWidth: "550px" }}>
                  <Chart options={reviewChart.options} series={reviewChart.series} type="bar" height={250} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* REVIEWS GRID LAYOUT WITH INTERACTIVE FILTERS */}
      <Card className="border-0 rounded-4 shadow-sm">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
            <div className="d-flex flex-wrap gap-2">
              <Dropdown onSelect={(val) => setSelectedRating(val)}>
                <Dropdown.Toggle variant="light" className="rounded-3 border d-flex align-items-center gap-2" bsPrefix=" ">
                  <StarFill size={12} className="text-warning" /> {selectedRating} <ChevronDown size={12} className="ms-1" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="All Rating">All Rating</Dropdown.Item>
                  {["5 Star", "4 Star", "3 Star", "2 Star", "1 Star"].map((s) => (
                    <Dropdown.Item key={s} eventKey={s}>{s}s</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown onSelect={(val) => setSelectedCategory(val)}>
                <Dropdown.Toggle variant="light" className="rounded-3 border" bsPrefix=" ">
                  {selectedCategory} <ChevronDown size={12} className="ms-2" />
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ maxHeight: "250px", overflowY: "auto" }}>
                  <Dropdown.Item eventKey="All Category">All Category</Dropdown.Item>
                  {dbCategories.filter((cat) => cat.is_active === true).map((cat) => (
                    <Dropdown.Item key={cat.category_id || cat.id} eventKey={cat.category_name}>{cat.category_name}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown onSelect={(val) => {
                if (val === "All Menu") {
                  setSelectedMenu("All Menu");
                  setTargetMenuId(null);
                } else {
                  const dataObj = JSON.parse(val);
                  setSelectedMenu(dataObj.name);
                  setTargetMenuId(dataObj.id);
                }
              }}>
                <Dropdown.Toggle variant="light" className="rounded-3 border" bsPrefix=" ">
                  {selectedMenu} <ChevronDown size={12} className="ms-2" />
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ maxHeight: "250px", overflowY: "auto" }}>
                  <Dropdown.Item eventKey="All Menu">All Menu</Dropdown.Item>
                  {dbMenuItems.map((item) => (
                    <Dropdown.Item key={item.menu_id || item.id} eventKey={JSON.stringify({ id: item.menu_id || item.id, name: item.name })}>{item.name}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {/* STACK BAR: ADD REVIEW BUTTON + TIME DROPDOWN */}
            <div className="d-flex align-items-center gap-2">
              <Button variant="primary" className="rounded-3 d-flex align-items-center gap-2 px-3 text-white fw-medium" onClick={() => setShowAddModal(true)}>
                Add Review
              </Button>

              <Dropdown onSelect={(val) => setTableTimeFilter(val)}>
                <Dropdown.Toggle variant="light" className="rounded-3 border" bsPrefix=" ">
                  {tableTimeFilter} <ChevronDown size={12} className="ms-2" />
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item eventKey="This Year">This Year</Dropdown.Item>
                  <Dropdown.Item eventKey="This Month">This Month</Dropdown.Item>
                  <Dropdown.Item eventKey="This Week">This Week</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          {loading && reviews.length === 0 ? (
            <div className="text-center py-5">
              <Spinner animation="grow" size="sm" className="me-2" />
              <small className="text-muted">Loading live reviews analytics...</small>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-5 text-muted border border-dashed rounded-4">No matching feedback reviews found.</div>
          ) : (
            <div>
              {table.getRowModel().rows.map((row) => (
                <div key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <div key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                  ))}
                </div>
              ))}
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4">
            <div className="d-flex align-items-center gap-2 text-muted">
              <span>Showing</span>
              <Form.Select size="sm" className="rounded-3" style={{ width: "70px" }} value={pagination.pageSize} onChange={(e) => table.setPageSize(Number(e.target.value))}>
                <option value={4}>4</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
              </Form.Select>
              <span>out of {reviews.length} entries</span>
            </div>
            <TablePagination table={table} pagination={pagination} />
          </div>
        </Card.Body>
      </Card>

      {/* ==========================================================================
           DYNAMIC COMPATIBLE MODAL FORM PANEL (SQL BOUND)
         ========================================================================== */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered className="rounded-4">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Write a Review</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFormSubmit}>
          <Modal.Body className="pt-3">
            <Row className="g-3">

              {/* Customers dropdown populated cleanly via customerService */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-semibold">Select Customer</Form.Label>
                  <Form.Select name="customer_id" required value={formData.customer_id} onChange={handleFormChange} className="rounded-3">
                    <option value="">Choose Customer...</option>
                    {dbCustomers.map((cust) => (
                      <option key={cust.customer_id || cust.id} value={cust.customer_id || cust.id}>
                        {cust.full_name || cust.customer_name || cust.name || `User #${cust.customer_id}`}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-semibold">Select Dish Item</Form.Label>
                  <Form.Select name="menu_id" required value={formData.menu_id} onChange={handleFormChange} className="rounded-3">
                    <option value="">Choose Food...</option>
                    {dbMenuItems.map((item) => (
                      <option key={item.menu_id || item.id} value={item.menu_id || item.id}>{item.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-semibold">Overall Rating</Form.Label>
                  <Form.Select name="rating" value={formData.rating} onChange={handleFormChange} className="rounded-3">
                    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>



              {/* Criteria Sliders */}
              {["food_quality", "service", "ambiance", "value_for_money", "cleanliness"].map((field) => (
                <Col md={6} key={field}>
                  <Form.Group>
                    <Form.Label className="small text-muted fw-semibold text-capitalize">{field.replace(/_/g, " ")}</Form.Label>
                    <Form.Select name={field} value={formData[field]} onChange={handleFormChange} className="rounded-3">
                      {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n}/5</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
              ))}

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-semibold">Customer Comments</Form.Label>
                  <Form.Control as="textarea" rows={3} name="comment" value={formData.comment} onChange={handleFormChange} placeholder="Share your experience with this food..." className="rounded-3" />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button variant="light" onClick={() => setShowAddModal(false)} className="rounded-3">Cancel</Button>
            <Button variant="primary" type="submit" className="rounded-3 text-white px-4">Submit Review</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}