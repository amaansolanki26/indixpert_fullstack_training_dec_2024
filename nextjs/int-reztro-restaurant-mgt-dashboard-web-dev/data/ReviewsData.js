export const ratingSummary = {
  averageRating: 4.7,
  totalReviews: 350,
  period: "This Month",
  ratingDetails: [
    {
      id: 1,
      label: "Food Quality",
      value: 4.8,
      progress: 96,
    },
    {
      id: 2,
      label: "Service",
      value: 4.6,
      progress: 92,
    },
    {
      id: 3,
      label: "Ambiance",
      value: 4.7,
      progress: 94,
    },
    {
      id: 4,
      label: "Value for Money",
      value: 4.5,
      progress: 90,
    },
    {
      id: 5,
      label: "Cleanliness",
      value: 4.9,
      progress: 98,
    },
  ],
};

export const reviewStatistics = {
  title: "Review Statistics",
  period: "This Year",
  chartData: [
    {
      month: "Jan",
      positiveReview: 130,
      negativeReview: 85,
    },
    {
      month: "Feb",
      positiveReview: 149,
      negativeReview: 70,
    },
    {
      month: "Mar",
      positiveReview: 145,
      negativeReview: 78,
    },
    {
      month: "Apr",
      positiveReview: 160,
      negativeReview: 65,
    },
    {
      month: "May",
      positiveReview: 180,
      negativeReview: 55,
    },
    {
      month: "Jun",
      positiveReview: 190,
      negativeReview: 40,
    },
    {
      month: "Jul",
      positiveReview: 170,
      negativeReview: 52,
    },
    {
      month: "Aug",
      positiveReview: 155,
      negativeReview: 60,
    },
    {
      month: "Sep",
      positiveReview: 174,
      negativeReview: 50,
    },
    {
      month: "Oct",
      positiveReview: 168,
      negativeReview: 58,
    },
    {
      month: "Nov",
      positiveReview: 158,
      negativeReview: 75,
    },
    {
      month: "Dec",
      positiveReview: 172,
      negativeReview: 52,
    },
  ],
};

export const reviews = [
  {
    id: 1,
    itemName: "Classic Italian Penne",
    category: "Pasta",
    image: "",
    rating: 5,
    ratingText: "5/5",
    reviewDate: "Oct 20, 2035",
    reviewText:
      "A delightful dish with perfectly cooked penne pasta and a rich, savory tomato sauce. The flavors are well-balanced and satisfying. Would happily order this again!",
    customerName: "Alice Johnson",
    totalReviews: 350,
    overallRate: 4.9,
  },
  {
    id: 2,
    itemName: "Grilled Salmon",
    category: "Seafood",
    image: "",
    rating: 4.5,
    ratingText: "4.5/5",
    reviewDate: "Sep 21, 2035",
    reviewText:
      "Fresh and succulent salmon, expertly cooked and lightly seasoned. The subtle flavors perfectly complement the fish’s natural richness, a truly delicious experience.",
    customerName: "Bob Smith",
    totalReviews: 278,
    overallRate: 4.8,
  },
  {
    id: 3,
    itemName: "Fluffy Scrambled Egg",
    category: "Breakfast",
    image: "",
    rating: 4.7,
    ratingText: "4.7/5",
    reviewDate: "Sep 12, 2035",
    reviewText:
      "A fresh take on a classic, with crisp greens, tasty dressing, and a balanced flavor that satisfies.",
    customerName: "Charlie Brown",
    totalReviews: 216,
    overallRate: 4.6,
  },
  {
    id: 4,
    itemName: "Chocolate Lava Cake",
    category: "Dessert",
    image: "",
    rating: 5,
    ratingText: "5/5",
    reviewDate: "Aug 26, 2035",
    reviewText:
      "Experience the sensation of chocolate melting in your mouth! The warm, gooey center will leave you wanting more. Perfect for true dessert lovers!",
    customerName: "Grace Lee",
    totalReviews: 418,
    overallRate: 4.9,
  },
];

const reviewsData = {
  ratingSummary,
  reviewStatistics,
  reviews,
};

export default reviewsData;