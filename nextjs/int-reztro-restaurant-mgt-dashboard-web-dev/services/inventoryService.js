import api from "./api";

const getInventoryId = (id) => id?.inventory_id || id?.id || id;

const getCategoryId = (id) =>
   id?.inventory_category_id || id?.id || id;

export const inventoryService = {
   /* ==========================================================================
      INVENTORY ITEMS CRUD
      ========================================================================== */

   // GET /inventory
   getInventoryItems: (params = {}) =>
      api.get("/inventory", { params }),

   // POST /inventory
   createInventoryItem: (payload) =>
      api.post("/inventory", payload),

   // GET /inventory/{inventory_id}
   getInventoryItemById: (id) =>
      api.get(`/inventory/${getInventoryId(id)}`),

   // PUT /inventory/{inventory_id}
   updateInventoryItem: (id, payload) =>
      api.put(`/inventory/${getInventoryId(id)}`, payload),

   // DELETE /inventory/{inventory_id}
   deleteInventoryItem: (id) =>
      api.delete(`/inventory/${getInventoryId(id)}`),

   // PATCH /inventory/{inventory_id}/stock
   updateInventoryStock: (id, stockData) =>
      api.patch(`/inventory/${getInventoryId(id)}/stock`, stockData),

   // PATCH /inventory/{inventory_id}/restore
   restoreInventoryItem: (id) =>
      api.patch(`/inventory/${getInventoryId(id)}/restore`),

   // GET /inventory/low-stock
   getLowStockItems: () =>
      api.get("/inventory/low-stock"),

   // GET /inventory/summary
   getInventorySummary: () =>
      api.get("/inventory/summary"),

   /* ==========================================================================
      INVENTORY STOCK HISTORY
      ========================================================================== */

   // GET /inventory-stock-history
   getStockHistory: (params = {}) =>
      api.get("/inventory-stock-history", { params }),

   // POST /inventory-stock-history
   addStockMovement: (payload) =>
      api.post("/inventory-stock-history", payload),

   // GET /inventory-stock-history/summary
   getStockSummary: () =>
      api.get("/inventory-stock-history/summary"),

   // GET /inventory-stock-history/chart
   getStockChart: () =>
      api.get("/inventory-stock-history/chart"),

   // GET /inventory-stock-history/inventory/{inventory_id}
   getStockHistoryByInventory: (id) =>
      api.get(`/inventory-stock-history/inventory/${getInventoryId(id)}`),

   // GET /inventory-stock-history/{stock_history_id}
   getStockHistoryById: (id) =>
      api.get(`/inventory-stock-history/${id}`),

   // PATCH /inventory-stock-history/{stock_history_id}/restore
   restoreStockHistory: (id) =>
      api.patch(`/inventory-stock-history/${id}/restore`),

   // DELETE /inventory-stock-history/{stock_history_id}
   deleteStockHistory: (id) =>
      api.delete(`/inventory-stock-history/${id}`),



   
   getCategories: () => api.get("/inventory-categories"),

   createCategory: (payload) =>
      api.post("/inventory-categories", payload),

   getCategoryById: (id) =>
      api.get(`/inventory-categories/${getCategoryId(id)}`),

   updateCategory: (id, payload) =>
      api.put(`/inventory-categories/${getCategoryId(id)}`, payload),

   deleteCategory: (id) =>
      api.delete(`/inventory-categories/${getCategoryId(id)}`),

   restoreCategory: (id) =>
      api.patch(`/inventory-categories/${getCategoryId(id)}/restore`)
};