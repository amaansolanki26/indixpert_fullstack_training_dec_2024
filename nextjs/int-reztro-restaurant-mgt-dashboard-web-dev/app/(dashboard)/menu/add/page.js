"use client";

import { useRouter } from "next/navigation";
import MenuForm from "@/components/menus/MenuForm";
import { toast } from "react-toastify";
import { menuService } from "@/services/menuService";

export default function AddMenuPage() {
  const router = useRouter();

  const handleAddMenu = async (data) => {
    const finalData = {
      category_id: Number(data.category_id || data.category),
      name: data.name,
      image_url: data.image_url || data.image,
      price: Number(data.price),
      rating: Number(data.rating || 0),
      description: data.description,
      values_text: data.values_text || data.values,

      nutrition: data.nutrition || {
        calories: Number(data.calories || 0),
        proteins: Number(data.proteins || 0),
        fats: Number(data.fats || 0),
        carbs: Number(data.carbs || 0),
      },

      ingredients: Array.isArray(data.ingredients)
        ? data.ingredients
        : data.ingredients
          ? data.ingredients.split(",").map((item) => item.trim()).filter(Boolean)
          : [],

      tag_ids: data.tag_ids || [],
      meal_time_ids: data.meal_time_ids || [],
      promotion_ids: data.promotion_ids || [],

      is_featured: data.is_featured || false,
      is_top_rated: data.is_top_rated || false,
      is_recommended: data.is_recommended || false,
      is_new: data.is_new || false,
    };

    try {
      await menuService.createMenuItem(finalData);

      toast.success("Menu added successfully!");

      setTimeout(() => {
        router.push("/menu");
      }, 1200);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Menu add failed!");
    }
  };

  return (
    <div className="menu-action-page">
      <MenuForm buttonText="Add Menu" onSubmit={handleAddMenu} />
    </div>
  );
}