"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchAuthSession, signIn } from "aws-amplify/auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import LeftSide from "@/component/auth/LeftSide";
import { useDispatch } from "react-redux";
import { setToken } from "@/redux/features/authSlice";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import api from "@/helper/utils/api";


const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Login() {


  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const toastId = toast.loading("Logging in...");

    try {
      const { isSignedIn } = await signIn({
        username: data.email,
        password: data.password,
      });

      if (isSignedIn) {
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();
        await api.post("/users"); // ONLY HERE TO CREATE USER IN DB, NOT FOR AUTHENTICATION

        dispatch(setToken(token));


        toast.update(toastId, {
          render: "Login successful ",
          type: "success",
          isLoading: false,
          autoClose: 2000,
          className: "bg-green-600 text-white font-medium",
        });

        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (err) {
      toast.update(toastId, {
        render: err.message || "Login failed",
        type: "error",
        isLoading: false,
        autoClose: 2000,
        className: "bg-red-600 text-white font-medium",
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left SIDE - VISUAL */}
      <LeftSide />

      {/* Right SIDE - FORM */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-white px-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-6"
        >
          <div className="space-y-1">
            <h2 className="text-4xl font-bold text-gray-800">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm">
              Login to continue to your dashboard
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="w-full mt-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p className="text-red-500 text-sm mt-1">
              {errors.email?.message}
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className="w-full border border-gray-300 p-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </span>
            </div>

            <p className="text-red-500 text-sm mt-1">
              {errors.password?.message}
            </p>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 active:scale-[0.98] transition"
          >
            Login
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-blue-600 font-medium hover:underline">
              Create account
            </Link>
          </p>
        </form>
      </div>


    </div>
  );
}