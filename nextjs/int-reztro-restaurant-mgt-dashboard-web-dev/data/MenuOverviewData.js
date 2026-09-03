export const featuredMenu = [
  {
    id: 1,
    name: "Lobster Risotto",
    category: "Seafood",
    image: "",
    price: 28.0,
    rating: 4.9,
    reviews: 150,
    tags: ["Seafood", "Customizable"],
    description: "Rich, creamy texture with fresh grated parmesan",
  },
  {
    id: 2,
    name: "Vegan Buddha Bowl",
    category: "Salad",
    image: "",
    price: 14.0,
    rating: 4.8,
    reviews: 200,
    tags: ["Salad", "Customizable"],
    description: "Gluten-free, nutrient-rich, protein-packed",
  },
];

export const topRatedMenu = [
  {
    id: 1,
    name: "Roasted Turkey Legs",
    category: "Chicken",
    image: "",
    price: 20.0,
    rating: 4.9,
    orders: 580,
    views: 320,
    tags: ["Chicken", "10% Off Weekdays"],
  },
  {
    id: 2,
    name: "Smokey Supreme Pizza",
    category: "Pizza",
    image: "",
    price: 12.0,
    rating: 4.8,
    orders: 920,
    views: 500,
    tags: ["Pizza"],
  },
];

export const promoMenu = [
  {
    id: 1,
    name: "Grilled Chicken Caesar Salad",
    image: "",
    price: 11.0,
    oldPrice: 14.0,
    rating: 4.6,
    promo: "Seasonal Offers",
  },
  {
    id: 2,
    name: "Iced Caramel Macchiato",
    image: "",
    price: 4.0,
    oldPrice: 5.0,
    rating: 4.5,
    promo: "10% Off",
  },
  {
    id: 3,
    name: "Chocolate Lava Cake",
    image: "",
    price: 6.0,
    oldPrice: 8.0,
    rating: 4.8,
    promo: "Member Discount",
  },
];

export const recommendedMenu = [
  {
    id: 1,
    name: "Chicken Parmesan",
    category: "Italian",
    subCategory: "Main Course",
    image: "",
    price: 16.0,
    description:
      "Tender breaded chicken, topped with marinara and melted mozzarella.",
  },
  {
    id: 2,
    name: "Iced Matcha Dalgona Latte",
    category: "Beverages",
    image: "",
    price: 6.0,
    description:
      "Smooth and creamy matcha latte made with a rich dalgona topping.",
  },
  {
    id: 3,
    name: "Thai Basil Chicken",
    category: "Asian",
    subCategory: "Main Course",
    image: "",
    price: 14.0,
    description:
      "Authentic Thai basil chicken with a perfect balance of spice.",
  },
];

export const newMenu = [
  {
    id: 1,
    name: "Mango Coconut Smoothie Bowl",
    category: "Beverages",
    image: "",
    price: 9.0,
    tags: ["Beverages", "Dessert"],
    description:
      "Refreshing tropical smoothie bowl with coconut and fresh fruit.",
  },
  {
    id: 2,
    name: "Spicy Korean BBQ Tofu",
    category: "Vegan",
    image: "",
    price: 13.0,
    tags: ["Vegan", "Grill"],
    description:
      "A savory, spicy tofu dish grilled to perfection with Korean BBQ flavor.",
  },
  {
    id: 3,
    name: "Avocado Toast",
    category: "Breakfast",
    image: "",
    price: 7.0,
    tags: ["Breakfast", "Light Meal"],
    description:
      "Creamy avocado on toasted bread with bagel seasoning.",
  },
  {
    id: 4,
    name: "Pesto Zucchini Noodles",
    category: "Pasta",
    image: "",
    price: 11.0,
    tags: ["Pasta", "Healthy"],
    description:
      "Light zucchini noodles tossed in fresh pesto for a low-carb option.",
  },
];

const MenuOverviewData = {
  featuredMenu,
  topRatedMenu,
  promoMenu,
  recommendedMenu,
  newMenu,
};

export default MenuOverviewData;