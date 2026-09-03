"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import {
  ArrowLeft,
  Bike,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Utensils,
} from "lucide-react";

import { orderService } from "@/services/orderService";
import { menuService } from "@/services/menuService";
import { useOrderDetails } from "@/hooks/useOrderDetails";
import { toast } from "react-toastify";

const defaultValues = {
  customer_id: "",
  customer: {
    full_name: "",
    email: "",
    phone: "",
    profile_image_url: null,
  },

  order_type: "Dine-In",

  dine_in_details: {
    table_no: "",
    guest_count: "",
  },

  takeaway_details: {
    pickup_time: "",
    pickup_code: "",
  },

  online_details: {
    delivery_address: "",
    delivery_latitude: "",
    delivery_longitude: "",
    restaurant_address: "Reztro Restaurant, Jodhpur, Rajasthan, India",
    restaurant_latitude: "26.2389",
    restaurant_longitude: "73.0243",
  },

  items: [],
};

function EditOrderContent() {
  const router = useRouter();
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setOrderId(params.get("id"));
  }, []);

  const {
    order,
    loading: orderLoading,
    error: orderError,
  } = useOrderDetails(orderId);

  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [menuPage, setMenuPage] = useState(1);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);

  const menuPageSize = 6;

  const { register, handleSubmit, control, watch, setValue, getValues, reset } =
    useForm({
      defaultValues,
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const orderType = watch("order_type");
  const watchedItems = watch("items");

  const subtotal = (watchedItems || []).reduce((sum, item) => {
    const price = Number(item.price || 0);
    const quantity = Number(item.quantity || 1);
    return sum + price * quantity;
  }, 0);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setMenuLoading(true);

        const response = await menuService.getMenuItems();

        const data =
          response?.data?.menu_items ||
          response?.data?.data ||
          response?.data ||
          response?.menu_items ||
          response ||
          [];

        setMenuItems(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error(error.message || "Failed to fetch menu items");
        setMenuItems([]);
      } finally {
        setMenuLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await menuService.getMenuCategories();

        const data =
          response?.data?.categories ||
          response?.data ||
          response?.categories ||
          response ||
          [];

        const activeCategories = Array.isArray(data)
          ? data.filter((item) => item.is_active === true)
          : [];

        setCategories(activeCategories);
      } catch (error) {
        toast.error(error.message || "Failed to fetch menu categories");
        setCategories([]);
      }
    };

    fetchMenuItems();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!order) return;

    const mappedItems = (order.items || []).map((item) => {
      const menuId =
        item.menu_id || item.menuId || item.menu_item_id || item.menuId || "";

      const qty = Number(item.qty || item.quantity || 1);
      const price = Number(item.price || 0);

      return {
        order_item_id:
          item.order_item_id || item.orderItemId || item.order_itemId || "",
        menu_id: menuId,
        name: item.name || item.menu_name || item.item_name || "",
        category_name: item.category_name || item.category || "",
        image_url: item.image_url || item.image || "",
        quantity: qty,
        price,
        total_price: Number(item.total_price || qty * price),
        notes: item.notes || item.item_notes || "",
      };
    });

    reset({
      customer_id:
        order.customer_id ||
        order.customerId ||
        order.customer?.customer_id ||
        order.data?.customer_id ||
        order.raw?.customer_id ||
        "",

      customer: {
        full_name:
          order.customerName ||
          order.customer_name ||
          order.customer?.full_name ||
          "",
        email:
          order.customerEmail || order.email || order.customer?.email || "",
        phone:
          order.customerPhone || order.phone || order.customer?.phone || "",
        profile_image_url:
          order.profile_image_url || order.customer?.profile_image_url || null,
      },

      order_type: order.orderType || order.order_type || "Dine-In",

      dine_in_details: {
        table_no:
          (order.orderType || order.order_type) === "Dine-In"
            ? order.tableNo ||
            order.table_no ||
            order.dine_in_details?.table_no ||
            ""
            : "",
        guest_count:
          (order.orderType || order.order_type) === "Dine-In"
            ? order.guestCount ||
            order.guest_count ||
            order.dine_in_details?.guest_count ||
            ""
            : "",
      },

      takeaway_details: {
        pickup_time:
          order.pickupTime ||
          order.pickup_time ||
          order.takeaway_details?.pickup_time ||
          "",
        pickup_code:
          order.pickupCode ||
          order.pickup_code ||
          order.takeaway_details?.pickup_code ||
          "",
      },

      online_details: {
        delivery_address:
          order.deliveryAddress ||
          order.delivery_address ||
          order.customerAddress ||
          order.online_details?.delivery_address ||
          "",
        delivery_latitude:
          order.deliveryLatitude ||
          order.delivery_latitude ||
          order.online_details?.delivery_latitude ||
          "",
        delivery_longitude:
          order.deliveryLongitude ||
          order.delivery_longitude ||
          order.online_details?.delivery_longitude ||
          "",
        restaurant_address:
          order.restaurantAddress ||
          order.restaurant_address ||
          order.online_details?.restaurant_address ||
          "Reztro Restaurant, Jodhpur, Rajasthan, India",
        restaurant_latitude:
          order.restaurantLatitude ||
          order.restaurant_latitude ||
          order.online_details?.restaurant_latitude ||
          "26.2389",
        restaurant_longitude:
          order.restaurantLongitude ||
          order.restaurant_longitude ||
          order.online_details?.restaurant_longitude ||
          "73.0243",
      },

      items: mappedItems,
    });
  }, [order, reset]);

  const selectedItemsCount = (watchedItems || []).length;

  const categoryNames = useMemo(() => {
    const namesFromCategories = categories
      .map((category) => category.category_name || category.name)
      .filter(Boolean);

    const namesFromMenus = menuItems
      .map((menu) => menu.category_name || menu.category)
      .filter(Boolean);

    return Array.from(new Set([...namesFromCategories, ...namesFromMenus]));
  }, [categories, menuItems]);

  const filteredMenuItems = useMemo(() => {
    if (selectedCategory === "All") return menuItems;

    return menuItems.filter((menu) => {
      const categoryName = menu.category_name || menu.category || "";

      return categoryName === selectedCategory;
    });
  }, [menuItems, selectedCategory]);

  const totalMenuPages = Math.ceil(filteredMenuItems.length / menuPageSize);

  const paginatedMenuItems = useMemo(() => {
    const startIndex = (menuPage - 1) * menuPageSize;
    const endIndex = startIndex + menuPageSize;

    return filteredMenuItems.slice(startIndex, endIndex);
  }, [filteredMenuItems, menuPage]);

  useEffect(() => {
    setMenuPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    if (totalMenuPages > 0 && menuPage > totalMenuPages) {
      setMenuPage(totalMenuPages);
    }
  }, [totalMenuPages, menuPage]);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported in this browser");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          setValue("online_details.delivery_latitude", latitude);
          setValue("online_details.delivery_longitude", longitude);

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );

          const locationData = await response.json();

          if (locationData?.display_name) {
            setValue(
              "online_details.delivery_address",
              locationData.display_name,
            );
          }

          toast.success("Location selected successfully");
        } catch (error) {
          toast.error("Location selected, but address not found");
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setLocationLoading(false);
        toast.error("Unable to fetch location");
      },
    );
  };

  const addMenuToOrder = async (menu) => {
    try {
      const currentItems = getValues("items") || [];
      const menuId = menu.menu_id || menu.id;
      const price = Number(menu.price || 0);

      const existingIndex = currentItems.findIndex(
        (item) => Number(item.menu_id) === Number(menuId),
      );

      if (existingIndex >= 0) {
        const existingItem = currentItems[existingIndex];

        if (!existingItem.order_item_id) {
          toast.error("Order item ID not found");
          return;
        }

        const newQty = Number(existingItem.quantity || 1) + 1;

        setValue(`items.${existingIndex}.quantity`, newQty, {
          shouldDirty: true,
          shouldValidate: true,
          shouldTouch: true,
        });

        await orderService.updateOrderItem(existingItem.order_item_id, {
          menu_id: Number(menuId),
          quantity: newQty,
          notes: existingItem.notes || "",
        });

        toast.success("Item quantity updated");
        return;
      }

      const response = await orderService.addOrderItem(orderId, {
        menu_id: Number(menuId),
        quantity: 1,
        notes: "",
      });

      const newItem = response?.data?.data || response?.data || response;

      append({
        order_item_id: newItem?.order_item_id || newItem?.id || "",
        menu_id: menuId,
        name: menu.name,
        category_name: menu.category_name || menu.category || "",
        image_url: menu.image_url || "",
        quantity: 1,
        price,
        total_price: price,
        notes: "",
      });

      toast.success("Item added successfully");
    } catch (error) {
      toast.error(error.message || "Failed to add item");
      console.error("ADD ITEM ERROR:", error?.response?.data || error);
    }
  };

  const increaseQuantity = async (index) => {
    try {
      const item = getValues(`items.${index}`);

      if (!item?.order_item_id) {
        toast.error("Order item ID not found");
        return;
      }

      const qty = Number(item.quantity || 1) + 1;

      setValue(`items.${index}.quantity`, qty, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true,
      });

      await orderService.updateOrderItem(item.order_item_id, {
        menu_id: Number(item.menu_id),
        quantity: qty,
        notes: item.notes || "",
      });
    } catch (error) {
      toast.error(error.message || "Failed to update quantity");
    }
  };

  const decreaseQuantity = async (index) => {
    try {
      const item = getValues(`items.${index}`);

      if (!item?.order_item_id) {
        toast.error("Order item ID not found");
        return;
      }

      if (Number(item.quantity || 1) <= 1) return;

      const qty = Number(item.quantity || 1) - 1;

      setValue(`items.${index}.quantity`, qty, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true,
      });

      await orderService.updateOrderItem(item.order_item_id, {
        menu_id: Number(item.menu_id),
        quantity: qty,
        notes: item.notes || "",
      });
    } catch (error) {
      toast.error(error.message || "Failed to update quantity");
    }
  };

  const removeOrderItem = async (index) => {
    try {
      const item = getValues(`items.${index}`);

      if (!item?.order_item_id) {
        toast.error("Order item ID not found");
        return;
      }

      await orderService.deleteOrderItem(item.order_item_id);

      remove(index);

      toast.success("Item removed successfully");
    } catch (error) {
      toast.error(error.message || "Failed to remove item");
    }
  };

  const submitHandler = async (data) => {
    const validItems = (data.items || []).filter((item) => item.menu_id);

    if (!validItems.length) {
      toast.error("Please select at least one menu item");
      return;
    }

    if (data.order_type === "Dine-In" && !data.dine_in_details.table_no) {
      toast.error("Please enter table number");
      return;
    }

    if (data.order_type === "Online" && !data.online_details.delivery_address) {
      toast.error("Please fill delivery address");
      return;
    }

    try {
      setSaving(true);

      const customerId =
        data.customer_id ||
        order?.customer_id ||
        order?.customerId ||
        order?.customer?.customer_id ||
        order?.data?.customer_id ||
        order?.raw?.customer_id;

      if (!customerId) {
        toast.error(
          "Customer ID not found. Please check order details API response.",
        );
        return;
      }

      const payload = {
        customer_id: Number(customerId),
        order_type: data.order_type,
        order_status:
          order?.status ||
          order?.order_status ||
          order?.orderStatus ||
          "On Process",

        dine_in_details:
          data.order_type === "Dine-In"
            ? {
              table_no: data.dine_in_details.table_no || null,
              guest_count: Number(data.dine_in_details.guest_count) || null,
            }
            : null,

        takeaway_details:
          data.order_type === "Takeaway"
            ? {
              pickup_time: data.takeaway_details.pickup_time || null,
              pickup_code: data.takeaway_details.pickup_code || null,
            }
            : null,

        online_details:
          data.order_type === "Online"
            ? {
              delivery_address: data.online_details.delivery_address || null,
              delivery_latitude:
                Number(data.online_details.delivery_latitude) || null,
              delivery_longitude:
                Number(data.online_details.delivery_longitude) || null,
              restaurant_address:
                data.online_details.restaurant_address || null,
              restaurant_latitude:
                Number(data.online_details.restaurant_latitude) || null,
              restaurant_longitude:
                Number(data.online_details.restaurant_longitude) || null,
            }
            : null,
      };

      await orderService.updateOrder(orderId, payload);

      toast.success("Order updated successfully");

      router.push(`/orders/orderdetails?id=${orderId}`);
    } catch (error) {
      toast.error(error.message || "Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  const orderTypeCards = [
    {
      value: "Dine-In",
      title: "Dine-In",
      subtitle: "Restaurant table order",
      icon: <Utensils size={28} />,
    },
    {
      value: "Takeaway",
      title: "Takeaway",
      subtitle: "Pick up order",
      icon: <ShoppingBag size={28} />,
    },
    {
      value: "Online",
      title: "Online",
      subtitle: "Delivery order",
      icon: <Bike size={30} />,
    },
  ];

  if (orderLoading || !orderId) {
    return (
      <div className="bg-dashboard py-4 min-vh-100">
        <Container fluid>
          <Spinner animation="border" size="sm" className="me-2" />
          Loading order...
        </Container>
      </div>
    );
  }

  if (orderError) {
    return (
      <div className="bg-dashboard py-4 min-vh-100">
        <Container fluid>
          <div className="text-danger rounded-4">{orderError}</div>
        </Container>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-dashboard py-4 min-vh-100">
        <Container fluid>
          <div className="text-danger rounded-4">Order not found</div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-dashboard py-4 min-vh-100">
      <Container fluid>
        <Form onSubmit={handleSubmit(submitHandler)}>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <h3 className="fw-bold mb-1">Update Order</h3>
              <p className="text-muted mb-0">
                Update order items and order details
              </p>
            </div>

            <div className="d-flex gap-2">
              <Button
                type="button"
                variant="light"
                className="rounded-3 border px-3"
                onClick={() =>
                  router.push(`/orders/orderdetails?id=${orderId}`)
                }
              >
                <ArrowLeft size={16} className="me-2" />
                Back
              </Button>

              <Button
                type="submit"
                variant="primary"
                className="rounded-3 text-white px-4"
                disabled={saving}
              >
                {saving ? "Updating..." : "Update Order"}
              </Button>
            </div>
          </div>

          <Row className="g-4 align-items-start">
            <Col xl={6}>
              <div className="d-flex flex-column gap-4">
                <Card className="border-0 rounded-4 shadow-sm">
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-4">Customer Details</h5>

                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          readOnly
                          disabled
                          className="bg-success"
                          {...register("customer.full_name")}
                        />
                      </Col>

                      <Col md={6}>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          readOnly
                          disabled
                          className="bg-success"
                          {...register("customer.phone")}
                        />
                      </Col>

                      <Col md={12}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          readOnly
                          disabled
                          className="bg-success"
                          {...register("customer.email")}
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <Card className="border-0 rounded-4 shadow-sm">
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-4">Order Type</h5>

                    <Row className="g-3">
                      {orderTypeCards.map((type) => (
                        <Col md={4} key={type.value}>
                          <button
                            type="button"
                            className={`w-100 border rounded-4 bg-white p-3 text-center h-100 ${orderType === type.value
                                ? "border-primary shadow-sm"
                                : "border-light"
                              }`}
                            onClick={() => setValue("order_type", type.value)}
                          >
                            <div
                              className={
                                orderType === type.value
                                  ? "text-primary"
                                  : "text-dark"
                              }
                            >
                              {type.icon}
                            </div>

                            <div className="fw-bold mt-3">{type.title}</div>

                            <div className="small text-muted">
                              {type.subtitle}
                            </div>
                          </button>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>

                <Card className="border-0 rounded-4 shadow-sm">
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-4">
                      {orderType === "Dine-In" && "Dine-In Details"}
                      {orderType === "Takeaway" && "Takeaway Details"}
                      {orderType === "Online" && "Online Delivery Details"}
                    </h5>

                    {orderType === "Dine-In" && (
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Label>Table No</Form.Label>
                          <Form.Control
                            placeholder="Table 10"
                            {...register("dine_in_details.table_no")}
                          />
                        </Col>

                        <Col md={6}>
                          <Form.Label>Guest Count</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="2"
                            {...register("dine_in_details.guest_count")}
                          />
                        </Col>
                      </Row>
                    )}

                    {orderType === "Takeaway" && (
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Label>Pickup Time</Form.Label>
                          <Form.Control
                            type="datetime-local"
                            {...register("takeaway_details.pickup_time")}
                          />
                        </Col>

                        <Col md={6}>
                          <Form.Label>Pickup Code</Form.Label>
                          <Form.Control
                            readOnly
                            disabled
                            className="bg-success"
                            placeholder="Auto Generated"
                            {...register("takeaway_details.pickup_code")}
                          />
                        </Col>
                      </Row>
                    )}

                    {orderType === "Online" && (
                      <Row className="g-3">
                        <Col md={12}>
                          <Form.Label>Delivery Address</Form.Label>
                          <Form.Control
                            placeholder="Delivery address"
                            {...register("online_details.delivery_address")}
                          />

                          <Button
                            type="button"
                            variant="light"
                            className="rounded-3 border mt-2"
                            onClick={handleUseLocation}
                            disabled={locationLoading}
                          >
                            {locationLoading
                              ? "Fetching Location..."
                              : "Use Location"}
                          </Button>
                        </Col>
                      </Row>
                    )}
                  </Card.Body>
                </Card>
              </div>
            </Col>

            <Col xl={6}>
              <div className="d-flex flex-column gap-4">
                <Card className="border-0 rounded-4 shadow-sm">
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                      <h5 className="fw-bold mb-0">Category Wise Menu</h5>

                      <Badge bg="primary">
                        {filteredMenuItems.length} Items
                      </Badge>
                    </div>

                    <div className="d-flex gap-2 flex-wrap mb-4">
                      <Button
                        type="button"
                        size="sm"
                        variant={
                          selectedCategory === "All" ? "primary" : "light"
                        }
                        className={`rounded-3 ${selectedCategory === "All"
                            ? "text-white"
                            : "text-dark"
                          }`}
                        onClick={() => {
                          setSelectedCategory("All");
                          setMenuPage(1);
                        }}
                      >
                        All
                      </Button>

                      {categoryNames.map((category) => (
                        <Button
                          key={category}
                          type="button"
                          size="sm"
                          variant={
                            selectedCategory === category ? "primary" : "light"
                          }
                          className={`rounded-3 ${selectedCategory === category
                              ? "text-white"
                              : "text-dark"
                            }`}
                          onClick={() => {
                            setSelectedCategory(category);
                            setMenuPage(1);
                          }}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>

                    {menuLoading ? (
                      <div className="text-center py-5">
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Loading menu...
                      </div>
                    ) : filteredMenuItems.length === 0 ? (
                      <div className="text-center py-5 text-muted">
                        No menu items found
                      </div>
                    ) : (
                      <>
                        <Row className="g-3">
                          {paginatedMenuItems.map((menu) => (
                            <Col md={6} key={menu.menu_id || menu.id}>
                              <Card className="border rounded-4 h-100">
                                <Card.Body className="p-3">
                                  <div className="d-flex gap-3">
                                    {menu.image_url ? (
                                      <img
                                        src={menu.image_url}
                                        alt={menu.name}
                                        className="rounded-3 object-fit-cover"
                                        style={{
                                          width: "70px",
                                          height: "70px",
                                        }}
                                      />
                                    ) : (
                                      <div
                                        className="rounded-3 bg-light d-flex align-items-center justify-content-center"
                                        style={{
                                          width: "70px",
                                          height: "70px",
                                        }}
                                      >
                                        <ShoppingBag
                                          size={24}
                                          className="text-muted"
                                        />
                                      </div>
                                    )}

                                    <div className="flex-grow-1">
                                      <div className="fw-semibold">
                                        {menu.name}
                                      </div>

                                      <small className="text-muted">
                                        {menu.category_name || "-"}
                                      </small>

                                      <div className="d-flex justify-content-between align-items-center mt-2">
                                        <span className="fw-bold text-primary">
                                          ${Number(menu.price || 0).toFixed(2)}
                                        </span>

                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="primary"
                                          className="rounded-3 text-white"
                                          onClick={() => addMenuToOrder(menu)}
                                        >
                                          <Plus size={14} />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                        </Row>

                        {totalMenuPages > 1 && (
                          <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
                            <div className="text-muted small">
                              Showing{" "}
                              <strong>
                                {(menuPage - 1) * menuPageSize + 1}
                              </strong>{" "}
                              to{" "}
                              <strong>
                                {Math.min(
                                  menuPage * menuPageSize,
                                  filteredMenuItems.length,
                                )}
                              </strong>{" "}
                              of <strong>{filteredMenuItems.length}</strong>{" "}
                              items
                            </div>

                            <div className="d-flex align-items-center gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="light"
                                className="rounded-3 border"
                                disabled={menuPage === 1}
                                onClick={() =>
                                  setMenuPage((prev) => Math.max(prev - 1, 1))
                                }
                              >
                                Prev
                              </Button>

                              {Array.from(
                                { length: totalMenuPages },
                                (_, index) => index + 1,
                              ).map((page) => (
                                <Button
                                  key={page}
                                  type="button"
                                  size="sm"
                                  variant={
                                    menuPage === page ? "primary" : "light"
                                  }
                                  className={`rounded-3 border ${menuPage === page
                                      ? "text-white"
                                      : "text-dark"
                                    }`}
                                  onClick={() => setMenuPage(page)}
                                >
                                  {page}
                                </Button>
                              ))}

                              <Button
                                type="button"
                                size="sm"
                                variant="light"
                                className="rounded-3 border"
                                disabled={menuPage === totalMenuPages}
                                onClick={() =>
                                  setMenuPage((prev) =>
                                    Math.min(prev + 1, totalMenuPages),
                                  )
                                }
                              >
                                Next
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </Card.Body>
                </Card>

                <Card className="border-0 rounded-4 shadow-sm">
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-3">Selected Items</h5>

                    <div className="table-responsive">
                      <Table className="align-middle mb-0">
                        <thead>
                          <tr className="small text-muted">
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Total</th>
                            <th>Notes</th>
                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {fields.length === 0 ? (
                            <tr>
                              <td
                                colSpan="5"
                                className="text-center text-muted py-4"
                              >
                                No items selected
                              </td>
                            </tr>
                          ) : (
                            fields.map((field, index) => {
                              const item = watchedItems?.[index] || {};

                              return (
                                <tr key={field.id}>
                                  <td>
                                    <div className="fw-semibold">
                                      {item.name || "-"}
                                    </div>
                                    <small className="text-muted">
                                      ${Number(item.price || 0).toFixed(2)}
                                    </small>
                                  </td>

                                  <td>
                                    <div className="d-flex align-items-center">
                                      <Button
                                        type="button"
                                        variant="light"
                                        size="sm"
                                        className="border"
                                        onClick={() => decreaseQuantity(index)}
                                      >
                                        <Minus size={14} />
                                      </Button>

                                      <div
                                        className="px-3 py-1 border-top border-bottom"
                                        style={{
                                          minWidth: "42px",
                                          textAlign: "center",
                                        }}
                                      >
                                        {item.quantity}
                                      </div>

                                      <Button
                                        type="button"
                                        variant="light"
                                        size="sm"
                                        className="border"
                                        onClick={() => increaseQuantity(index)}
                                      >
                                        <Plus size={14} />
                                      </Button>
                                    </div>
                                  </td>

                                  <td className="fw-semibold">
                                    $
                                    {Number(
                                      (item.price || 0) * (item.quantity || 1),
                                    ).toFixed(2)}
                                  </td>

                                  <td style={{ minWidth: "160px" }}>
                                    <Form.Control
                                      placeholder="Notes"
                                      {...register(`items.${index}.notes`)}
                                    />
                                  </td>

                                  <td>
                                    <Button
                                      type="button"
                                      variant="link"
                                      className="text-danger p-0"
                                      onClick={() => removeOrderItem(index)}
                                    >
                                      <Trash2 size={18} />
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </Table>
                      <hr />

                      {/* ✅ Subtotal */}
                      <div className="mt-4">
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">
                            Subtotal ({fields.length} items)
                          </span>
                          <strong>${subtotal.toFixed(2)}</strong>
                        </div>
                        <div className="text-muted small">
                          Final total calculation will be handled from database.
                        </div>
                      </div>

                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
}

export default function EditOrderPage() {
  return (
    <Suspense fallback={<div>Loading order...</div>}>
      <EditOrderContent />
    </Suspense>
  );
}
