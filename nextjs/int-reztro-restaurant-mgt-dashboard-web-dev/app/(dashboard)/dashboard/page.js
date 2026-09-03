"use client";

import Chart from "react-apexcharts";

import {
  Container,
  Row,
  Col,
  Card,
  Table,
  ProgressBar,
  Form,
  Carousel,
  Button,
  Dropdown,
  Badge,
} from "react-bootstrap";

import {
  ArrowUpRight,
  ArrowDownRight,
  StarFill,
  BoxSeam,
  BagCheck,
  CalendarCheck,
  ThreeDots,
  Search,
  CurrencyDollar,
  People,
  ChevronUp,
  ChevronDown,
  BoxArrowDown,
  Basket,
  Receipt,
} from "react-bootstrap-icons";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

import { useMemo, useState, useEffect } from "react";
import { ChevronsUpDown, StarIcon } from "lucide-react";
import { PiBowlSteam } from "react-icons/pi";
import { LiaBoxSolid } from "react-icons/lia";
import Link from "next/link";
import { useOrders } from "@/hooks/useOrders";
import { useActivities } from "@/hooks/useActivities";
import { customerService } from "@/services/customerService";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/authService";
import { reviewService } from "@/services/reviewService";
import { menuService } from "@/services/menuService";
import { purchaseService } from "@/services/purchaseService";

