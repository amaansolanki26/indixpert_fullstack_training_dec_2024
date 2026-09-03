"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PurchaseForm from "@/components/purchase/PurchaseForm";
import { purchaseService } from "@/services/purchaseService";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

export default function AddPurchasePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatDate = (date) => {
        if (!date) return null;

        const d = new Date(date);

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const handleAddPurchase = async (formData) => {
        try {
            setIsSubmitting(true);

            const finalPayload = {
                inventory_id: Number(formData.inventoryId),
                po_no: formData.orderId || "",
                item_name: formData.itemName || "",
                item_category: formData.itemCategory || "",
                vendor_supplier: formData.vendorSupplier || "",
                price: Number(formData.price || 0),
                quantity: Number(formData.qty || 0),
                total_amount: Number(formData.total || 0),
                order_status: formData.status || "Pending",
                delivery_progress: Number(formData.deliveryProgress || 0),
                arrival_date: formatDate(formData.arrivalDate),
            };

            await purchaseService.createPurchaseOrder(finalPayload);
            toast.success("Purchase order added successfully!");

            setTimeout(() => {
                router.push("/purchase-order");
            }, 1200);

        } catch (err) {
            toast.error(err.response?.data?.message || err.message || "Failed to create purchase order.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="purchase-action-page position-relative">

            {isSubmitting && (
                <div
                    className="position-fixed top-50 start-50 translate-middle bg-white p-3 rounded shadow d-flex align-items-center gap-2"
                    style={{ zIndex: 1050 }}
                >
                    <Spinner animation="border" size="sm" variant="primary" />
                    <span className="fw-medium text-secondary">Saving to Database...</span>
                </div>
            )}

            <PurchaseForm
                buttonText={isSubmitting ? "Processing..." : "Add Purchase"}
                onSubmit={handleAddPurchase}
                disabled={isSubmitting}
            />
        </div>
    );
}