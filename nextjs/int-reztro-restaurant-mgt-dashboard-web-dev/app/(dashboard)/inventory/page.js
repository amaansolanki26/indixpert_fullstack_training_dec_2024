import InventoryOverview from "@/components/inventory/InventoryOverview";
import InventoryTable from "@/components/inventory/InventoryTable";

export default function InventoryPage() {
  return (
    <div className="inventory-page">
      <InventoryOverview />
      <InventoryTable />
    </div>
  );
}