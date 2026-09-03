"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import {
    Button,
    Card,
    Col,
    Container,
    Form,
    Row,
    Badge,
    Table,
    Spinner,
} from "react-bootstrap";
import {
    MapPin,
    Plus,
    Trash2,
    Minus,
    ShoppingBag,
    Bike,
    Utensils,
    ArrowLeft,
} from "lucide-react";

import "leaflet/dist/leaflet.css";

import dynamic from "next/dynamic";

const DeliveryMap = dynamic(
    () => import("@/components/orders/DeliveryMap"),
    {
        ssr: false,
    }
);

import { orderService } from "@/services/orderService";
import { menuService } from "@/services/menuService";
import { customerService } from "@/services/customerService";
import { toast } from "react-toastify";

const defaultValues = {
    customer: {
        full_name: "",
        email: "",
        phone: "",
        profile_image_url: null,
        note: "",
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

    additional_notes: "",
};

export default function AddOrderPage() {
    const router = useRouter();

    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const [customers, setCustomers] = useState([]);
    const [customerSearch, setCustomerSearch] = useState("");
    const [selectedCustomerId, setSelectedCustomerId] = useState("");
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

    const [menuPage, setMenuPage] = useState(1);

    const [menuLoading, setMenuLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);

    const [searchLocation, setSearchLocation] = useState("");
    const [mapPosition, setMapPosition] = useState([26.2389, 73.0243]);
    const [searchResults, setSearchResults] = useState([]);

    const [searching, setSearching] = useState(false);

    const [loading, setLoading] = useState(false);

    const [occupiedTables, setOccupiedTables] = useState([]);
    const [takeawayOrders, setTakeawayOrders] = useState([]);

    const menuPageSize = 6;

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        getValues,
        clearErrors,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues,
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const orderType = watch("order_type");
    const watchedItems = watch("items");
    const customerImage = watch("customer.profile_image_url");
    const customerName = watch("customer.full_name");

    const selectedItemsCount = (watchedItems || []).length;

    const subtotal = (watchedItems || []).reduce((sum, item) => {
        const price = Number(item.price || 0);
        const quantity = Number(item.quantity || 1);

        return sum + price * quantity;
    }, 0);

    const getErrorMessage = (error) => {
        return (
            error?.response?.data?.detail ||
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong"
        );
    };

    const getNextPickupCode = () => {
        if (!takeawayOrders.length) {
            return "PK113";
        }

        const maxCode = Math.max(
            ...takeawayOrders.map((item) => {
                return Number(
                    String(item.pickup_code || "")
                        .replace("PK", "")
                        .trim()
                ) || 112;
            })
        );

        return `PK${maxCode + 1}`;
    };

    const getCustomerAddress = (customer) => {
        return (
            customer.address ||
            customer.customer_address ||
            customer.delivery_address ||
            customer.address_line ||
            customer.addressLine ||
            customer.full_address ||
            ""
        );
    };

    const handleSelectCustomer = (customerId) => {
        setSelectedCustomerId(customerId);

        if (!customerId) return;

        const selectedCustomer = customers.find(
            (customer) =>
                String(customer.customer_id || customer.id) === String(customerId)
        );

        if (!selectedCustomer) return;

        setValue(
            "customer.full_name",
            selectedCustomer.full_name || selectedCustomer.customer_name || "",
            { shouldDirty: true, shouldValidate: true }
        );

        setValue(
            "customer.email",
            selectedCustomer.email || "",
            { shouldDirty: true, shouldValidate: true }
        );

        setValue(
            "customer.phone",
            selectedCustomer.phone || "",
            { shouldDirty: true, shouldValidate: true }
        );

        clearErrors([
            "customer.full_name",
            "customer.email",
            "customer.phone",
        ]);
        setValue(
            "customer.profile_image_url",
            selectedCustomer.profile_image_url || null
        );

        const address = getCustomerAddress(selectedCustomer);

        if (address) {
            setValue("online_details.delivery_address", address);
        }
    };

    const filteredCustomers = useMemo(() => {
        const search = customerSearch.trim().toLowerCase();

        if (!search) return [];

        return customers
            .filter((customer) => {
                const name = customer.full_name || customer.customer_name || "";
                const phone = customer.phone || "";
                const email = customer.email || "";
                const address = getCustomerAddress(customer);

                return (
                    name.toLowerCase().includes(search) ||
                    String(phone).toLowerCase().includes(search) ||
                    email.toLowerCase().includes(search) ||
                    address.toLowerCase().includes(search)
                );
            })
            .slice(0, 8);
    }, [customers, customerSearch]);

    useEffect(() => {
        if (orderType === "Takeaway") {
            const currentCode = getValues("takeaway_details.pickup_code");

            if (!currentCode) {
                setValue("takeaway_details.pickup_code", getNextPickupCode());
            }
        }

        if (orderType === "Online" && selectedCustomerId) {
            const selectedCustomer = customers.find(
                (customer) =>
                    String(customer.customer_id || customer.id) ===
                    String(selectedCustomerId)
            );

            if (selectedCustomer) {
                const address = getCustomerAddress(selectedCustomer);

                if (address) {
                    setValue("online_details.delivery_address", address);
                }
            }
        }
    }, [orderType, getValues, setValue, selectedCustomerId, customers]);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                setMenuLoading(true);

                const response = await menuService.getMenuItems();

                const data =
                    response?.data?.menu_items ||
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

        const fetchCustomers = async () => {
            try {
                const response = await customerService.getCustomers();

                const data =
                    response?.data?.customers ||
                    response?.data?.data ||
                    response?.data ||
                    response?.customers ||
                    response ||
                    [];

                setCustomers(Array.isArray(data) ? data : []);
            } catch (error) {
                toast.error(error.message || "Failed to fetch customers");
                setCustomers([]);
            }
        };

        const fetchOccupiedTables = async () => {
            try {
                const response = await orderService.getOrders();

                const orders =
                    response?.data?.orders ||
                    response?.data?.data ||
                    response?.data ||
                    response ||
                    [];

                const occupied = Array.isArray(orders)
                    ? orders
                        .filter((order) =>
                            order.order_type === "Dine-In" &&
                            ["Pending", "On Process"].includes(order.order_status) &&
                            order.table_no
                        )
                        .map((order) => String(order.table_no))
                    : [];

                setOccupiedTables(occupied);
            } catch (error) {
                toast.error("Failed to fetch table availability");
            }
        };

        const fetchTakeawayOrders = async () => {
            try {
                const response = await orderService.getTakeawayOrders();

                const data =
                    response?.data?.takeaway_orders ||
                    response?.data?.data ||
                    response?.data ||
                    [];

                setTakeawayOrders(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(error);
                setTakeawayOrders([]);
            }
        };

        fetchMenuItems();
        fetchCategories();
        fetchCustomers();
        fetchOccupiedTables();
        fetchTakeawayOrders();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (searchLocation.trim().length < 2) {
                setSearchResults([]);
                return;
            }

            try {
                setSearching(true);

                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=8&q=${encodeURIComponent(
                        searchLocation
                    )}`
                );

                const data = await response.json();

                setSearchResults(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(error);
            } finally {
                setSearching(false);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchLocation]);

    const totalTables = Array.from({ length: 20 }, (_, index) =>
        String(index + 1)
    );

    const availableTables = totalTables.filter(
        (tableNo) => !occupiedTables.includes(tableNo)
    );

    const filteredMenuItems = useMemo(() => {
        if (selectedCategory === "All") return menuItems;

        return menuItems.filter((menu) => {
            const categoryName =
                menu.category_name ||
                menu.category ||
                menu.menu_category ||
                "";

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

    const categoryNames = useMemo(() => {
        const namesFromCategories = categories
            .map((category) => category.category_name || category.name)
            .filter(Boolean);

        const namesFromMenus = menuItems
            .map((menu) => menu.category_name || menu.category)
            .filter(Boolean);

        return Array.from(new Set([...namesFromCategories, ...namesFromMenus]));
    }, [categories, menuItems]);

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setLocationLoading(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                setMapPosition([latitude, longitude]);

                setValue("online_details.delivery_latitude", latitude);
                setValue("online_details.delivery_longitude", longitude);

                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                    );

                    const data = await response.json();

                    const address = data?.display_name || "";

                    setSearchLocation(address);

                    setValue("online_details.delivery_address", address, {
                        shouldDirty: true,
                        shouldValidate: true,
                    });

                    toast.success("Current location selected");
                } catch (error) {
                    toast.warning("Location selected, but address not found");
                } finally {
                    setLocationLoading(false);
                }
            },
            () => {
                setLocationLoading(false);
                toast.error("Unable to get current location");
            },
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 0,
            }
        );
    };

    const addMenuToOrder = (menu) => {
        const currentItems = getValues("items") || [];

        const menuId = menu.menu_id || menu.id;

        const existingIndex = currentItems.findIndex(
            (item) => Number(item.menu_id) === Number(menuId)
        );

        const price = Number(menu.price || 0);

        if (existingIndex >= 0) {
            const existingItem = currentItems[existingIndex];
            const newQty = Number(existingItem.quantity || 1) + 1;

            setValue(`items.${existingIndex}.quantity`, newQty, {
                shouldDirty: true,
                shouldValidate: true,
                shouldTouch: true,
            });

            setValue(`items.${existingIndex}.total_price`, newQty * price, {
                shouldDirty: true,
                shouldValidate: true,
                shouldTouch: true,
            });
            return;
        }

        append({
            menu_id: menuId,
            name: menu.name,
            category_name: menu.category_name || menu.category || "",
            image_url: menu.image_url || "",
            quantity: 1,
            price,
            total_price: price,
            notes: "",
        });
    };

    const handleQuantityChange = (index, quantity) => {
        const qty = Math.max(1, Number(quantity || 1));
        const price = Number(getValues(`items.${index}.price`) || 0);

        setValue(`items.${index}.quantity`, qty, {
            shouldDirty: true,
            shouldValidate: true,
            shouldTouch: true,
        });

        setValue(`items.${index}.total_price`, qty * price, {
            shouldDirty: true,
            shouldValidate: true,
            shouldTouch: true,
        });
    };

    const increaseQuantity = (index) => {
        const currentQty = Number(getValues(`items.${index}.quantity`) || 1);
        handleQuantityChange(index, currentQty + 1);
    };

    const decreaseQuantity = (index) => {
        const currentQty = Number(getValues(`items.${index}.quantity`) || 1);

        if (currentQty <= 1) return;

        handleQuantityChange(index, currentQty - 1);
    };

    const getOrCreateCustomerId = async (customerData) => {
        if (selectedCustomerId) {
            const selectedCustomer = customers.find(
                (customer) =>
                    String(customer.customer_id || customer.id) ===
                    String(selectedCustomerId)
            );

            const isInactive =
                selectedCustomer?.is_active === false ||
                selectedCustomer?.is_active === 0 ||
                selectedCustomer?.status === "Inactive";

            if (isInactive) {
                await customerService.createCustomer({
                    full_name:
                        selectedCustomer.full_name ||
                        selectedCustomer.customer_name ||
                        customerData.full_name,

                    email:
                        selectedCustomer.email ||
                        customerData.email ||
                        null,

                    phone:
                        selectedCustomer.phone ||
                        customerData.phone,

                    profile_image_url:
                        selectedCustomer.profile_image_url ||
                        customerData.profile_image_url ||
                        null,
                });
            }

            return Number(selectedCustomerId);
        }

        const response = await customerService.createCustomer({
            full_name: customerData.full_name,
            email: customerData.email || null,
            phone: customerData.phone,
            profile_image_url: customerData.profile_image_url || null,
        });

        const responseData =
            response?.data?.data ||
            response?.data ||
            response;

        if (responseData?.message === "Customer already exists") {
            toast.warning("Customer already exists");
        } else if (responseData?.message) {
            toast.success(responseData.message);
        }

        const customerId =
            responseData?.customer_id ||
            responseData?.id ||
            responseData?.customer?.customer_id;

        if (customerId) return customerId;

        const customersResponse = await customerService.getCustomers();

        const customerList =
            customersResponse?.data?.customers ||
            customersResponse?.data ||
            customersResponse?.customers ||
            customersResponse ||
            [];

        const foundCustomer = Array.isArray(customerList)
            ? customerList.find((customer) => {
                const sameEmail =
                    customerData.email &&
                    customer.email &&
                    customer.email.toLowerCase() ===
                    customerData.email.toLowerCase();

                const samePhone =
                    customerData.phone &&
                    customer.phone &&
                    String(customer.phone) === String(customerData.phone);

                return sameEmail || samePhone;
            })
            : null;

        const foundCustomerId =
            foundCustomer?.customer_id || foundCustomer?.id || null;

        if (!foundCustomerId) {
            throw new Error(
                "Customer created/found but customer_id not returned by API"
            );
        }

        return foundCustomerId;
    };

    const submitHandler = async (data) => {
        const validItems = (data.items || []).filter((item) => item.menu_id);

        if (!selectedCustomerId) {
            toast.error("Please select existing customer or add new customer first");
            return;
        }

        if (!data.customer.full_name || !data.customer.phone || !data.customer.email) {
            toast.error("Please fill customer name, phone and email");
            return;
        }

        if (data.order_type === "Dine-In" && !data.dine_in_details.table_no) {
            toast.error("Please enter table number");
            return;
        }

        if (
            data.order_type === "Dine-In" && Number(data.dine_in_details.guest_count) < 1
        ) {
            toast.error("Guest count must be at least 1");
            return;
        }

        if (!validItems.length) {
            toast.error("Please select at least one menu item");
            return;
        }

        if (data.order_type === "Online" && !data.online_details.delivery_address) {
            toast.error("Please fill delivery address");
            return;
        }

        try {
            setLoading(true);

            const customerId = await getOrCreateCustomerId(data.customer);

            const payload = {
                customer_id: Number(customerId),

                order_type: data.order_type,

                items: validItems.map((item) => ({
                    menu_id: Number(item.menu_id),
                    quantity: Number(item.quantity),
                    notes: item.notes || null,
                })),

                dine_in_details:
                    data.order_type === "Dine-In"
                        ? {
                            table_no: data.dine_in_details.table_no || null,
                            guest_count:
                                Number(data.dine_in_details.guest_count) ||
                                null,
                        }
                        : null,

                takeaway_details:
                    data.order_type === "Takeaway"
                        ? {
                            pickup_time:
                                data.takeaway_details.pickup_time || null,
                            pickup_code:
                                data.takeaway_details.pickup_code || null,
                        }
                        : null,

                online_details:
                    data.order_type === "Online"
                        ? {
                            delivery_address:
                                data.online_details.delivery_address,
                            delivery_latitude:
                                Number(
                                    data.online_details.delivery_latitude
                                ) || null,
                            delivery_longitude:
                                Number(
                                    data.online_details.delivery_longitude
                                ) || null,
                            restaurant_address:
                                data.online_details.restaurant_address,
                            restaurant_latitude:
                                Number(
                                    data.online_details.restaurant_latitude
                                ) || null,
                            restaurant_longitude:
                                Number(
                                    data.online_details.restaurant_longitude
                                ) || null,
                        }
                        : null,

                payment: {
                    payment_method: "Cash",
                    payment_status: "Pending",
                    paid_amount: 0,
                    transaction_id: null,
                },
            };

            const response = await orderService.createOrder(payload);

            toast.success("Order created successfully");

            const createdOrderId =
                response?.data?.order_id ||
                response?.data?.data?.order_id ||
                response?.order_id ||
                response?.data?.id ||
                response?.id;

            if (data.order_type === "Takeaway") {
                const pickupCode = data.takeaway_details.pickup_code;

                if (pickupCode) {
                    const pickupNumber = Number(String(pickupCode).replace("PK", ""));

                    if (!Number.isNaN(pickupNumber)) {
                        localStorage.setItem("last_pickup_code", String(pickupNumber));
                    }
                }
            }

            router.push(`/orders/payment?id=${createdOrderId}`);
        } catch (error) {
            toast.error(
                getErrorMessage(error)
            );
        } finally {
            setLoading(false);
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

    return (
        <div className="bg-dashboard py-4 min-vh-100">
            <Container fluid>
                <Form onSubmit={handleSubmit(submitHandler)}>
                    <div className="d-flex justify-content-end align-items-center mb-4 flex-wrap gap-3">
                        <div className="d-flex gap-2">
                            <Button
                                type="button"
                                variant="light"
                                className="rounded-3 border px-3"
                                onClick={() => router.push("/orders")}
                            >
                                <ArrowLeft size={16} className="me-2" />
                                Back to Orders
                            </Button>

                            <Button
                                type="button"
                                variant="light"
                                className="rounded-3 border px-3"
                                onClick={() => router.push("/customers/create")}
                            >

                                Add Customer
                            </Button>

                            <Button
                                type="submit"
                                variant="primary"
                                className="rounded-3 text-white px-4"
                                disabled={loading}
                            >

                                {loading ? "Creating..." : "Create Order"}
                            </Button>
                        </div>
                    </div>

                    <Row className="g-4 align-items-start">
                        <Col xl={6}>
                            <div className="d-flex flex-column gap-4">
                                <Card className="border-0 rounded-4 shadow-sm">
                                    <Card.Body className="p-4">
                                        <h5 className="fw-bold mb-4">
                                            1. Customer Details
                                        </h5>

                                        <div className="position-relative mb-3">
                                            <Form.Label>Search Existing Customer</Form.Label>

                                            <Form.Control
                                                placeholder="Search customer by name, phone or email"
                                                value={customerSearch}
                                                onChange={(e) => {
                                                    setCustomerSearch(e.target.value);
                                                    setShowCustomerDropdown(true);
                                                }}
                                                onFocus={() => setShowCustomerDropdown(true)}
                                            />

                                            {showCustomerDropdown && filteredCustomers.length > 0 && (
                                                <div
                                                    className="position-absolute bg-white border rounded-4 shadow-sm w-100 mt-1"
                                                    style={{
                                                        zIndex: 20,
                                                        height: filteredCustomers.length > 3 ? "210px" : "auto",
                                                        maxHeight: "210px",
                                                        overflowY: filteredCustomers.length > 3 ? "auto" : "visible",
                                                    }}
                                                >
                                                    {filteredCustomers.map((customer) => {
                                                        const id = customer.customer_id || customer.id;
                                                        const name =
                                                            customer.full_name ||
                                                            customer.customer_name ||
                                                            "No Name";
                                                        const phone = customer.phone || "No Phone";
                                                        const email = customer.email || "No Email";
                                                        const address =
                                                            getCustomerAddress(customer) || "No Address";

                                                        return (
                                                            <button
                                                                key={id}
                                                                type="button"
                                                                className="w-100 text-start border-0 bg-white px-3 py-3 border-bottom"
                                                                onClick={() => {
                                                                    handleSelectCustomer(id);
                                                                    setCustomerSearch(name);
                                                                    setShowCustomerDropdown(false);
                                                                }}
                                                            >
                                                                <div className="fw-semibold">{name}</div>

                                                                <div className="small text-muted">
                                                                    {phone} • {email}
                                                                </div>

                                                                <div className="small text-muted">
                                                                    {address}
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        <Row className="g-3">
                                            <Col md={6}>
                                                <Form.Label>
                                                    Full Name{" "}
                                                    <span className="text-primary">
                                                        *
                                                    </span>
                                                </Form.Label>
                                                <Form.Control
                                                    placeholder="Customer name"
                                                    isInvalid={
                                                        !!errors.customer
                                                            ?.full_name
                                                    }
                                                    {...register(
                                                        "customer.full_name",
                                                        {
                                                            required:
                                                                "Customer name is required",
                                                            pattern: {
                                                                value: /^[A-Za-z\s]+$/,
                                                                message: "Only letters and spaces are allowed",
                                                            },
                                                        }
                                                    )}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {
                                                        errors.customer
                                                            ?.full_name
                                                            ?.message
                                                    }
                                                </Form.Control.Feedback>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Label>
                                                    Phone{" "}
                                                    <span className="text-primary">
                                                        *
                                                    </span>
                                                </Form.Label>
                                                <Form.Control
                                                    placeholder="Phone number"
                                                    isInvalid={
                                                        !!errors.customer?.phone
                                                    }
                                                    {...register(
                                                        "customer.phone",
                                                        {
                                                            required:
                                                                "Phone number is required",
                                                            minLength: {
                                                                value: 10,
                                                                message: "Phone number must be exactly 10 digits",
                                                            },
                                                            maxLength: {
                                                                value: 10,
                                                                message: "Phone number must be exactly 10 digits",
                                                            },
                                                            pattern: {
                                                                value: /^[0-9]{10}$/,
                                                                message: "Phone number must contain only 10 digits",
                                                            },
                                                        }
                                                    )}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {
                                                        errors.customer?.phone
                                                            ?.message
                                                    }
                                                </Form.Control.Feedback>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Label>
                                                    Email{" "}
                                                    <span className="text-primary">
                                                        *
                                                    </span>
                                                </Form.Label>
                                                <Form.Control
                                                    placeholder="Email address"
                                                    isInvalid={
                                                        !!errors.customer?.email
                                                    }
                                                    {...register(
                                                        "customer.email",
                                                        {
                                                            required:
                                                                "Email Id is required",
                                                            pattern: {
                                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                                message: "Please enter a valid email address",
                                                            },
                                                        }
                                                    )}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {
                                                        errors.customer?.email
                                                            ?.message
                                                    }
                                                </Form.Control.Feedback>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Label>Customer Image</Form.Label>

                                                <div className="d-flex align-items-center gap-3">
                                                    <div
                                                        className="rounded-3 border bg-light d-flex align-items-center justify-content-center overflow-hidden"
                                                        style={{
                                                            width: "80px",
                                                            height: "80px",
                                                        }}
                                                    >
                                                        {customerImage ? (
                                                            <img
                                                                src={customerImage}
                                                                alt={customerName || "Customer"}
                                                                className="w-100 h-100 object-fit-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-muted small">
                                                                No Image
                                                            </span>
                                                        )}
                                                    </div>

                                                    {!selectedCustomerId && (
                                                        <div className="small text-muted">
                                                            Image will show after selecting customer
                                                        </div>
                                                    )}
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>

                                <Card className="border-0 rounded-4 shadow-sm">
                                    <Card.Body className="p-4">
                                        <h5 className="fw-bold mb-4">
                                            2. Order Type
                                        </h5>

                                        <Row className="g-3">
                                            {orderTypeCards.map((type) => (
                                                <Col md={4} key={type.value}>
                                                    <button
                                                        type="button"
                                                        className={`w-100 border rounded-4 bg-white p-3 text-center h-100 ${orderType === type.value
                                                            ? "border-primary shadow-sm"
                                                            : "border-light"
                                                            }`}
                                                        onClick={() =>
                                                            setValue(
                                                                "order_type",
                                                                type.value
                                                            )
                                                        }
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

                                                        <div className="fw-bold mt-3">
                                                            {type.title}
                                                        </div>

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
                                            3.{" "}
                                            {orderType === "Dine-In" &&
                                                "Dine-In Details"}
                                            {orderType === "Takeaway" &&
                                                "Takeaway Details"}
                                            {orderType === "Online" &&
                                                "Online Delivery Details"}
                                        </h5>

                                        {orderType === "Dine-In" && (
                                            <Row className="g-3">
                                                <Col md={6}>
                                                    <Form.Label>
                                                        Table No
                                                    </Form.Label>
                                                    <Form.Select
                                                        isInvalid={!!errors.dine_in_details?.table_no}
                                                        {...register("dine_in_details.table_no", {
                                                            required: "Table No is required",
                                                        })}>
                                                        <option value="">Select available table</option>

                                                        {availableTables.map((tableNo) => (
                                                            <option key={tableNo} value={tableNo}>
                                                                Table {tableNo}
                                                            </option>
                                                        ))}
                                                    </Form.Select>

                                                    {availableTables.length === 0 && (
                                                        <div className="text-danger small mt-1">
                                                            No tables available right now
                                                        </div>
                                                    )}
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.dine_in_details?.table_no?.message}
                                                    </Form.Control.Feedback>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Label>
                                                        Guest Count
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        min="1"
                                                        placeholder="2"
                                                        isInvalid={!!errors.dine_in_details?.guest_count}
                                                        {...register("dine_in_details.guest_count", {
                                                            min: {
                                                                value: 1,
                                                                message: "Guest count must be at least 1",
                                                            },
                                                            required:
                                                                "Guest is required",
                                                        })}
                                                    />

                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.dine_in_details?.guest_count?.message}
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Row>
                                        )}

                                        {orderType === "Takeaway" && (
                                            <Row className="g-3">
                                                <Col md={6}>
                                                    <Form.Label>
                                                        Pickup Time
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="datetime-local"
                                                        isInvalid={!!errors.takeaway_details?.pickup_time}
                                                        {...register(
                                                            "takeaway_details.pickup_time", {
                                                            required:
                                                                "Pickup Time is required",
                                                        },
                                                        )}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.takeaway_details?.pickup_time?.message}
                                                    </Form.Control.Feedback>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Label>
                                                        Pickup Code
                                                    </Form.Label>
                                                    <Form.Control
                                                        placeholder="Auto generated pickup code"
                                                        readOnly
                                                        className="bg-dark-subtle"
                                                        {...register("takeaway_details.pickup_code")}
                                                    />
                                                </Col>
                                            </Row>
                                        )}

                                        {orderType === "Online" && (
                                            <Row className="g-3">
                                                <Col md={12}>
                                                    <Form.Label>
                                                        Search Delivery Location
                                                    </Form.Label>

                                                    <div className="position-relative mb-3">
                                                        <div className="d-flex gap-2 flex-column flex-sm-row">
                                                            <Form.Control
                                                                value={searchLocation}
                                                                onChange={(e) => setSearchLocation(e.target.value)}
                                                                placeholder="Search address, colony, landmark..."
                                                                autoComplete="off"
                                                            />

                                                            <Button
                                                                type="button"
                                                                variant="outline-primary"
                                                                className="rounded-3 text-nowrap"
                                                                onClick={getCurrentLocation}
                                                                disabled={locationLoading}
                                                            >
                                                                <MapPin size={16} className="me-1" />
                                                                {locationLoading ? "Finding..." : "Use Location"}
                                                            </Button>
                                                        </div>

                                                        {searching && (
                                                            <div className="small text-muted mt-1">
                                                                Searching...
                                                            </div>
                                                        )}

                                                        {searchResults.length > 0 && (
                                                            <div
                                                                className="position-absolute w-100 bg-white border rounded-4 shadow-sm mt-1"
                                                                style={{
                                                                    zIndex: 9999,
                                                                    maxHeight: "280px",
                                                                    overflowY: "auto",
                                                                }}
                                                            >
                                                                {searchResults.map((item) => (
                                                                    <button
                                                                        key={item.place_id}
                                                                        type="button"
                                                                        className="w-100 text-start border-0 bg-white p-3 border-bottom"
                                                                        onClick={() => {
                                                                            const lat = Number(item.lat);
                                                                            const lng = Number(item.lon);

                                                                            setSearchLocation(item.display_name);
                                                                            setSearchResults([]);
                                                                            setMapPosition([lat, lng]);

                                                                            setValue("online_details.delivery_address", item.display_name, {
                                                                                shouldDirty: true,
                                                                                shouldValidate: true,
                                                                            });

                                                                            setValue("online_details.delivery_latitude", lat);
                                                                            setValue("online_details.delivery_longitude", lng);

                                                                            toast.success("Location selected successfully");
                                                                        }}
                                                                    >
                                                                        <MapPin size={14} className="me-2 text-primary" />
                                                                        {item.display_name}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div
                                                        className="rounded-4 overflow-hidden border"
                                                        style={{ height: "320px", width: "100%" }}
                                                    >
                                                        <DeliveryMap mapPosition={mapPosition} />
                                                    </div>
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
                                            <h5 className="fw-bold mb-0">
                                                Menu Items
                                            </h5>

                                            <Badge bg="primary">
                                                {filteredMenuItems.length} Items
                                            </Badge>
                                        </div>

                                        <div className="d-flex gap-2 flex-wrap mb-4">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant={selectedCategory === "All" ? "primary" : "light"}
                                                className={`rounded-3 ${selectedCategory === "All" ? "text-white" : "text-dark"
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
                                                    variant={selectedCategory === category ? "primary" : "light"}
                                                    className={`rounded-3 ${selectedCategory === category ? "text-white" : "text-dark"
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
                                                        <Col
                                                            md={6}
                                                            key={menu.menu_id || menu.id}
                                                        >
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
                                                                                    $
                                                                                    {Number(
                                                                                        menu.price || 0
                                                                                    ).toFixed(2)}
                                                                                </span>

                                                                                <Button
                                                                                    type="button"
                                                                                    size="sm"
                                                                                    variant="primary"
                                                                                    className="rounded-3 text-white"
                                                                                    onClick={() =>
                                                                                        addMenuToOrder(menu)
                                                                                    }
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
                                                                    filteredMenuItems.length
                                                                )}
                                                            </strong>{" "}
                                                            of{" "}
                                                            <strong>
                                                                {filteredMenuItems.length}
                                                            </strong>{" "}
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
                                                                    setMenuPage((prev) =>
                                                                        Math.max(prev - 1, 1)
                                                                    )
                                                                }
                                                            >
                                                                Prev
                                                            </Button>

                                                            {Array.from({ length: totalMenuPages }, (_, index) => index + 1).map(
                                                                (page) => (
                                                                    <Button
                                                                        key={page}
                                                                        type="button"
                                                                        size="sm"
                                                                        variant={menuPage === page ? "primary" : "light"}
                                                                        className={`rounded-3 border ${menuPage === page ? "text-white" : "text-dark"
                                                                            }`}
                                                                        onClick={() => setMenuPage(page)}
                                                                    >
                                                                        {page}
                                                                    </Button>
                                                                )
                                                            )}

                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="light"
                                                                className="rounded-3 border"
                                                                disabled={menuPage === totalMenuPages}
                                                                onClick={() =>
                                                                    setMenuPage((prev) =>
                                                                        Math.min(prev + 1, totalMenuPages)
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
                                        <h5 className="fw-bold mb-3">
                                            Selected Items
                                        </h5>

                                        <div className="table-responsive" style={{
                                            maxHeight: "250px",
                                            overflowY: "auto"
                                        }}>
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
                                                                No items
                                                                selected
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        fields.map(
                                                            (field, index) => {
                                                                const item =
                                                                    watchedItems?.[
                                                                    index
                                                                    ] || {};

                                                                return (
                                                                    <tr
                                                                        key={
                                                                            field.id
                                                                        }
                                                                    >
                                                                        <td>
                                                                            <div className="fw-semibold">
                                                                                {item.name ||
                                                                                    "-"}
                                                                            </div>
                                                                            <small className="text-muted">
                                                                                $
                                                                                {Number(
                                                                                    item.price ||
                                                                                    0
                                                                                ).toFixed(
                                                                                    2
                                                                                )}
                                                                            </small>
                                                                        </td>

                                                                        <td>
                                                                            <div className="d-flex align-items-center">
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="light"
                                                                                    size="sm"
                                                                                    className="border"
                                                                                    onClick={() =>
                                                                                        decreaseQuantity(
                                                                                            index
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <Minus
                                                                                        size={
                                                                                            14
                                                                                        }
                                                                                    />
                                                                                </Button>

                                                                                <div
                                                                                    className="px-3 py-1 border-top border-bottom"
                                                                                    style={{
                                                                                        minWidth:
                                                                                            "42px",
                                                                                        textAlign:
                                                                                            "center",
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        item.quantity
                                                                                    }
                                                                                </div>

                                                                                <Button
                                                                                    type="button"
                                                                                    variant="light"
                                                                                    size="sm"
                                                                                    className="border"
                                                                                    onClick={() =>
                                                                                        increaseQuantity(
                                                                                            index
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <Plus
                                                                                        size={
                                                                                            14
                                                                                        }
                                                                                    />
                                                                                </Button>
                                                                            </div>
                                                                        </td>

                                                                        <td className="fw-semibold">
                                                                            $
                                                                            {Number(
                                                                                (item.price || 0) *
                                                                                (item.quantity || 1)
                                                                            ).toFixed(
                                                                                2
                                                                            )}
                                                                        </td>

                                                                        <td style={{ minWidth: "160px" }}>
                                                                            <Form.Control
                                                                                placeholder="Notes"
                                                                                {...register(
                                                                                    `items.${index}.notes`
                                                                                )}
                                                                            />
                                                                        </td>

                                                                        <td>
                                                                            <Button
                                                                                type="button"
                                                                                variant="link"
                                                                                className="text-danger p-0"
                                                                                onClick={() =>
                                                                                    remove(
                                                                                        index
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Trash2
                                                                                    size={
                                                                                        18
                                                                                    }
                                                                                />
                                                                            </Button>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                        )
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>

                                        <hr />

                                        <div className="mt-4">
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">
                                                    Subtotal ({selectedItemsCount} items)
                                                </span>
                                                <strong>${subtotal.toFixed(2)}</strong>
                                            </div>

                                            <div className="text-muted small">
                                                Final total calculation will be handled from database.
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