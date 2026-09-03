"use client";

import { confirmSignUp } from "aws-amplify/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useState } from "react";

const schema = yup.object().shape({
  otp: yup
    .string()
    .required("OTP is required")
    .matches(/^[0-9]{6}$/, "OTP must be exactly 6 digits"),
});

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const username = searchParams.get("email");

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
  if (!username) {
    toast.error("Email missing. Please signup again.", {
      className: "bg-red-600 text-white",
    });
    return;
  }

  const toastId = toast.loading("Verifying OTP...");

  setLoading(true);

  try {
    await confirmSignUp({
      username,
      confirmationCode: data.otp,
    });

    toast.update(toastId, {
      render: "OTP verified successfully",
      type: "success",
      isLoading: false,
      autoClose: 2000,
      className: "bg-green-600 text-white",
    });

    setTimeout(() => {
      router.push("/login");
    }, 1500);

  } catch (err) {
    console.log(err);

    let message = "Invalid OTP. Please try again.";

    if (err.message?.includes("CodeMismatchException")) {
      message = "Wrong OTP entered";
    } else if (err.message?.includes("ExpiredCodeException")) {
      message = "OTP expired. Request a new one";
    }

    toast.update(toastId, {
      render: message,
      type: "error",
      isLoading: false,
      autoClose: 2000,
      className: "bg-red-600 text-white",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">

  <form
    onSubmit={handleSubmit(onSubmit)}
    className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl space-y-6"
  >

    {/* Header */}
    <div className="text-center space-y-2">
      <h2 className="text-3xl font-bold text-gray-800">
        Verify OTP
      </h2>
      <p className="text-sm text-gray-500">
        Enter the 6-digit code sent to your email
      </p>
    </div>

    {/* OTP Input */}
    <div>
      <input
        type="text"
        maxLength={6}
        placeholder="Enter OTP"
        {...register("otp")}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center tracking-[0.4em] text-lg focus:outline-none focus:ring-2 focus:ring-black transition"
      />

      <p className="text-red-500 text-sm text-center mt-2">
        {errors.otp?.message}
      </p>
    </div>

    {/* Button */}
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 active:scale-[0.98] transition disabled:opacity-50"
    >
      {loading ? "Verifying..." : "Verify OTP"}
    </button>

    {/* Footer */}
    <div className="text-center space-y-2">
      <p className="text-sm text-gray-500">
        Didn’t receive the code?
      </p>

      <button
        type="button"
        className="text-sm text-blue-600 font-medium hover:underline"
      >
        Resend OTP
      </button>
    </div>

  </form>

</div>
  );
}