import { menuItems } from "./MenuListData";

export const menuDetails = menuItems.map((item) => ({
  ...item,
  rating: item.rating || 4.6,
  reviews: item.reviews || 85,
  orders: item.orders || 120,
  favorites: item.favorites || 45,
  description:
    "Refreshing and tropical smoothie bowl with a hint of coconut, topped with fresh fruit. Perfect for a light meal or a cool dessert.",
  values: [
    "Tropical & Refreshing",
    "Creamy & Indulgent",
    "Nutrient-Rich",
    "Naturally Sweet",
    "Energizing",
    "Versatile & Customizable",
  ],
  nutrition: [
    { label: "Calories", value: "320", unit: "Kcal" },
    { label: "Proteins", value: "5", unit: "gram" },
    { label: "Fats", value: "12", unit: "gram" },
    { label: "Carbs", value: "50", unit: "gram" },
  ],
  ingredients: [
    "Mango",
    "Coconut milk",
    "Banana",
    "Pineapple",
    "Coconut flakes",
    "Fresh berries",
    "Granola",
  ],
}));

export const orderChart = [
  { day: "Mon", value: 14 },
  { day: "Sun", value: 12 },
  { day: "Wed", value: 9 },
  { day: "Thu", value: 13 },
  { day: "Fri", value: 15 },
  { day: "Sat", value: 17 },
  { day: "Sun", value: 13 },
];

export const similarMenus = [
  {
    id: 1,
    title: "Nuts Berries Oatmeal",
    category: "Dessert",
    image: "https://joybauer.com/wp-content/uploads/2017/12/Oatmeal-with-berries2-500x500.jpg",
    rating: 4.7,
    price: 10,
  },
  {
    id: 2,
    title: "Pineapple Paradise Smoothie",
    category: "Beverages",
    image: "https://images.getrecipekit.com/20240109011427-soaps-20squared-20-1.png?width=650&quality=90&",
    rating: 4.5,
    price: 8,
  },
  {
    id: 3,
    title: "Green Detox Juice",
    category: "Beverages",
    image: "https://media.gettyimages.com/id/2149530722/photo/green-vegetables-on-wooden-table.jpg?s=612x612&w=gi&k=20&c=x_-B2GtCk_ou5GlffAq1nsQ-ueJCU0kxbdnsFn9V5QE=",
    rating: 4.2,
    price: 7,
  },
  {
    id: 4,
    title: "Tropical Fruit Salad",
    category: "Dessert",
    image: "https://www.jessicagavin.com/wp-content/uploads/2021/06/tropical-fruit-salad-26-1200.jpg",
    rating: 4.6,
    price: 7,
  },
];

export const reviews = [
  {
    id: 1,
    name: "Sarah L.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    date: "Oct 15, 2035",
    rating: 5,
    text: "Absolutely delicious! The mango and coconut flavors are refreshing and perfectly balanced.",
  },
  {
    id: 2,
    name: "Michael T.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    date: "Oct 15, 2034",
    rating: 4,
    text: "Very tasty and refreshing. Would love a larger portion. Great choice for a summer day!",
  },
  {
    id: 3,
    name: "Emily R.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    date: "Oct 15, 2033",
    rating: 4,
    text: "Loved the fresh taste and light texture. It’s just the right mix of sweet and healthy.",
  },
];