export default function DashboardPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const { orders, loading: recentOrdersLoading } = useOrders();

  const { activities: recentActivities, loading: activitiesLoading } =
    useActivities(5);

  const [categoryFilter, setCategoryFilter] = useState("This Week");
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [ordersOverviewFilter, setOrdersOverviewFilter] = useState("This Week");
  const [revenueFilter, setRevenueFilter] = useState("This Week");
  const [orderTypeFilter, setOrderTypeFilter] = useState("This Week");
  const [recentOrdersFilter, setRecentOrdersFilter] = useState("This Week");
  const [customerReviews, setCustomerReviews] = useState([]);
  const [trendingMenus, setTrendingMenus] = useState([]);
  const [menuTimeFilter, setMenuTimeFilter] = useState("This Week");
  const [allReviews, setAllReviews] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  const router = useRouter();

  const loadTrendingMenus = async () => {
    try {
      const res = await menuService.getMenuItems();

      const menus = res?.data || [];

      const formattedMenus = menus
        .sort((a, b) => {
          if ((b.rating || 0) !== (a.rating || 0)) {
            return (b.rating || 0) - (a.rating || 0);
          }
          return (b.total_orders || 0) - (a.total_orders || 0);
        })
        .slice(0, 10)
        .map((item) => ({
          id: item.menu_id,
          title: item.name,
          image: item.image_url,
          category: item.category_name,
          rating: item.rating,
          orders: item.total_orders || 0,
          price: item.price,
          created_at: item.created_at,
        }));

      setTrendingMenus(formattedMenus);
    } catch (error) {
      console.error("Trending menu error:", error);
    }
  };

  useEffect(() => {
    loadTrendingMenus();
    loadReviews();
  }, []);

  const filteredTrendingMenus = useMemo(() => {
    const now = new Date();

    const filteredReviews = allReviews.filter((review) => {
      const reviewDate = new Date(review.created_at);

      if (menuTimeFilter === "Today") {
        return reviewDate.toDateString() === now.toDateString();
      }

      if (menuTimeFilter === "This Week") {
        const startOfWeek = new Date(now);
        const day = now.getDay();
        const diff = day === 0 ? 6 : day - 1;

        startOfWeek.setDate(now.getDate() - diff);
        startOfWeek.setHours(0, 0, 0, 0);

        return reviewDate >= startOfWeek;
      }

      if (menuTimeFilter === "This Month") {
        return (
          reviewDate.getMonth() === now.getMonth() &&
          reviewDate.getFullYear() === now.getFullYear()
        );
      }

      if (menuTimeFilter === "This Year") {
        return reviewDate.getFullYear() === now.getFullYear();
      }

      return true;
    });

    const menuScores = {};

    filteredReviews.forEach((review) => {
      if (!menuScores[review.menu_id]) {
        menuScores[review.menu_id] = {
          menu_id: review.menu_id,
          totalRating: 0,
          reviewCount: 0,
        };
      }

      menuScores[review.menu_id].totalRating += Number(review.rating || 0);
      menuScores[review.menu_id].reviewCount += 1;
    });

    return trendingMenus
      .map((menu) => {
        const score = menuScores[menu.id];

        return {
          ...menu,
          avgRating: score
            ? score.totalRating / score.reviewCount
            : 0,
          reviewCount: score?.reviewCount || 0,
        };
      })
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 4);
  }, [allReviews, trendingMenus, menuTimeFilter]);

  const loadReviews = async () => {
    try {
      const res = await reviewService.getReviewsList();

      setAllReviews(res?.data || []);

      const formatted = (res?.data || res || []).map((item) => ({
        id: item.review_id,
        title: item.menu_name,
        description: item.comment,
        customer: item.customer_name,
        date: new Date(item.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        rating: item.rating,
        image:
          item.menu_image ||
          "https://via.placeholder.com/150",
      }));

      setCustomerReviews(formatted);
    } catch (error) {
      console.error("Review loading error:", error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const tokenFromAmplify = await AuthService.token();
        const tokenFromStorage = localStorage.getItem("idToken");

        if (
          !tokenFromAmplify ||
          !tokenFromStorage ||
          tokenFromStorage === "undefined" ||
          tokenFromStorage === "null"
        ) {
          router.push("/signin");
        } else {
          console.log("Welcome to Dashboard.");
        }
      } catch (error) {
        console.error("Auth check block error:", error);
        router.push("/signin");
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const loadPurchaseOrders = async () => {
      try {
        const res = await purchaseService.getPurchaseOrders();

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.orders || [];

        setPurchaseOrders(data);

      } catch (error) {
        console.error("Purchase Orders Error:", error);
      }
    };

    loadPurchaseOrders();
  }, []);

  const filterByDate = (data, filter) => {
    const now = new Date();

    return data.filter((item) => {
      if (!item.rawDate) return true;

      const date = new Date(item.rawDate);

      switch (filter) {
        case "Today":
          return date.toDateString() === now.toDateString();

        case "This Week": {
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          return date >= weekAgo;
        }

        case "This Month":
          return (
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
          );

        case "Last 3 Months": {
          const d = new Date();
          d.setMonth(now.getMonth() - 3);
          return date >= d;
        }

        case "This Year":
          return date.getFullYear() === now.getFullYear();

        default:
          return true;
      }
    });
  };

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-US", {
      maximumFractionDigits: 0,
    });
  };

  const getOrderAmount = (order) => {
    return Number(order.total_amount || order.totalAmount || order.amount || 0);
  };

  const isCompletedOrder = (order) => {
    return order.status === "Completed" || order.order_status === "Completed";
  };

  const ordersChartData = useMemo(() => {
    const now = new Date();

    if (ordersOverviewFilter === "This Week") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

      const monday = new Date(now);
      const day = monday.getDay();
      const diff = monday.getDate() - day + (day === 0 ? -6 : 1);

      monday.setDate(diff);
      monday.setHours(0, 0, 0, 0);

      return days.map((label, index) => {
        const start = new Date(monday);
        start.setDate(monday.getDate() + index);

        const end = new Date(start);
        end.setDate(start.getDate() + 1);

        return {
          label,
          orders: orders.filter((order) => {
            if (!order.rawDate) return false;

            const date = new Date(order.rawDate);

            return date >= start && date < end;
          }).length,
        };
      });
    }

    if (ordersOverviewFilter === "This Month") {
      const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];

      return weeks.map((label, index) => {
        const startDate = index * 7 + 1;
        const endDate = index === 4 ? 31 : startDate + 6;

        return {
          label,
          orders: orders.filter((order) => {
            if (!order.rawDate) return false;

            const date = new Date(order.rawDate);

            return (
              date.getFullYear() === now.getFullYear() &&
              date.getMonth() === now.getMonth() &&
              date.getDate() >= startDate &&
              date.getDate() <= endDate
            );
          }).length,
        };
      });
    }

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return months.map((label, monthIndex) => ({
      label,
      orders: orders.filter((order) => {
        if (!order.rawDate) return false;

        const date = new Date(order.rawDate);

        return (
          date.getFullYear() === now.getFullYear() &&
          date.getMonth() === monthIndex
        );
      }).length,
    }));
  }, [orders, ordersOverviewFilter]);

  const revenueChartData = useMemo(() => {
    const now = new Date();

    if (revenueFilter === "This Week") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

      const monday = new Date(now);
      const day = monday.getDay();
      const diff = monday.getDate() - day + (day === 0 ? -6 : 1);

      monday.setDate(diff);
      monday.setHours(0, 0, 0, 0);

      return days.map((label, index) => {
        const start = new Date(monday);
        start.setDate(monday.getDate() + index);

        const end = new Date(start);
        end.setDate(start.getDate() + 1);

        const income = orders
          .filter(isCompletedOrder)
          .filter((order) => {
            if (!order.rawDate) return false;
            const date = new Date(order.rawDate);
            return date >= start && date < end;
          })
          .reduce((sum, order) => sum + getOrderAmount(order), 0);

        const expense = purchaseOrders
          .filter((po) => {
            const date = new Date(po.order_date);

            return date >= start && date < end;
          })
          .reduce(
            (sum, po) =>
              sum + Number(po.total_amount || 0),
            0
          );

        return {
          month: label,
          income,
          expense,
        };
      });
    }

    if (revenueFilter === "This Month") {
      return ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"].map(
        (label, index) => {
          const startDate = index * 7 + 1;
          const endDate = index === 4 ? 31 : startDate + 6;

          const income = orders
            .filter(isCompletedOrder)
            .filter((order) => {
              if (!order.rawDate) return false;
              const date = new Date(order.rawDate);

              return (
                date.getFullYear() === now.getFullYear() &&
                date.getMonth() === now.getMonth() &&
                date.getDate() >= startDate &&
                date.getDate() <= endDate
              );
            })
            .reduce((sum, order) => sum + getOrderAmount(order), 0);

          const expense = purchaseOrders
            .filter((po) => {
              const date = new Date(po.order_date);

              return (
                date.getFullYear() === now.getFullYear() &&
                date.getMonth() === now.getMonth() &&
                date.getDate() >= startDate &&
                date.getDate() <= endDate
              );
            })
            .reduce(
              (sum, po) => sum + Number(po.total_amount || 0),
              0
            );

          return {
            month: label,
            income,
            expense,
          };
        },
      );
    }

    return [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ].map((month, monthIndex) => {
      const income = orders
        .filter(isCompletedOrder)
        .filter((order) => {
          if (!order.rawDate) return false;
          const date = new Date(order.rawDate);

          return (
            date.getFullYear() === now.getFullYear() &&
            date.getMonth() === monthIndex
          );
        })
        .reduce((sum, order) => sum + getOrderAmount(order), 0);

      const expense = purchaseOrders
        .filter((po) => {
          const date = new Date(po.order_date);

          return (
            date.getFullYear() === now.getFullYear() &&
            date.getMonth() === monthIndex
          );
        })
        .reduce(
          (sum, po) => sum + Number(po.total_amount || 0),
          0
        );

      return {
        month,
        income,
        expense,
      };
    });
  }, [orders, purchaseOrders, revenueFilter]);

  const totalRevenue = useMemo(() => {
    return orders
      .filter(isCompletedOrder)
      .reduce((sum, order) => sum + getOrderAmount(order), 0);
  }, [orders]);

  const getMonthlyChange = (currentCount, previousCount) => {
    if (previousCount === 0 && currentCount === 0) {
      return {
        change: "0%",
        type: "up",
      };
    }

    if (previousCount === 0) {
      return {
        change: "+100%",
        type: "up",
      };
    }

    const percentage = ((currentCount - previousCount) / previousCount) * 100;

    return {
      change: `${percentage >= 0 ? "+" : "-"}${Math.abs(percentage).toFixed(2)}%`,
      type: percentage >= 0 ? "up" : "down",
    };
  };

  const revenueMonthlyStats = useMemo(() => {
    const now = new Date();

    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const previousMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const previousMonth = previousMonthDate.getMonth();
    const previousYear = previousMonthDate.getFullYear();

    let currentRevenue = 0;
    let previousRevenue = 0;

    orders.filter(isCompletedOrder).forEach((order) => {
      if (!order.rawDate) return;

      const orderDate = new Date(order.rawDate);
      const amount = getOrderAmount(order);

      if (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      ) {
        currentRevenue += amount;
      }

      if (
        orderDate.getMonth() === previousMonth &&
        orderDate.getFullYear() === previousYear
      ) {
        previousRevenue += amount;
      }
    });

    return getMonthlyChange(currentRevenue, previousRevenue);
  }, [orders]);

  const ordersMonthlyStats = useMemo(() => {
    const now = new Date();

    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const previousMonthDate = new Date(currentYear, currentMonth - 1, 1);

    const previousMonth = previousMonthDate.getMonth();
    const previousYear = previousMonthDate.getFullYear();

    let currentCount = 0;
    let previousCount = 0;

    orders.forEach((order) => {
      if (!order.rawDate) return;

      const orderDate = new Date(order.rawDate);

      if (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      ) {
        currentCount++;
      }

      if (
        orderDate.getMonth() === previousMonth &&
        orderDate.getFullYear() === previousYear
      ) {
        previousCount++;
      }
    });

    return {
      ...getMonthlyChange(currentCount, previousCount),
    };
  }, [orders]);

  const customersMonthlyStats = useMemo(() => {
    const now = new Date();

    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const previousMonthDate = new Date(currentYear, currentMonth - 1, 1);

    const previousMonth = previousMonthDate.getMonth();
    const previousYear = previousMonthDate.getFullYear();

    let currentCount = 0;
    let previousCount = 0;

    customers.forEach((customer) => {
      const createdAt = customer.created_at || customer.createdAt;

      if (!createdAt) return;

      const customerDate = new Date(createdAt);

      if (
        customerDate.getMonth() === currentMonth &&
        customerDate.getFullYear() === currentYear
      ) {
        currentCount++;
      }

      if (
        customerDate.getMonth() === previousMonth &&
        customerDate.getFullYear() === previousYear
      ) {
        previousCount++;
      }
    });

    return {
      ...getMonthlyChange(currentCount, previousCount),
    };
  }, [customers]);

  const recentOrdersData = useMemo(() => {
    const filtered = filterByDate(orders, recentOrdersFilter);

    return filtered
      .sort((a, b) => new Date(b.rawDate || 0) - new Date(a.rawDate || 0))
      .slice(0, 3);
  }, [orders, recentOrdersFilter]);

  const orderTypesData = useMemo(() => {
    const filteredOrders = filterByDate(orders, orderTypeFilter);

    const totalOrders = filteredOrders.length;

    const typeCounts = {
      "Dine-In": 0,
      Takeaway: 0,
      Online: 0,
    };

    filteredOrders.forEach((order) => {
      const type = order.orderType || "Dine-In";

      if (typeCounts[type] !== undefined) {
        typeCounts[type]++;
      }
    });

    return Object.keys(typeCounts).map((title, index) => ({
      id: index + 1,
      title,
      total: typeCounts[title],
      percentage:
        totalOrders > 0
          ? Math.round((typeCounts[title] / totalOrders) * 100)
          : 0,
    }));
  }, [orders, orderTypeFilter]);

  const filterOrdersByDate = (orders, filter) => {
    const now = new Date();

    return orders.filter((order) => {
      if (!order.rawDate) return true;

      const orderDate = new Date(order.rawDate);

      if (filter === "This Week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return orderDate >= weekAgo;
      }

      if (filter === "This Month") {
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }

      if (filter === "Last 3 Months") {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        return orderDate >= threeMonthsAgo;
      }

      if (filter === "This Year") {
        return orderDate.getFullYear() === now.getFullYear();
      }

      return true;
    });
  };

  const topCategoriesData = useMemo(() => {
    const filteredOrders = filterOrdersByDate(orders, categoryFilter);

    const categoryCounts = {};

    filteredOrders.forEach((order) => {
      const category =
        order.category && order.category !== "N/A"
          ? order.category
          : order.menuCategory && order.menuCategory !== "N/A"
            ? order.menuCategory
            : "Other";

      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const total = Object.values(categoryCounts).reduce(
      (sum, count) => sum + count,
      0,
    );

    return Object.entries(categoryCounts)
      .map(([name, count], index) => ({
        id: index + 1,
        name,
        total: count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 4);
  }, [orders, categoryFilter]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await customerService.getCustomers();

        const data = response?.customers || response?.data || response || [];

        setCustomers(Array.isArray(data) ? data : []);
        setTotalCustomers(Array.isArray(data) ? data.length : 0);
      } catch (error) {
        console.log(error);
        setTotalCustomers(0);
      }
    };

    fetchCustomers();
  }, []);

  /* =========================
      REVENUE CHART
  ========================= */

  const revenueChart = {
    series: [
      {
        name: "Income",
        data: revenueChartData.map((item) => item.income),
      },
      {
        name: "Expense",
        data: revenueChartData.map((item) => item.expense),
      },
    ],

    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },

      tooltip: {
        enabled: true,
        theme: false,

        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          const month = w.globals.categoryLabels[dataPointIndex];

          const income = series[0][dataPointIndex];

          const expense = series[1][dataPointIndex];

          return `
      <div
        style="
          background:#fff;
          padding:16px;
          border-radius:20px;
          box-shadow:0 4px 20px rgba(0,0,0,0.08);
          min-width:180px;
        "
      >

        <div
          style="
            color:#8c8c8c;
            font-size:14px;
            margin-bottom:14px;
          "
        >
          ${month} ${new Date().getFullYear()}
        </div>

        <div
          style="
            display:flex;
            align-items:center;
            justify-content:space-between;
            margin-bottom:12px;
          "
        >

          <div
            style="
              display:flex;
              align-items:center;
              gap:8px;
            "
          >

            <div
              style="
                width:10px;
                height:10px;
                border-radius:50%;
                background:#ff6b1a;
              "
            ></div>

            <span
              style="
                font-size:14px;
                color:#8c8c8c;
              "
            >
              Income
            </span>

          </div>

          <span
            style="
              font-size:18px;
              font-weight:700;
              color:#1f1f1f;
            "
          >
            $${income.toLocaleString()}
          </span>

        </div>

        <div
          style="
            display:flex;
            align-items:center;
            justify-content:space-between;
          "
        >

          <div
            style="
              display:flex;
              align-items:center;
              gap:8px;
            "
          >

            <div
              style="
                width:10px;
                height:10px;
                border-radius:50%;
                background:#2e2e2e;
              "
            ></div>

            <span
              style="
                font-size:14px;
                color:#8c8c8c;
              "
            >
              Expense
            </span>

          </div>

          <span
            style="
              font-size:18px;
              font-weight:700;
              color:#1f1f1f;
            "
          >
            $${expense.toLocaleString()}
          </span>

        </div>

      </div>
    `;
        },
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },

      colors: ["#ff6b1a", "#2e2e2e"],

      dataLabels: {
        enabled: false,
      },

      grid: {
        borderColor: "#f2f2f2",
      },

      legend: {
        position: "top",
        horizontalAlign: "right",

        markers: {
          shape: "square",
          width: 12,
          height: 12,
          radius: 4,
        },
      },

      xaxis: {
        categories: revenueChartData.map((item) => item.month),

        labels: {
          style: {
            colors: "#8c8c8c",
          },
        },
      },

      yaxis: {
        labels: {
          style: {
            colors: "#8c8c8c",
          },
          formatter: function (val) {
            return val.toFixed(0);
          },
        },
      },
    },
  };

  /* =========================
      DONUT CHART
  ========================= */

  const donutChart = {
    series: topCategoriesData.map((item) => item.percentage),

    options: {
      labels: topCategoriesData.map((item) => item.name),

      chart: {
        type: "donut",
      },

      colors: ["#FF6B1E", "#FFEEE0", "#333333", "#FDCEA1"],

      dataLabels: {
        enabled: false,
      },

      legend: {
        show: false,
      },

      stroke: {
        width: 5,
        colors: ["#ffffff"],
      },

      states: {
        hover: {
          filter: {
            type: "none",
          },
        },
        active: {
          filter: {
            type: "none",
          },
        },
      },

      plotOptions: {
        pie: {
          expandOnClick: false,

          donut: {
            size: "68%",
          },
        },
      },
    },
  };

  /* =========================
      BAR CHART
  ========================= */

  const ordersChart = {
    series: [
      {
        data: ordersChartData.map((item) => item.orders),
      },
    ],

    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        enabled: true,
        theme: false,

        custom: function ({ series, dataPointIndex, w }) {
          const day = w.globals.labels[dataPointIndex];

          const orders = series[0][dataPointIndex];

          return `
      <div
        style="
          background:#2f2f2f;
          color:#fff;
          padding:12px 14px;
          border-radius:14px;
          min-width:110px;
        "
      >

        <div
          style="
            font-size:13px;
            opacity:0.8;
            margin-bottom:6px;
          "
        >
          ${day}
        </div>

        <div
          style="
            font-size:22px;
            font-weight:700;
            line-height:1;
          "
        >
          ${orders}
          <span
            style="
              font-size:14px;
              font-weight:400;
              opacity:0.8;
            "
          >
            orders
          </span>
        </div>

      </div>
    `;
        },
      },

      colors: ordersChartData.map((item) =>
        item.orders > 0 ? "#ff6b1a" : "#f3dfcc",
      ),

      plotOptions: {
        bar: {
          borderRadius: 10,
          columnWidth: "45%",
          distributed: true,
        },
      },

      dataLabels: {
        enabled: false,
      },

      legend: {
        show: false,
      },

      xaxis: {
        categories: ordersChartData.map((item) => item.label),
      },

      grid: {
        borderColor: "#f2f2f2",
      },
    },
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "orderId",
        header: "Order ID",
      },

      {
        accessorKey: "image",
        header: "Photo",

        cell: ({ row }) => (
          <div
            className="rounded-3 overflow-hidden position-relative"
            style={{
              width: "55px",
              height: "55px",
            }}
          >
            <img
              src={row.original.image}
              alt={row.original.menu}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        ),
      },

      {
        accessorKey: "menu",
        header: "Menu",

        cell: ({ row }) => (
          <div>
            <h6 className="mb-1">{row.original.menu}</h6>

            <small className="text-muted">{row.original.category}</small>
          </div>
        ),
      },

      {
        accessorKey: "qty",
        header: "Qty",
      },

      {
        accessorKey: "amount",
        header: "Amount",

        cell: ({ row }) => (
          <span className="fw-semibold" style={{ color: "#ff6b1a" }}>
            ${row.original.amount}
          </span>
        ),
      },

      {
        accessorKey: "customer",
        header: "Customer",
      },

      {
        header: "Status",
        accessorKey: "status",

        cell: ({ getValue }) => {
          const styles = {
            Completed: "bg-primary text-white",
            Cancelled: "bg-dark text-white",
            "On Process": "bg-danger text-dark",
          };

          return (
            <span className={`badge px-3 py-2 rounded-3 ${styles[getValue()]}`}>
              {getValue()}
            </span>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: recentOrdersData,
    columns,

    state: {
      globalFilter,
      sorting,
    },

    onGlobalFilterChange: setGlobalFilter,

    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),

    getPaginationRowModel: getPaginationRowModel(),

    getFilteredRowModel: getFilteredRowModel(),

    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Container fluid className="overflow-hidden p-0">
      {/* =========================
          MAIN GRID
      ========================= */}

      <Row className="g-4 align-items-stretch">
        {/* =========================
            LEFT CONTENT
        ========================= */}

        <Col xl={9}>
          {/* TOP STATS */}

          <Row className="g-4 mb-4">
            <Col xl={4} md={6} sm={12}>
              <Card className="border-0 rounded-4 shadow-sm h-100">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-4 d-flex align-items-center justify-content-center bg-primary text-white"
                      style={{ width: "58px", height: "58px" }}
                    >
                      <Receipt size={24} />
                    </div>

                    <div>
                      <small className="text-muted">Total Orders</small>
                      <h3 className="fw-bold mb-0 mt-1">{orders.length}</h3>
                    </div>
                  </div>

                  <div className="small d-flex mt-5 align-items-center gap-1 text-secondary">
                    <Badge
                      pill
                      className={`${ordersMonthlyStats.type === "up" ? "bg-primary-subtle text-primary" : "bg-secondary-subtle text-dark"} d-flex align-items-center justify-content-center p-0`}
                      style={{ width: "15px", height: "15px" }}
                    >
                      {ordersMonthlyStats.type === "up" ? (
                        <ArrowUpRight size={10} />
                      ) : (
                        <ArrowDownRight size={10} />
                      )}
                    </Badge>
                    {ordersMonthlyStats.change}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xl={4} md={6} sm={12}>
              <Card className="border-0 rounded-4 shadow-sm h-100">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-4 d-flex align-items-center justify-content-center bg-primary text-white"
                      style={{ width: "58px", height: "58px" }}
                    >
                      <People size={24} />
                    </div>

                    <div>
                      <small className="text-muted">Total Customers</small>
                      <h3 className="fw-bold mb-0 mt-1">{totalCustomers}</h3>
                    </div>
                  </div>

                  <div className="small d-flex mt-5 align-items-center gap-1 text-secondary">
                    <Badge
                      pill
                      className={`${customersMonthlyStats.type === "up" ? "bg-primary-subtle text-primary" : "bg-secondary-subtle text-dark"} d-flex align-items-center justify-content-center p-0`}
                      style={{ width: "15px", height: "15px" }}
                    >
                      {customersMonthlyStats.type === "up" ? (
                        <ArrowUpRight size={10} />
                      ) : (
                        <ArrowDownRight size={10} />
                      )}
                    </Badge>
                    {customersMonthlyStats.change}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xl={4} md={6} sm={12}>
              <Card className="border-0 rounded-4 shadow-sm h-100">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-4 d-flex align-items-center justify-content-center bg-primary text-white"
                      style={{ width: "58px", height: "58px" }}
                    >
                      <CurrencyDollar size={24} />
                    </div>

                    <div>
                      <small className="text-muted">Total Revenue</small>
                      <h3 className="fw-bold mb-0 mt-1">
                        ${formatAmount(totalRevenue)}
                      </h3>
                    </div>
                  </div>

                  <div className="small d-flex mt-5 align-items-center gap-1 text-secondary">
                    <Badge
                      pill
                      className={`${revenueMonthlyStats.type === "up"
                        ? "bg-primary-subtle text-primary"
                        : "bg-secondary-subtle text-dark"
                        } d-flex align-items-center justify-content-center p-0`}
                      style={{ width: "15px", height: "15px" }}
                    >
                      {revenueMonthlyStats.type === "up" ? (
                        <ArrowUpRight size={10} />
                      ) : (
                        <ArrowDownRight size={10} />
                      )}
                    </Badge>
                    {revenueMonthlyStats.change}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* CHARTS */}

          <Row className="g-4 mb-4">
            {/* REVENUE */}

            <Col xl={8} lg={12}>
              <Card className="border-0 rounded-4 shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <small className="text-muted">Total Revenue</small>

                      <h2 className="fw-bold mt-1">
                        ${formatAmount(totalRevenue)}
                      </h2>
                    </div>

                    <Dropdown>
                      <Dropdown.Toggle
                        variant="light"
                        size="sm"
                        bsPrefix=" "
                        className="rounded-3 border-0 shadow-none"
                      >
                        {revenueFilter}
                        <ChevronDown size={13} className="ms-1" />
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="rounded-3 border-0 shadow-sm">
                        {["This Week", "This Month", "This Year"].map(
                          (item) => (
                            <Dropdown.Item
                              key={item}
                              onClick={() => setRevenueFilter(item)}
                            >
                              {item}
                            </Dropdown.Item>
                          ),
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>

                  <Chart
                    options={revenueChart.options}
                    series={revenueChart.series}
                    type="line"
                    height={280}
                  />
                </Card.Body>
              </Card>
            </Col>

            {/* TOP CATEGORIES */}

            <Col xl={4} md={12}>
              <Card className="border-0 rounded-4 shadow-sm h-100">
                <Card.Body className="p-4">
                  {/* HEADER */}

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-semibold mb-0">Top Categories</h6>

                    <Dropdown>
                      <Dropdown.Toggle
                        variant="light"
                        size="sm"
                        bsPrefix=" "
                        className="rounded-3 border-0 shadow-none"
                      >
                        {categoryFilter}
                        <ChevronDown size={13} className="ms-1" />
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="rounded-3 border-0 shadow-sm">
                        {[
                          "This Week",
                          "This Month",
                          "Last 3 Months",
                          "This Year",
                        ].map((item) => (
                          <Dropdown.Item
                            key={item}
                            onClick={() => setCategoryFilter(item)}
                          >
                            {item}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>

                  {/* CHART */}

                  <div className="d-flex justify-content-center">
                    <Chart
                      options={donutChart.options}
                      series={donutChart.series}
                      type="donut"
                      height={220}
                      width="100%"
                    />
                  </div>

                  {/* LEGEND */}

                  <Row className="g-3 mt-0">
                    {topCategoriesData.map((item, index) => (
                      <Col xs={6} key={item.id}>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className={`flex-shrink-0 ${index === 0
                              ? "bg-primary"
                              : index === 1
                                ? "bg-success"
                                : index === 2
                                  ? "bg-dark"
                                  : "bg-danger"
                              }`}
                            style={{
                              width: "8px",
                              height: "8px",
                            }}
                          />

                          <small
                            className="text-muted fw-medium"
                            style={{
                              fontSize: "13px",
                            }}
                          >
                            <span className="text-dark">{item.name}</span>{" "}
                            {item.percentage}%
                          </small>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* OVERVIEW */}

          <Row className="g-4 mb-4">
            {/* ORDERS OVERVIEW */}

            <Col xl={8} lg={12}>
              <Card className="border-0 rounded-4 shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between mb-4">
                    <h5 className="fw-semibold mb-0">Orders Overview</h5>

                    <Dropdown>
                      <Dropdown.Toggle
                        variant="light"
                        size="sm"
                        bsPrefix=" "
                        className="rounded-3 border-0 shadow-none"
                      >
                        {ordersOverviewFilter}
                        <ChevronDown size={13} className="ms-1" />
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="rounded-3 border-0 shadow-sm">
                        {["This Week", "This Month", "This Year"].map(
                          (item) => (
                            <Dropdown.Item
                              key={item}
                              onClick={() => setOrdersOverviewFilter(item)}
                            >
                              {item}
                            </Dropdown.Item>
                          ),
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>

                  <Chart
                    options={ordersChart.options}
                    series={ordersChart.series}
                    type="bar"
                    height={260}
                  />
                </Card.Body>
              </Card>
            </Col>

            {/* ORDER TYPES */}
            <Col xl={4} md={12}>
              <Card className="border-0 rounded-4 shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between mb-4">
                    <h5 className="fw-semibold mb-0">Order Types</h5>

                    <div className="d-flex justify-content-between mb-4">
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="light"
                          size="sm"
                          bsPrefix=" "
                          className="rounded-3 border-0 shadow-none"
                        >
                          {orderTypeFilter}
                          <ChevronDown size={13} className="ms-1" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="rounded-3 border-0 shadow-sm">
                          {[
                            "Today",
                            "This Week",
                            "This Month",
                            "Last 3 Months",
                            "This Year",
                          ].map((item) => (
                            <Dropdown.Item
                              key={item}
                              onClick={() => setOrderTypeFilter(item)}
                            >
                              {item}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-4">
                    {orderTypesData.map((item) => (
                      <div key={item.id}>
                        <div className="d-flex justify-content-between align-items-center">
                          {/* LEFT SIDE */}

                          <div className="d-flex align-items-start gap-3 w-100">
                            {/* ICON */}

                            <div
                              className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 bg-success text-primary"
                              style={{
                                width: "45px",
                                height: "45px",
                              }}
                            >
                              <>
                                {item.title === "Dine-In" && (
                                  <PiBowlSteam size={20} />
                                )}

                                {item.title === "Takeaway" && (
                                  <LiaBoxSolid size={20} />
                                )}

                                {item.title === "Online" && (
                                  <BoxArrowDown size={20} />
                                )}
                              </>
                            </div>

                            {/* TEXT + PROGRESS */}

                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="mb-0">
                                  {item.title}{" "}
                                  <small className="text-secondary">
                                    {item.percentage}%
                                  </small>
                                </h6>

                                <h6 className="fw-bold mb-0">{item.total}</h6>
                              </div>

                              <ProgressBar
                                variant="dark"
                                now={item.percentage}
                                style={{
                                  height: "8px",
                                  borderRadius: "20px",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* RECENT ORDERS */}

          <Card className="border-0 rounded-4 shadow-sm mb-4">
            <Card.Body>
              <div className="d-flex flex-column flex-xl-row justify-content-between align-items-xl-center gap-3 mb-4">
                <h5 className="fw-semibold mb-0">Recent Orders</h5>
                <div className="d-flex flex-wrap gap-2">
                  <div className="d-flex align-items-center px-3 rounded-3   bg-info">
                    <Search className="text-muted me-2 " />

                    <Form.Control
                      placeholder="Search placeholder"
                      className="border-0 shadow-none bg-info"
                      value={globalFilter ?? ""}
                      onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                  </div>

                  <Dropdown>
                    <Dropdown.Toggle
                      variant="light"
                      bsPrefix=" "
                      className="rounded-3 border"
                    >
                      {recentOrdersFilter}
                      <ChevronDown size={13} className="ms-1" />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="rounded-3 border-0 shadow-sm">
                      {[
                        "Today",
                        "This Week",
                        "This Month",
                        "Last 3 Months",
                        "This Year",
                      ].map((item) => (
                        <Dropdown.Item
                          key={item}
                          onClick={() => setRecentOrdersFilter(item)}
                        >
                          {item}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>

                  <Link href="/orders" className="text-decoration-none">
                    <Button variant="light" className="rounded-3 border">
                      See All Orders
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="table-responsive rounded-4">
                <Table borderless className="align-middle">
                  <thead className="bg-info text-dark ">
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
                            className="px-3 py-3 fw-normal border-0 text-secondary bg-info "
                            style={{
                              cursor: header.column.getCanSort()
                                ? "pointer"
                                : "default",
                              fontSize: "13px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <div
                              className={
                                header.column.id === "select"
                                  ? ""
                                  : "d-flex align-items-center gap-1"
                              }
                            >
                              {header.column.id === "select" ? (
                                flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )
                              ) : (
                                <span className="small fw-medium">
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                  )}
                                </span>
                              )}

                              {header.column.getCanSort() &&
                                header.column.id !== "select" && (
                                  <span className="text-dark d-flex align-items-center">
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
                    {recentOrdersLoading ? (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="text-center py-4"
                        >
                          Loading recent orders...
                        </td>
                      </tr>
                    ) : table.getRowModel().rows.length > 0 ? (
                      table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="text-center py-4"
                        >
                          No recent orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>

          {/* CUSTOMER REVIEWS */}

          <Card className="border-0 overflow-hidden bg-dashboard">
            <Card.Body className="p-0">
              {/* HEADER */}

              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-semibold mb-0">Customer Reviews</h5>

                <small
                  className="fw-medium"
                  style={{ cursor: "pointer", color: "#ff6b1a" }}
                  onClick={() => router.push("/reviews")}
                >
                  See More Reviews
                </small>
              </div>

              {/* CAROUSEL */}

              <Carousel
                indicators={false}
                controls={false}
                interval={2500}
                pause={false}
                touch
              >
                {Array.from({
                  length: Math.ceil(customerReviews.length / 3),
                }).map((_, slideIndex) => {
                  const startIndex = slideIndex * 3;

                  return (
                    <Carousel.Item key={slideIndex}>
                      <div className="d-flex overflow-hidden gap-4 gap-md-5 pe-5">
                        {customerReviews
                          .slice(startIndex, startIndex + 3)
                          .map((item) => (
                            <div
                              key={item.id}
                              className="flex-shrink-0 w-100"
                              style={{ maxWidth: "390px" }}
                            >
                              <Card className="border-0 rounded-4 h-100 bg-white">
                                <Card.Body className="position-relative p-4 overflow-visible">
                                  <div
                                    className="position-absolute"
                                    style={{
                                      right: "-35px",
                                      top: "50%",
                                      transform: "translateY(-50%)",
                                    }}
                                  >
                                    <img
                                      src={item.image}
                                      alt={item.title}
                                      width={145}
                                      height={145}
                                      className="rounded-4 object-fit-cover"
                                    />
                                  </div>

                                  <div className="d-flex flex-column w-75">
                                    <h4 className="fw-semibold mb-3">
                                      {item.title}
                                    </h4>

                                    <p
                                      className="text-muted mb-4"
                                      style={{
                                        lineHeight: "1.8",
                                        minHeight: "95px",
                                      }}
                                    >
                                      {item.description}
                                    </p>

                                    <div className="d-flex align-items-center gap-2 mb-2">
                                      <span className="fw-semibold">
                                        {item.customer}
                                      </span>

                                      <span className="text-muted small">
                                        • {item.date}
                                      </span>
                                    </div>

                                    <div className="d-flex align-items-center gap-2">
                                      <div className="d-flex gap-1 text-warning">
                                        {Array.from({
                                          length: Number(item.rating),
                                        }).map((_, i) => (
                                          <StarFill key={i} size={12} />
                                        ))}
                                      </div>

                                      <span className="fw-medium">
                                        {item.rating}
                                      </span>
                                    </div>
                                  </div>
                                </Card.Body>
                              </Card>
                            </div>
                          ))}
                      </div>
                    </Carousel.Item>
                  );
                })}
              </Carousel>
            </Card.Body>
          </Card>
        </Col>

        {/* =========================
            RIGHT SIDEBAR (DERE RECENT ACTIVITIES DYNAMIC HERE )
        ========================= */}
        <Col xl={3} lg={12} className="d-flex flex-column">
          {/* TRENDING MENUS */}

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-semibold mb-0">Trending Menus</h5>

            <Dropdown>
              <Dropdown.Toggle
                variant="light"
                size="sm"
                bsPrefix=" "
                className="rounded-3 border-0 shadow-none"
              >
                {menuTimeFilter}
                <ChevronDown size={13} className="ms-1" />
              </Dropdown.Toggle>

              <Dropdown.Menu className="border-0 shadow rounded-4">
                <Dropdown.Item onClick={() => setMenuTimeFilter("Today")}>
                  Today
                </Dropdown.Item>

                <Dropdown.Item onClick={() => setMenuTimeFilter("This Week")}>
                  This Week
                </Dropdown.Item>

                <Dropdown.Item onClick={() => setMenuTimeFilter("This Month")}>
                  This Month
                </Dropdown.Item>

                <Dropdown.Item onClick={() => setMenuTimeFilter("This Year")}>
                  This Year
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* DESKTOP VIEW */}

          <div className="d-none d-xl-flex flex-column gap-4 mb-4">
            {filteredTrendingMenus.slice(0, 4).map((item) => (
              <Card key={item.id} className="border-0 rounded-4 shadow-sm">
                <Card.Body>
                  <div
                    className="rounded-4 mb-3 overflow-hidden position-relative"
                    style={{
                      height: "150px",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="object-fit-cover"
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>

                  <h5 className="fw-semibold">{item.title}</h5>

                  <small className="text-muted">{item.category}</small>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="d-flex gap-3 text-muted small">
                      <span>
                        <StarIcon size={15} className="me-1 mb-1" />
                        {item.rating}
                      </span>

                      <span>
                        <Basket className="mb-1 me-1" size={14} />
                        {item.orders}
                      </span>
                    </div>

                    <h5 className="fw-bold mb-0 text-primary">${item.price}</h5>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>

          {/* TABLET + MOBILE CAROUSEL */}

          <div className="d-block d-xl-none mb-4 overflow-hidden">
            <Carousel
              indicators={false}
              controls={false}
              interval={2500}
              pause={false}
              touch
            >
              {Array.from({
                length: Math.ceil(filteredTrendingMenus.slice(0, 4).length / 2),
              }).map((_, slideIndex) => {
                const startIndex = slideIndex * 2;

                return (
                  <Carousel.Item key={slideIndex}>
                    <div className="d-flex gap-3">
                      {filteredTrendingMenus
                        .slice(0, 4)
                        .slice(startIndex, startIndex + 2)
                        .map((item) => (
                          <div
                            key={item.id}
                            className="flex-fill"
                            style={{ minWidth: "48%" }}
                          >
                            <Card className="border-0 rounded-4 shadow-sm h-100">
                              <Card.Body>
                                <div
                                  className="rounded-4 mb-3 overflow-hidden"
                                  style={{ height: "120px" }}
                                >
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="object-fit-cover w-100 h-100"
                                  />
                                </div>

                                <h6 className="fw-semibold mb-1">
                                  {item.title}
                                </h6>

                                <small className="text-muted">
                                  {item.category}
                                </small>

                                <div className="d-flex justify-content-between align-items-center mt-3">
                                  <div className="d-flex gap-2 text-muted small">
                                    <span>
                                      <StarIcon size={13} className="me-1 mb-1" />
                                      {item.rating}
                                    </span>

                                    <span>
                                      <Basket size={12} className="me-1 mb-1" />
                                      {item.orders}
                                    </span>
                                  </div>

                                  <h6 className="fw-bold mb-0 text-primary">
                                    ${item.price}
                                  </h6>
                                </div>
                              </Card.Body>
                            </Card>
                          </div>
                        ))}
                    </div>
                  </Carousel.Item>
                );
              })}
            </Carousel>
          </div>

          {/* RECENT ACTIVITIES */}
          <Card className="border-0 rounded-4 shadow-sm flex-grow-1">
            <Card.Body className="p-4 d-flex flex-column h-100">
              {/* HEADER */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-semibold mb-0">Recent Activity</h5>
                <ThreeDots
                  className="text-muted"
                  style={{ cursor: "pointer" }}
                />
              </div>

              {/* TIMELINE CONTAINER */}
              <div className="position-relative d-flex flex-column gap-4">

                {!activitiesLoading && recentActivities.length > 0 && (
                  <div
                    className="position-absolute"
                    style={{
                      width: "0px",
                      borderLeft:
                        "2px dashed #D2D2D2",
                      left: "21px",
                      top: "30px",
                      bottom:
                        "30px",
                      zIndex: 0,
                    }}
                  />
                )}

                {activitiesLoading ? (
                  <div className="text-center py-4 text-secondary small">
                    Loading activities...
                  </div>
                ) : recentActivities.length > 0 ? (
                  recentActivities.map((item) => (
                    <div
                      key={item.activity_id || item.id}
                      className="d-flex gap-3 position-relative"
                      style={{ zIndex: 1 }}
                    >
                      {/* FIGMA SOFT ORANGE ICON CONTAINER */}
                      <div
                        className="rounded-4 d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: "42px",
                          height: "42px",
                          backgroundColor:
                            "#FDEEE4",
                          color: "#E27B3F",
                        }}
                      >
                        {item.activity_type === "inventory" && (
                          <BoxSeam size={18} />
                        )}
                        {item.activity_type === "order" && (
                          <BagCheck size={18} />
                        )}
                        {item.activity_type === "reservation" && (
                          <CalendarCheck size={18} />
                        )}
                        {!["inventory", "order", "reservation"].includes(
                          item.activity_type,
                        ) && <BoxSeam size={18} />}
                      </div>

                      {/* DATA SECTION */}
                      <div className="flex-grow-1">
                        <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                          <h6
                            className="fw-semibold mb-0 text-dark"
                            style={{ fontSize: "15px" }}
                          >
                            {item.actor_name}
                          </h6>

                          <span
                            className="px-2 py-0.5 rounded text-secondary text-capitalize font-weight-normal"
                            style={{
                              background:
                                "#EAEAEA",
                              fontSize: "11px",
                            }}
                          >
                            {item.actor_role}
                          </span>
                        </div>

                        <p
                          className="text-muted mb-1"
                          style={{ fontSize: "14px", lineHeight: "1.4" }}
                        >
                          {item.activity_description || item.activity_title}
                        </p>

                        <small
                          className="text-muted d-block"
                          style={{ fontSize: "12px" }}
                        >
                          {item.activity_time_text ||
                            new Date(item.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                        </small>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-secondary small">
                    No recent activities found
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
