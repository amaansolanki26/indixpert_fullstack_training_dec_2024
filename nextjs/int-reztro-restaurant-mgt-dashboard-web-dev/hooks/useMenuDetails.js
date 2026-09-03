"use client";

import { useEffect, useState } from "react";
import { menuService } from "@/services/menuService";
import { logger } from "@/utils/logger";
import { reviewService } from "@/services/reviewService";

function menuDetailsAdapter(data) {
  return {
    id: data.menu_id || data.id,
    name: data.name || "",
    category: data.category_name || data.category || "",
    image: data.image_url || data.image || "",
    price: Number(data.price || 0),
    rating: Number(data.rating || 0),
    description: data.description || "",
    reviews: data.reviews || data.total_reviews || 0,
    orders: data.orders || data.total_orders || 0,
    favorites: data.favorites || data.favorites_count || data.total_favorites || 0,

    tags: Array.isArray(data.tags)
      ? data.tags.map((item) => item.tag_name || item.name || item).filter(Boolean)
      : [
        data.is_featured ? "Featured" : null,
        data.is_top_rated ? "Top Rated" : null,
        data.is_recommended ? "Recommended" : null,
        data.is_new ? "New" : null,
      ].filter(Boolean),

    values: data.values_text
      ? String(data.values_text)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
      : [],

    nutrition: Array.isArray(data.nutrition)
      ? data.nutrition
      : [
        { label: "Calories", value: data.calories || data.nutrition?.calories || 0, unit: "Kcal" },
        { label: "Proteins", value: data.proteins || data.nutrition?.proteins || 0, unit: "gram" },
        { label: "Fats", value: data.fats || data.nutrition?.fats || 0, unit: "gram" },
        { label: "Carbs", value: data.carbs || data.nutrition?.carbs || 0, unit: "gram" },
      ],

    ingredients: Array.isArray(data.ingredients)
      ? data.ingredients.map((item) => item.ingredient_name || item.name || item).filter(Boolean)
      : data.ingredients_text
        ? String(data.ingredients_text)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
        : [],
  };
}

export function useMenuDetails(id) {
  const [menuDetails, setMenuDetails] = useState(null);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuError, setMenuError] = useState("");

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!id) return;

    const fetchMenuDetails = async () => {
      try {
        setMenuLoading(true);
        setMenuError("");

        const response = await menuService.getMenuItemById(id);

        const data =
          response?.data?.data ||
          response?.data?.menu_item ||
          response?.data ||
          response?.menu_item ||
          response ||
          null;

        setMenuDetails(data ? menuDetailsAdapter(data) : null);
      } catch (error) {
        logger?.error?.("MENU_DETAILS_FETCH_ERROR", error, { menuId: id });
        setMenuError(error?.message || "Failed to fetch menu details");
        setMenuDetails(null);
      } finally {
        setMenuLoading(false);
      }
    };

    fetchMenuDetails();
    loadReviews(id);
  }, [id]);

  const loadReviews = async (menuId) => {
    try {
      const res = await reviewService.getReviewsByMenu(menuId);

      const formattedReviews = (res || []).map((item) => ({
        id: item.review_id,
        image: item.customer_image,
        name: item.customer_name,
        date: new Date(item.created_at).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        rating: Number(item.rating),
        text: item.comment,
      }));

      setReviews(formattedReviews);
    } catch (error) {
      console.error("Review loading error:", error);
    }
  };

  return {
    menuDetails,
    menuLoading,
    menuError,
    reviews,
  };
}