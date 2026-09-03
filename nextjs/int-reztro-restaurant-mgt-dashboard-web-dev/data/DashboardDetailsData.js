export const dashboardStats = [

  {
    id: 1,
    title: "Total Orders",
    value: "48,652",
    change: "1.58%",
    type: "up",
    icon: "orders",
  },

  {
    id: 2,
    title: "Total Customers",
    value: "1248",
    change: "0.42%",
    type: "down",
    icon: "customers",
  },

  {
    id: 3,
    title: "Total Revenue",
    value: "$215,860",
    change: "2.36%",
    type: "up",
    icon: "revenue",
  },

];

export const revenueData = [

  {
    month: "Mar",
    income: 10000,
    expense: 6000,
  },

  {
    month: "Apr",
    income: 9000,
    expense: 5000,
  },

  {
    month: "May",
    income: 11000,
    expense: 6500,
  },

  {
    month: "Jun",
    income: 8500,
    expense: 4500,
  },

  {
    month: "Jul",
    income: 16580,
    expense: 7500,
  },

  {
    month: "Aug",
    income: 10000,
    expense: 3500,
  },

  {
    month: "Sep",
    income: 15000,
    expense: 7000,
  },

  {
    month: "Oct",
    income: 18500,
    expense: 5200,
  },

];

export const topCategories = [

  {
    id: 1,
    name: "Seafood",
    percentage: 30,
  },

  {
    id: 2,
    name: "Beverages",
    percentage: 25,
  },

  {
    id: 3,
    name: "Dessert",
    percentage: 25,
  },

  {
    id: 4,
    name: "Pasta",
    percentage: 20,
  },

];

export const ordersOverview = [

  {
    day: "Mon",
    orders: 135,
  },

  {
    day: "Tue",
    orders: 140,
  },

  {
    day: "Wed",
    orders: 160,
  },

  {
    day: "Thu",
    orders: 185,
    active: true,
  },

  {
    day: "Fri",
    orders: 165,
  },

  {
    day: "Sat",
    orders: 150,
  },

  {
    day: "Sun",
    orders: 158,
  },

];

export const orderTypes = [

  {
    id: 1,
    title: "Dine-In",
    percentage: 45,
    total: 900,
    icon: "dine",
  },

  {
    id: 2,
    title: "Takeaway",
    percentage: 30,
    total: 600,
    icon: "takeaway",
  },

  {
    id: 3,
    title: "Online",
    percentage: 25,
    total: 500,
    icon: "online",
  },

];

export const recentOrders = [

  {
    id: "ORD1025",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
    menu: "Salmon Sushi Roll",
    category: "Seafood",
    quantity: 3,
    amount: 30.00,
    customer: "Dana White",
    status: "On Process",
  },

  {
    id: "ORD1026",
    image:
      "https://images.unsplash.com/photo-1612874742237-6526221588e3",
    menu: "Spaghetti Carbonara",
    category: "Pasta",
    quantity: 1,
    amount: 15.00,
    customer: "Eve Carter",
    status: "Cancelled",
  },

  {
    id: "ORD1027",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    menu: "Classic Cheeseburger",
    category: "Burger",
    quantity: 1,
    amount: 10.00,
    customer: "Charlie Brown",
    status: "Completed",
  },

];

export const trendingMenus = [

  {
    id: 1,
    title: "Grilled Chicken Delight",
    category: "Chicken",
    image:
      "https://images.unsplash.com/photo-1600891964092-4316c288032e",
    rating: 4.9,
    orders: 350,
    price: 18.00,
  },

  {
    id: 2,
    title: "Sunny Citrus Cake",
    category: "Dessert",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
    rating: 4.8,
    orders: 400,
    price: 8.50,
  },

  {
    id: 3,
    title: "Fiery Shrimp Salad",
    category: "Seafood",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
    rating: 4.7,
    orders: 270,
    price: 12.00,
  },

];

export const customerReviews = [

  {
    id: 1,
    title: "Classic Italian Penne",
    description:
      "This pasta is divine! The flavor is prominent, creating a rich, savory, unforgettable taste. Highly recommend for pasta lovers!",
    customer: "Sarah M.",
    date: "Oct 12, 2035",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
  },

  {
    id: 2,
    title: "Smokey Supreme Pizza",
    description:
      "Crispy crust, generous cheese, and the perfect balance of spice in the pepperoni. A classic pizza done right.",
    customer: "Michael R.",
    date: "Oct 15, 2035",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591",
  },

  {
    id: 3,
    title: "Classic Cheeseburger",
    description:
      "Juicy burger with fresh toppings and soft bun. Taste was amazing and delivery was fast.",
    customer: "Jessica L.",
    date: "Oct 18, 2035",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
  },
];

export const recentActivities = [

  {
    id: 1,
    name: "Sylvester Quill",
    role: "Inventory Manager",
    message: 'updated inventory - 10 units of "Organic Chicken Breast"',
    time: "11:20 AM",
    icon: "inventory",
  },

  {
    id: 2,
    name: "Maria Kings",
    role: "Kitchen Admin",
    message: "marked order #ORD1028 as completed",
    time: "11:00 AM",
    icon: "order",
  },

  {
    id: 3,
    name: "William Smith",
    role: "Receptionist",
    message: "added new reservation for 4 guests at 7:00 PM",
    time: "10:30 AM",
    icon: "reservation",
  },

];

export const userProfile = {
  name: "Orlando Laurentius",
  role: "Admin",
  avatar: "",
};

const DashboardDetailsData = {
  dashboardStats,
  revenueData,
  topCategories,
  ordersOverview,
  orderTypes,
  recentOrders,
  trendingMenus,
  customerReviews,
  recentActivities,
  userProfile,
}
export default DashboardDetailsData