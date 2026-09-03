"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MenuForm from "@/components/menus/MenuForm";
import { toast } from "react-toastify";
import { menuService } from "@/services/menuService";

export default function EditMenuPage() {

  const router = useRouter();

  const [menu, setMenu] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setId(params.get("id"));
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchMenuDetails = async () => {
      try {
        const response = await menuService.getMenuItemById(id);

        const data =
          response?.data?.data ||
          response?.data?.menu_item ||
          response?.data ||
          null;

        if (!data) {
          setMenu(null);
          return;
        }

        const formattedData = {
          id: data.menu_id || data.id,
          name: data.name || "",
          image: data.image_url || data.image || "",
          price: Number(data.price || 0),
          rating: Number(data.rating || 0),
          category_id: data.category_id?.toString() || "",

          tag_ids: data.tags?.[0]?.tag_id?.toString() || "",

          meal_time_ids: data.meal_times?.[0]?.meal_time_id?.toString() || "",

          promotion_ids: data.promotions?.[0]?.promotion_id?.toString() || "",

          description: data.description || "",
          values: data.values_text || "",

          ingredients: Array.isArray(data.ingredients)
            ? data.ingredients.join(", ")
            : data.ingredients || "",

          calories: data.nutrition?.calories || "",
          proteins: data.nutrition?.proteins || "",
          fats: data.nutrition?.fats || "",
          carbs: data.nutrition?.carbs || "",
        };
        setMenu(formattedData);
      } catch (error) {
        console.log(error);
        setMenu(null);
      }
    };

    fetchMenuDetails();

  }, [id]);

  const handleUpdateMenu = async (data) => {

    const finalData = {
      category_id: Number(data.category_id || data.category),
      name: data.name,
      image_url: data.image,
      price: Number(data.price),
      description: data.description,
      values_text: data.values,

      nutrition: data.nutrition || {
        calories: Number(data.calories || 0),
        proteins: Number(data.proteins || 0),
        fats: Number(data.fats || 0),
        carbs: Number(data.carbs || 0),
      },

      ingredients: Array.isArray(data.ingredients)
        ? data.ingredients
        : data.ingredients
          ? data.ingredients
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
          : [],

      tag_ids: data.tag_ids
        ? Array.isArray(data.tag_ids)
          ? data.tag_ids
          : [data.tag_ids]
        : [],

      meal_time_ids: data.meal_time_ids
        ? Array.isArray(data.meal_time_ids)
          ? data.meal_time_ids
          : [data.meal_time_ids]
        : [],

      promotion_ids: data.promotion_ids
        ? Array.isArray(data.promotion_ids)
          ? data.promotion_ids
          : [data.promotion_ids]
        : [],

      is_featured: false,
      is_top_rated: false,
      is_recommended: false,
      is_new: false,
    };

    try {
      await menuService.updateMenuItem(id, finalData);

      toast.success("Menu updated successfully!");

      setTimeout(() => {
        router.push(`/menu/menuDetails?id=${id}`);
      }, 1200);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Menu update failed!");
    }
  };

  if (!id) return <p>Menu id not found</p>;

  if (!menu) return <p>Menu not found</p>;

  return (
    <div className="menu-action-page">
      <MenuForm
        initialData={menu}
        buttonText="Update Menu"
        onSubmit={handleUpdateMenu}
      />
    </div>
  );
}
