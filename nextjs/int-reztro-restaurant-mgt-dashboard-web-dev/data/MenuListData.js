export const menuFilters = {
  categories: [
    { id: 1, name: "All" },
    { id: 2, name: "Pasta" },
    { id: 3, name: "Chicken" },
    { id: 4, name: "Burgers" },
    { id: 5, name: "Beef" },
    { id: 6, name: "Salad" },
    { id: 7, name: "Noodles" },
    { id: 8, name: "Bakery" },
    { id: 9, name: "Rice" },
    { id: 10, name: "Dessert" },
    { id: 11, name: "Seafood" },
    { id: 12, name: "Beverages" },
    { id: 13, name: "Pizza" },
    { id: 14, name: "Others" },
  ],

  mealTimes: [
    { id: 1, name: "All" },
    { id: 2, name: "Snack" },
    { id: 3, name: "Breakfast" },
    { id: 4, name: "Dinner" },
    { id: 5, name: "Lunch" },
  ],

  priceRanges: [
    { id: 1, label: "$5 - $10", min: 5, max: 10 },
    { id: 2, label: "$20 - $30", min: 20, max: 30 },
    { id: 3, label: "$10 - $20", min: 10, max: 20 },
    { id: 4, label: "Above $30", min: 30, max: null },
  ],

  ratings: [
    { id: 1, label: "5", value: 5 },
    { id: 2, label: "4", value: 4 },
    { id: 3, label: "3", value: 3 },
    { id: 4, label: "2", value: 2 },
    { id: 5, label: "1", value: 1 },
  ],

  promos: [
    { id: 1, name: "Buy 1 Get 1 Free" },
    { id: 2, name: "Seasonal Offers" },
    { id: 3, name: "10% Off" },
    { id: 4, name: "Member Discount" },
    { id: 5, name: "All Promo" },
  ],
};

export const menuItems = [
  {
    id: 1,
    name: "Smokey Supreme Pizza",
    category: "Pizza",
    mealTime: "Lunch",
    image:
      "https://t3.ftcdn.net/jpg/00/27/57/96/360_F_27579652_tM7V4fZBBw8RLmZo0Bi8WhtO2EosTRFD.jpg",
    price: 12.0,
    rating: 4.5,
    tags: ["Customizable"],
  },
  {
    id: 2,
    name: "Grilled Salmon",
    category: "Seafood",
    mealTime: "Dinner",
    image:
      "https://www.allrecipes.com/thmb/CfocX_0yH5_hFxtbFkzoWXrlycs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/ALR-12720-grilled-salmon-i-VAT-4x3-888cac0fb8a34f6fbde7bf836850cd1c.jpg",
    price: 22.0,
    rating: 4.7,
    tags: ["Customizable", "10% Off"],
  },
  {
    id: 3,
    name: "Grilled Chicken Delight",
    category: "Chicken",
    mealTime: "Lunch",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyqM1MGSv8_dpyxptXu-wG7CPv5FTvp1tdQw&s",
    price: 18.0,
    rating: 4.8,
    tags: [],
  },
  {
    id: 4,
    name: "Fiery Shrimp Salad",
    category: "Salad",
    mealTime: "Lunch",
    image:
      "https://static01.nyt.com/images/2017/08/22/dining/22COOKING-SPICYSHRIMPSALADMINT2/22COOKING-SPICYSHRIMPSALADMINT2-jumbo.jpg",
    price: 8.0,
    rating: 4.4,
    tags: [],
  },
  {
    id: 5,
    name: "Chocolate Lava Cake",
    category: "Dessert",
    mealTime: "Snack",
    image:
      "https://images.aws.nestle.recipes/resized/2020_06_23T12_02_56_mrs_ImageRecipes_147148lrg_1080_850.jpg",
    price: 10.0,
    rating: 4.9,
    tags: [],
  },
  {
    id: 6,
    name: "Classic Cheeseburger",
    category: "Burgers",
    mealTime: "Dinner",
    image:
      "https://leitesculinaria.com/wp-content/uploads/2020/02/classic-cheeseburger-1200.jpg",
    price: 10.0,
    rating: 4.6,
    tags: ["Customizable", "Buy 1 Get 1 Free"],
  },
  {
    id: 7,
    name: "Spaghetti Carbonara",
    category: "Pasta",
    mealTime: "Lunch",
    image:
      "https://www.marthastewart.com/thmb/S9xVtnWSHldvxPHKOxEq0bALG-k=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/MSL-338686-spaghetti-carbonara-hero-3x2-69999-560b45d1dd9f4741b717176eff024839.jpeg",
    price: 15.0,
    rating: 4.7,
    tags: ["Seasonal Offers"],
  },
  {
    id: 8,
    name: "Roasted Turkey Legs",
    category: "Chicken",
    mealTime: "Dinner",
    image:
      "https://foxeslovelemons.com/wp-content/uploads/2025/10/Turkey-Leg-Recipe-Foxes-Love-Lemons.jpg",
    price: 8.0,
    rating: 4.5,
    tags: ["Customizable"],
  },
  {
    id: 9,
    name: "Sunny Citrus Cake",
    category: "Dessert",
    mealTime: "Snack",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTxN6xD2MtRbiH84kuJP63R5L_bri5vqxOgQ&s",
    price: 8.5,
    rating: 4.8,
    tags: ["Member Discount"],
  },
  {
    id: 10,
    name: "Beef Steak Bowl",
    category: "Beef",
    mealTime: "Dinner",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800",
    price: 28.0,
    rating: 4.3,
    tags: ["Member Discount"],
  },
  {
    id: 11,
    name: "Chicken Noodles",
    category: "Noodles",
    mealTime: "Lunch",
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800",
    price: 14.0,
    rating: 4.2,
    tags: ["10% Off"],
  },
  {
    id: 12,
    name: "Fresh Orange Juice",
    category: "Beverages",
    mealTime: "Breakfast",
    image:
      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=800",
    price: 7.0,
    rating: 4.1,
    tags: [],
  },
  {
    id: 13,
    name: "Creamy Mushroom Rice",
    category: "Rice",
    mealTime: "Lunch",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800",
    price: 11.0,
    rating: 4.4,
    tags: ["Seasonal Offers"],
  },
  {
    id: 14,
    name: "Butter Croissant",
    category: "Bakery",
    mealTime: "Breakfast",
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800",
    price: 6.0,
    rating: 4.6,
    tags: [],
  },
  {
    id: 15,
    name: "Vegetable Spring Rolls",
    category: "Others",
    mealTime: "Snack",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800",
    price: 9.0,
    rating: 4.0,
    tags: ["Buy 1 Get 1 Free"],
  },
  {
  id: 16,
  name: "Simple Veg Sandwich",
  category: "Bakery",
  mealTime: "Snack",
  image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=800",
  price: 6.0,
  rating: 3.5,
  tags: []
},
{
  id: 17,
  name: "Plain Rice Bowl",
  category: "Rice",
  mealTime: "Lunch",
  image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=800",
  price: 5.5,
  rating: 2.8,
  tags: []
},
{
  id: 18,
  name: "Basic Tea",
  category: "Beverages",
  mealTime: "Breakfast",
  image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800",
  price: 3.0,
  rating: 1.9,
  tags: []
}
];

const MenuListData = {
  menuFilters,
  menuItems,
};

export default MenuListData;