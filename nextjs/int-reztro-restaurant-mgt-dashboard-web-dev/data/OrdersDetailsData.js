export const orderDetails = {
  id: 1,
  orderId: "ORD1028",
  orderType: "Online",
  status: "On Process",

  customer: {
    id: 1,
    name: "Frank Miller",
    image: "",
    address: "789 Oak Lane",
    email: "millerfrank@email.com",
    phone: "(555) 345-7890"
  },

  driver: {
    id: 1,
    name: "Jack Anderson",
    image: "",
    status: "Online",
    phone: "(555) 345-7890",
    vehicleType: "Motorcycle",
    vehicleNumber: "MM1340"
  },

  restaurant: {
    name: "Bella Italia",
    address: "456 Olive St."
  },

  delivery: {
    customerAddress: "789 Oak Lane",
    distance: "4.5 miles",
    duration: "30 min",
    deliveryTime: "11:00 AM, Oct 22 2035",
    estimatedArrivalTime: "11:30 AM, Oct 22 2035"
  },

  payment: {
    totalAmount: "$43.00",
    paymentStatus: "Paid",
    paymentMethod: "Online"
  }
};

export const orderItems = [
  {
    id: 1,
    itemName: "Smokey Supreme Pizza",
    category: "Pizza",
    image: "",
    qty: 1,
    notes: "Extra cheese",
    price: "$12.00",
    total: "$12.00"
  },
  {
    id: 2,
    itemName: "Garlic Bread",
    category: "Bakery",
    image: "",
    qty: 1,
    notes: "Lightly toasted",
    price: "$5.00",
    total: "$5.00"
  },
  {
    id: 3,
    itemName: "Caesar Salad",
    category: "Salad",
    image: "",
    qty: 2,
    notes: "Dressing on the side",
    price: "$8.00",
    total: "$16.00"
  },
  {
    id: 4,
    itemName: "Chocolate Lava Cake",
    category: "Dessert",
    image: "",
    qty: 1,
    notes: "Extra chocolate drizzle",
    price: "$10.00",
    total: "$10.00"
  }
];

export const orderTracking = [
  {
    id: 1,
    title: "Delivered",
    date: "Oct 12, 2035",
    time: "11:30 AM",
    status: "pending",
    active: false
  },
  {
    id: 2,
    title: "Out for Delivery",
    date: "Oct 12, 2035",
    time: "11:00 AM",
    status: "completed",
    active: true
  },
  {
    id: 3,
    title: "Preparing Food",
    date: "Oct 12, 2035",
    time: "10:30 AM",
    status: "completed",
    active: true
  },
  {
    id: 4,
    title: "Order Confirmed",
    date: "Oct 12, 2035",
    time: "10:18 AM",
    status: "completed",
    active: true
  },
  {
    id: 5,
    title: "Order Placed",
    date: "Oct 12, 2035",
    time: "10:15 AM",
    status: "completed",
    active: true
  }
];

export const deliveryMap = {
  restaurant: {
    name: "Bella Italia",
    address: "456 Olive St.",
    lat: 26.2389,
    lng: 73.0243
  },
  customer: {
    name: "Frank Miller",
    address: "789 Oak Lane",
    lat: 26.2594,
    lng: 73.0412
  },
  driver: {
    name: "Jack Anderson",
    lat: 26.2475,
    lng: 73.0328
  },
  route: [
    {
      lat: 26.2389,
      lng: 73.0243
    },
    {
      lat: 26.2475,
      lng: 73.0328
    },
    {
      lat: 26.2594,
      lng: 73.0412
    }
  ]
};

const OrdersDetailsData = {
  orderDetails,
  orderItems,
  orderTracking,
  deliveryMap,
}
export default OrdersDetailsData