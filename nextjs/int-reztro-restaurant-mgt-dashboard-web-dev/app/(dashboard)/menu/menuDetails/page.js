"use client";

import dynamic from "next/dynamic";
import { Card, Button, Row, Col, Container, Form } from "react-bootstrap";
import "@/styles/menu/menu-Details/menuDetail.scss";
import {
  Basket,
  Bookmark,
  ChatLeftText,
  PencilSquare,
  Share,
  StarFill,
  ThreeDots,
} from "react-bootstrap-icons";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useMenuDetails } from "@/hooks/useMenuDetails";
import { menuService } from "@/services/menuService";
import { useRouter } from "next/navigation";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function MenuDetailsPage() {
  const [id, setId] = useState(null);
  const [orderFilter, setOrderFilter] = useState("This Week");
  const [liveChartData, setLiveChartData] = useState([]);

  const { menuDetails, menuLoading, menuError, reviews } = useMenuDetails(id);

  const [similarMenuItems, setSimilarMenuItems] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setId(params.get("id"));
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchOverviewData = async () => {
      try {
        // Dropdown ki value ke hisaab se API ka filter param decide kar rahe hain
        const queryParam =
          orderFilter === "This Week"
            ? "week"
            : orderFilter === "This Month"
              ? "month"
              : "year";

        // Yahan par humari update ki hui service call ho rahi hai
        const response = await menuService.getMenuOrderOverview(id, queryParam);

        const rawData = response?.data?.data || response?.data || [];

        if (Array.isArray(rawData) && rawData.length > 0) {
          setLiveChartData(rawData);
        } else {
          // Fallback data agar API empty array bheje
          setLiveChartData([
            { label: "Mon", total_orders: 12 },
            { label: "Tue", total_orders: 18 },
            { label: "Wed", total_orders: 8 },
            { label: "Thu", total_orders: 15 },
            { label: "Fri", total_orders: 10 },
            { label: "Sat", total_orders: 7 },
            { label: "Sun", total_orders: 14 },
          ]);
        }
      } catch (err) {
        console.error("Failed to load database overview chart details:", err);
        // Error aane par dummy data
        setLiveChartData([
          { label: "Mon", total_orders: 5 },
          { label: "Tue", total_orders: 10 },
          { label: "Wed", total_orders: 15 },
          { label: "Thu", total_orders: 9 },
          { label: "Fri", total_orders: 11 },
          { label: "Sat", total_orders: 19 },
          { label: "Sun", total_orders: 13 },
        ]);
      }
    };

    fetchOverviewData();
  }, [id, orderFilter]);

  useEffect(() => {
    if (!menuDetails?.category || !menuDetails?.id) return;

    const fetchSimilarMenus = async () => {
      try {
        const response = await menuService.getMenuItems();

        const data =
          response?.data?.data ||
          response?.data?.menu_items ||
          response?.data ||
          response?.menu_items ||
          response ||
          [];

        const currentCategories = String(menuDetails.category)
          .split(",")
          .map((item) => item.trim().toLowerCase())
          .filter(Boolean);

        const similar = Array.isArray(data)
          ? data
            .filter((item) => {
              const itemId = item.menu_id || item.id;

              const itemCategories = String(
                item.category_names ||
                item.category_name ||
                item.category ||
                "",
              )
                .split(",")
                .map((cat) => cat.trim().toLowerCase())
                .filter(Boolean);

              return (
                itemId !== menuDetails.id &&
                itemCategories.some((cat) => currentCategories.includes(cat))
              );
            })
            .slice(0, 4)
            .map((item) => ({
              id: item.menu_id || item.id,
              title: item.name || "",
              category:
                item.category_names ||
                item.category_name ||
                item.category ||
                "",
              image: item.image_url || item.image || "",
              rating: Number(item.rating || 0),
              price: Number(item.price || 0),
            }))
          : [];

        setSimilarMenuItems(similar);
      } catch (error) {
        setSimilarMenuItems([]);
      }
    };

    fetchSimilarMenus();
  }, [menuDetails?.category, menuDetails?.id]);

  // Data processing for Month (Week 1, Week 2...) and passthrough for Week/Year
  const processedChartData = useMemo(() => {
    if (orderFilter === "This Month" && liveChartData?.length > 0) {
      const weeks = [
        { label: "Week 1", total_orders: 0 },
        { label: "Week 2", total_orders: 0 },
        { label: "Week 3", total_orders: 0 },
        { label: "Week 4", total_orders: 0 },
        { label: "Week 5", total_orders: 0 },
      ];

      liveChartData.forEach((item) => {
        const day = parseInt(item.label || item.day || "0", 10);
        const orders = item.total_orders || item.value || 0;

        if (day >= 1 && day <= 7) weeks[0].total_orders += orders;
        else if (day >= 8 && day <= 14) weeks[1].total_orders += orders;
        else if (day >= 15 && day <= 21) weeks[2].total_orders += orders;
        else if (day >= 22 && day <= 28) weeks[3].total_orders += orders;
        else if (day >= 29 && day <= 31) weeks[4].total_orders += orders;
      });

      return weeks;
    }
    return liveChartData || [];
  }, [liveChartData, orderFilter]);

  const orderChartOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        toolbar: { show: false },
        fontFamily: "inherit",
      },
      plotOptions: {
        bar: {
          columnWidth: "42%",
          borderRadius: 9,
          colors: {
            backgroundBarColors: ["#FDE8D7"],
            backgroundBarOpacity: 1,
            backgroundBarRadius: 9,
          },
        },
      },
      colors: ["#FF6422"],
      dataLabels: {
        enabled: true,
        offsetY: 10,
        style: {
          fontSize: "10px",
          fontWeight: 400,
          colors: ["#fff"],
        },
        formatter: (value) => value,
      },
      grid: {
        show: false,
        padding: {
          top: 0,
          right: -8,
          bottom: 0,
          left: -8,
        },
      },
      xaxis: {
        categories: processedChartData.map(
          (item) => item.label || item.day || item.date || "",
        ),
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: {
            fontSize: "9px",
            colors: "#8f8f8f",
          },
        },
      },
      yaxis: {
        show: true,
        min: 0,
        max: Math.max(...processedChartData.map((o) => o.total_orders || o.value || 0), 20),
        tickAmount: 4,
        labels: {
          offsetX: -8,
          style: {
            fontSize: "9px",
            colors: "#8f8f8f",
          },
          formatter: (value) => Math.round(value),
        },
      },
      tooltip: { enabled: false },
      legend: { show: false },
      states: {
        hover: { filter: { type: "none" } },
        active: { filter: { type: "none" } },
      },
    }),
    [processedChartData],
  );

  const orderChartSeries = useMemo(
    () => [
      {
        name: "Orders",
        data: processedChartData.map((item) => item.total_orders || item.value || 0),
      },
    ],
    [processedChartData],
  );

  if (!id) return <p>Loading menu details...</p>;
  if (menuLoading) return <p>Loading menu details...</p>;
  if (menuError) return <p>{menuError}</p>;
  if (!menuDetails) return <p>Menu not found</p>;

  return (
    <Container fluid className="menu-details-page">
      <Row className="gx-4 gy-4">
        <Col xs={12} xl={7} xxl={8}>
          <Card className="details-card border-0">
            <Card.Body>
              {menuDetails.image ? (
                <Card.Img
                  src={menuDetails.image}
                  alt={menuDetails.name}
                  className="menu-image img-fluid"
                />
              ) : (
                <div className="menu-image-placeholder" />
              )}

              <Row className="align-items-start justify-content-between mt-2 g-3">
                <Col xs={12} md="auto">
                  <h2>{menuDetails.name}</h2>

                  <div className="category">
                    {menuDetails.category}

                    <div className="tag-list">
                      {(Array.isArray(menuDetails.tags)
                        ? menuDetails.tags
                        : [menuDetails.tags]
                      )
                        .filter(Boolean)
                        .map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                    </div>
                  </div>
                </Col>

                <Col xs={12} md="auto">
                  <div className="price-actions justify-content-between">
                    <p>${Number(menuDetails.price || 0).toFixed(2)}</p>

                    <div className="d-flex align-items-center gap-2">
                      <Button
                        type="button"
                        className="price-icon-btn"
                        aria-label="share"
                      >
                        <Share />
                      </Button>

                      <Button
                        type="button"
                        className="price-icon-btn"
                        aria-label="bookmark"
                      >
                        <Bookmark />
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className="g-3 align-items-start mt-2">
                <Col xs={12} md={8}>
                  <div className="meta-row d-flex justify-content-between gap-2 mb-3">
                    <div className="d-flex flex-wrap align-items-center gap-1">
                      <p>
                        <StarFill className="meta-star-icon" />{" "}
                        <span>{menuDetails.rating}</span>/5
                      </p>
                      <p>Rating</p>
                    </div>

                    <p className="d-flex flex-wrap align-items-center gap-1">
                      <ChatLeftText /> <span>{menuDetails.reviews}</span>{" "}
                      Reviews
                    </p>

                    <p className="d-flex flex-wrap align-items-center gap-1">
                      <Basket /> <span>{menuDetails.orders}</span> Orders
                    </p>

                    <p className="d-flex flex-wrap align-items-center gap-1">
                      <Bookmark /> <span>{menuDetails.favorites}</span>{" "}
                      Favorites
                    </p>
                  </div>

                  <p className="fs-12 fw-semibold mb-1">Description</p>
                  <p className="description">{menuDetails.description}</p>

                  <p className="fs-12 fw-semibold mb-1">Values</p>
                  <div className="values d-flex flex-wrap">
                    {(menuDetails.values || []).map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>

                  <Row className="nutrition g-0">
                    {(menuDetails.nutrition || []).map((item) => (
                      <Col xs={6} sm={3} key={item.label}>
                        <small>{item.label}</small>
                        <p>
                          <strong>{item.value}</strong> {item.unit}
                        </p>
                      </Col>
                    ))}
                  </Row>
                </Col>

                <Col xs={12} md={4}>
                  <Card className="ingredients-card border-0">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <p className="fs-16 p-0 m-0 lh-1">Ingredients</p>
                        <span>
                          <ThreeDots />
                        </span>
                      </div>

                      <ul>
                        {(menuDetails.ingredients || []).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </Card.Body>
                  </Card>

                  <Link
                    href={`/menu/edit?id=${menuDetails.id}`}
                    className="edit-btn w-100 d-flex justify-content-center align-items-center gap-2 text-decoration-none"
                  >
                    <span className="edit-btn-icon">
                      <PencilSquare />
                    </span>

                    <span className="edit-btn-text">Edit Menu</span>
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <section className="reviews-section">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Reviews</h4>

              <span
                style={{ cursor: "pointer", color: "#ff6b1a" }}
                onClick={() => router.push("/reviews")}
              >
                See More Reviews
              </span>
            </div>

            <div className="review-slider d-flex">
              {reviews.map((review) => (
                <Card className="review-card border-0" key={review.id}>
                  <Card.Body>
                    <div className="review-head d-flex">
                      {review.image ? (
                        <Card.Img
                          src={review.image}
                          alt={review.name}
                          className="avatar img-fluid"
                        />
                      ) : (
                        <div className="avatar-placeholder" />
                      )}

                      <div>
                        <strong className="fw-medium">{review.name}</strong>
                        <small> - {review.date}</small>

                        <div>
                          {"★".repeat(review.rating)}
                          <span>{review.rating}</span>
                        </div>
                      </div>
                    </div>

                    <p>{review.text}</p>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </section>
        </Col>

        <Col xs={12} xl={5} xxl={4}>
          <Card className="overview-card border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center gap-3">
                <h4>Orders Overview</h4>

                <Form.Select
                  className="chart-filter-select shadow-none"
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                >
                  <option value="This Week">This Week</option>
                  <option value="This Month">This Month</option>
                  <option value="This Year">This Year</option>
                </Form.Select>
              </div>

              <div className="orders-chart">
                <Chart
                  options={orderChartOptions}
                  series={orderChartSeries}
                  type="bar"
                  height={167}
                />
              </div>
            </Card.Body>
          </Card>

          <div className="similar-head mt-3 d-flex justify-content-between align-items-center">
            <h4>Similar Menu</h4>
            <span>•••</span>
          </div>

          <Row className="g-3 similar-slider ">
            {similarMenuItems.length > 0 ? (
              similarMenuItems.map((item) => (
                <Col xs={6} className="similar-slide" key={item.id}>
                  <Card className="similar-card border-0">
                    {item.image ? (
                      <Card.Img
                        variant="top"
                        src={item.image}
                        alt={item.title}
                        className="similar-img img-fluid"
                      />
                    ) : (
                      <div className="similar-img-placeholder" />
                    )}

                    <Card.Body className="justify-content-evenly flex-grow-1 d-flex flex-column">
                      <small>{item.category}</small>
                      <h5>{item.title}</h5>

                      <div className="d-flex justify-content-between align-items-center">
                        <span className="similar-rating">
                          <StarFill className="similar-star-icon" />
                          {item.rating}
                        </span>

                        <strong>${Number(item.price).toFixed(2)}</strong>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col xs={12}>
                <Card className="similar-card border-0">
                  <Card.Body className="text-center py-4">
                    <p className="mb-0 text-muted">No similar menu found</p>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}