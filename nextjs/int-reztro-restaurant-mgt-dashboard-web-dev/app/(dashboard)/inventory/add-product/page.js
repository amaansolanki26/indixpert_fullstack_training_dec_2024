"use client";

import { useRouter } from "next/navigation";
import ProductForm from "@/components/inventory/ProductForm";
import { inventoryService } from "@/services/inventoryService";
import { toast } from "react-toastify";
import "@/styles/inventory/addProduct/addProducts.scss";

export default function AddProductPage() {
  const router = useRouter();

  const handleAddProduct = async (formData) => {
    try {
      const payload = {
        category: {
          inventory_category_id: Number(formData.category),
        },

        item_name: formData.itemName,

        image_url: formData.image,

        unit: "Kg",

        stock: {
          stock_status: formData.status,
          qty_in_stock: Number(formData.qtyInStock),
          qty_in_reorder: Number(formData.qtyInReorder),
        },
      };

      await inventoryService.createInventoryItem(payload);

      toast.success("Product added successfully!");

      setTimeout(() => {
        router.push("/inventory");
      }, 1200);
    } catch (error) {
      console.log(error);
      toast.error("Failed to add product");
    }
  };

  return (
    <div className="inventory-action-page">
      <ProductForm
        buttonText="Add Product"
        onSubmit={handleAddProduct}
      />
    </div>
  );
}