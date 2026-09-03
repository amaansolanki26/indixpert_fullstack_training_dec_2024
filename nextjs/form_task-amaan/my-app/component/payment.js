"use client";
// component/payment.js

import { useState } from 'react';
import api from '../helper/api';

export default function PaymentPopup({ 
  defaultAmount = 2999, 
  invoiceNumber = "" 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("form"); // "form" -> "review" -> (razorpay popup)

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(defaultAmount);
  const [errors, setErrors] = useState({});

  // Holds the order/invoice data returned from backend, used in review step
  const [orderData, setOrderData] = useState(null);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => {
    setIsOpen(false);
    setStep("form");
    setErrors({});
    setOrderData(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!amount || Number(amount) <= 0) {
      newErrors.amount = "Enter a valid amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 1 -> Step 2: create the order/invoice on backend, then show review screen
  const handleCreateOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const orderRes = await api.post('/api/create-order', {
        amount: Number(amount),
        customer_id: null,
        notes: `Purchase from Next.js - ${name}`,
        customer_name: name,
        customer_email: email,
        customer_phone: phone
      });

      const data = orderRes.data;

      if (!data.success) {
        throw new Error(data.detail || "Failed to create order");
      }

      setOrderData(data);
      setStep("review");

    } catch (error) {
      console.error(error);
      alert("Error: " + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Step 2 -> Razorpay checkout popup
  const handleProceedToPay = () => {
    if (!orderData) return;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Your Company Name",
      description: orderData.invoice_number ? `Invoice #${orderData.invoice_number}` : "Test Payment",
      order_id: orderData.order_id,
      handler: async function (response) {
        try {
          const verifyRes = await api.post('/api/verify-payment', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            invoice_id: orderData.invoice_id
          });

          const verifyData = verifyRes.data;

          if (verifyData.success) {
            alert("🎉 Payment Successful!");
            closePopup();
          } else {
            alert("Payment verification failed");
          }
        } catch (err) {
          console.error(err);
          alert("Verification error: " + (err.response?.data?.detail || err.message));
        }
      },
      prefill: {
        name: name,
        email: email,
        contact: phone
      },
      theme: {
        color: "#4F46E5"
      },
      modal: {
        ondismiss: function () {
          console.log("Payment modal closed by user");
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openPopup}
        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg transition-all active:scale-95 text-lg"
      >
        Pay Now
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {step === "form" ? "Complete Payment" : "Review Invoice"}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {step === "form" ? "Secure checkout powered by Razorpay" : "Confirm details before paying"}
                </p>
              </div>
              <button
                onClick={closePopup}
                className="text-2xl text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* STEP 1: FORM */}
            {step === "form" && (
              <form onSubmit={handleCreateOrder} className="p-8">
                <div className="space-y-4 mb-6 text-left">

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="2999"
                      className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 text-white font-semibold rounded-2xl text-lg shadow-lg transition-all flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Invoice...
                    </>
                  ) : (
                    "Continue"
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: REVIEW / INVOICE SUMMARY */}
            {step === "review" && orderData && (
              <div className="p-8 text-left">
                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-5 mb-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Invoice No.</span>
                    <span className="font-semibold">{orderData.invoice_number || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Name</span>
                    <span className="font-semibold">{name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Email</span>
                    <span className="font-semibold">{email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Phone</span>
                    <span className="font-semibold">{phone}</span>
                  </div>
                  <div className="flex justify-between border-t border-zinc-200 dark:border-zinc-700 pt-3">
                    <span className="text-zinc-500">Amount</span>
                    <span className="font-bold text-emerald-600 text-lg">₹{amount}</span>
                  </div>
                </div>

                {orderData.invoice_url && (
                  <a
                    href={orderData.invoice_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-indigo-600 hover:text-indigo-700 text-sm font-medium mb-4 underline"
                  >
                    View Hosted Razorpay Invoice ↗
                  </a>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("form")}
                    className="flex-1 py-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleProceedToPay}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg transition-all"
                  >
                    Proceed to Pay
                  </button>
                </div>

                <p className="text-xs text-zinc-500 mt-6 text-center">
                  🔒 Secured by Razorpay • SSL Encrypted
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}