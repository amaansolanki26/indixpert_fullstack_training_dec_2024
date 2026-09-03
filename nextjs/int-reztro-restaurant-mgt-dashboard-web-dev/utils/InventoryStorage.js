import { inventoryItems } from "@/data/InventoryData";

const STORAGE_KEY = "inventory_items";

export const getInventoryItems = () => {
  if (typeof window === "undefined") return inventoryItems;

  const savedItems = localStorage.getItem(STORAGE_KEY);

  if (!savedItems) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inventoryItems));
    return inventoryItems;
  }

  return JSON.parse(savedItems);
};

export const addInventoryItem = (data) => {
  const items = getInventoryItems();

  const newItem = {
    ...data,
    id: Date.now(),
    qtyInStock: Number(data.qtyInStock),
    qtyInReorder: Number(data.qtyInReorder),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify([...items, newItem]));

  return newItem;
};