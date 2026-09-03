export const orderCards = [
  {
    id: 1,
    orderId: "ORD1023",
    customerName: "Alice Johnson",
    date: "Sat, October 20, 2035",
    time: "02:47 PM",
    status: "Completed",
    orderType: "Dine-In",
    table: "Table 12",
    totalAmount: 26,
    items: [
      {
        id: 1,
        name: "Classic Italian Penne",
        qty: 1,
        price: 18,
        image: ""
      },
      {
        id: 2,
        name: "Caesar Salad",
        qty: 1,
        price: 8,
        image: ""
      }
    ],
  },
  {
    id: 2,
    orderId: "ORD1024",
    customerName: "Bob Smith",
    date: "Sat, October 20, 2035",
    time: "12:47 AM",
    status: "Cancelled",
    orderType: "Takeaway",
    table: "",
    totalAmount: 37,
    items: [
      {
        id: 1,
        name: "Pepperoni Pizza",
        qty: 2,
        price: 12,
        image: ""
      },
      {
        id: 2,
        name: "Garlic Bread",
        qty: 1,
        price: 5,
        image: ""
      },
      {
        id: 3,
        name: "Lemon Tart",
        qty: 1,
        price: 8,
        image: ""
      }
    ],
  },
  {
    id: 3,
    orderId: "ORD1026",
    customerName: "Dana White",
    date: "Sat, October 23, 2035",
    time: "01:47 PM",
    status: "On Process",
    orderType: "Dine-In",
    table: "Table 8",
    totalAmount: 36,
    items: [
      {
        id: 1,
        name: "Salmon Sushi Roll",
        qty: 3,
        price: 10,
        image: ""
      },
      {
        id: 2,
        name: "Edamame",
        qty: 1,
        price: 6,
        image: ""
      }
    ],
  },
  {
    id: 4,
    orderId: "ORD1027",
    customerName: "Eve Carter",
    date: "Sat, October 26, 2035",
    time: "03:47 PM",
    status: "On Process",
    orderType: "Dine-In",
    table: "Table 7",
    totalAmount: 20,
    items: [
      {
        id: 1,
        name: "Spaghetti Carbonara",
        qty: 1,
        price: 15,
        image: ""
      },
      {
        id: 2,
        name: "Garlic Bread",
        qty: 1,
        price: 5,
        image: ""
      }
    ],
  },
  {
    id: 5,
    orderId: "ORD1029",
    customerName: "Grace Lee",
    date: "Sat, October 27, 2035",
    time: "09:47 AM",
    status: "Completed",
    orderType: "Takeaway",
    table: "",
    totalAmount: 27,
    items: [
      {
        id: 1,
        name: "Vegan Buddha Bowl",
        qty: 2,
        price: 11,
        image: ""
      },
      {
        id: 2,
        name: "Iced Caramel Machiato",
        qty: 1,
        price: 5,
        image: ""
      }
    ],
  },
  {
    id: 6,
    orderId: "ORD1030",
    customerName: "Hannah Gold",
    date: "Sat, October 26, 2035",
    time: "08:47 AM",
    status: "Cancelled",
    orderType: "Dine-In",
    table: "Table 4",
    totalAmount: 36,
    items: [
      {
        id: 1,
        name: "Grilled Chicken Delight",
        qty: 1,
        price: 8,
        image: ""
      },
      {
        id: 2,
        name: "Smokey Supreme Pizza",
        qty: 2,
        price: 12,
        image: ""
      },
      {
        id: 3,
        name: "Tiramisu",
        qty: 1,
        price: 4,
        image: ""
      }
    ],
  }
];

const OrderData1 = {
  orderCards
}

export default OrderData1