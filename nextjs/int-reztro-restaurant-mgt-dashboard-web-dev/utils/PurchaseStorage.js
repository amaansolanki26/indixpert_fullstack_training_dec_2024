import { purchaseOrders } from "@/data/PurchaseOrderData";

const STORAGE_KEY = "purchase_orders";

export const getPurchaseOrders = () => {
  if (typeof window === "undefined") return purchaseOrders;

  const savedOrders = localStorage.getItem(STORAGE_KEY);

  if (!savedOrders) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(purchaseOrders));
    return purchaseOrders;
  }

  return JSON.parse(savedOrders);
};

export const addPurchaseOrder = (data) => {
  const orders = getPurchaseOrders();

  const newOrder = {
    ...data,
    id: Date.now(),
    price: Number(data.price),
    qty: Number(data.qty),
    total: Number(data.price) * Number(data.qty),
    deliveryProgress: Number(data.deliveryProgress),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify([...orders, newOrder]));

  return newOrder;
};