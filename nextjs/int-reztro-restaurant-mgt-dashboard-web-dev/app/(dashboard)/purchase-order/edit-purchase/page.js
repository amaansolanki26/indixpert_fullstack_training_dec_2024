"use client";

import { useEffect, useState } from "react";
import { Container, Card, Spinner, Alert, Button } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { purchaseService } from "@/services/purchaseService";
import PurchaseForm from "@/components/purchase/PurchaseForm";
import { toast } from "react-toastify";

export default function EditPurchaseOrderPage() {

  const router = useRouter();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setOrderId(params.get("id"));
  }, []);

  useEffect(() => {
    if (orderId === null) return;

    const loadOrderData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await purchaseService.getPurchaseOrderById(orderId);

        const data = response?.data || response;

        if (data) {
          setInitialData(data);
        } else {
          setError("No purchase order found for the provided ID.");
        }
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to load purchase order."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrderData();
  }, [orderId]);

  const handleFormSubmit = async (formData) => {
    try {
      setSubmitLoading(true);

      const payload = {
        inventory_id: formData.inventoryId,
        po_no: formData.orderId || initialData.po_no,
        item_name: formData.itemName,
        item_category: formData.itemCategory,
        vendor_supplier: formData.vendorSupplier,
        price: formData.price,
        quantity: formData.qty,
        order_status: formData.status || initialData.order_status,
        delivery_progress: formData.deliveryProgress,
        arrival_date: formData.arrivalDate || initialData.arrival_date,
      };

      await purchaseService.updatePurchaseOrder(orderId, payload);

      toast.success("Purchase Order updated successfully!");
      router.push("/purchase-order");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Failed to update purchase order.",
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  if (orderId === null || loading){
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert
          variant="danger"
          className="d-flex justify-content-between align-items-center"
        >
          <span>{error}</span>
          <Button
            as={Link}
            href="/purchase-order"
            variant="outline-danger"
            size="sm"
          >
            Back to List
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <>

      <div className="d-flex justify-content-end align-items-center mb-4">

        <Button
          as={Link}
          href="/purchase-order"
          variant="light"
          className="border rounded-3 "
        >
          <ArrowLeft className="me-2" /> Back
        </Button>
      </div>

      <Card className="border-0 shadow-sm rounded-4 p-2">
        <Card.Body>
          <PurchaseForm
            initialData={initialData}
            onSubmit={handleFormSubmit}
            buttonText={submitLoading ? "Updating..." : "Update Purchase Order"}
            disabled={submitLoading}
          />
        </Card.Body>
      </Card>

    </>
  );
}
