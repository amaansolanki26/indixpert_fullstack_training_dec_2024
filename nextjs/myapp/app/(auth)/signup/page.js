"use client";

import Link from "next/link";
import { signUp } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { toast } from "react-toastify";
import LeftSide from "@/component/auth/LeftSide";

import { uploadToCloudinary } from "@/helper/utils/cloudinary";



const schema = yup.object().shape({
  name: yup.string().required("Full name is required"),

  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),

  image: yup
    .mixed()
    .required("Profile image is required")
    .test("fileSize", "File too large (max 2MB)", (value) => {
      return value && value.size <= 2 * 1024 * 1024;
    })
    .test("fileType", "Only images allowed", (value) => {
      return (
        value &&
        ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
      );
    }),
});

export default function Signup() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });


  const onSubmit = async (data) => {
    try {
      let imageUrl = "";
      let uploadRes = null;

      if (imageFile) {
        uploadRes = await uploadToCloudinary(imageFile, setUploading);
        imageUrl = uploadRes.url;
      }

      if (!imageUrl) {
        throw new Error("Image upload failed");
      }

      await signUp({
        username: data.email,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
            name: data.name,
            picture: imageUrl,
          },
        },
      });

      toast.success("Signup successful! Check your email for OTP");

      router.push(`/verify?email=${data.email}`);
    } catch (error) {
      toast.error(error.message || "Signup failed!");
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left SIDE - BRAND PANEL */}
      <LeftSide />
      {/* Right SIDE - FORM */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-white px-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-5"
        >
          {/* Header */}
          <div>
            <h2 className="text-4xl font-bold text-gray-800">
              Create Account
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Sign up to get started
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              {...register("name")}
              className="w-full mt-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p className="text-red-500 text-sm mt-1">
              {errors.name?.message}
            </p>
          </div>

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

          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                className="w-full border border-gray-300 p-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />


              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
              </span>
            </div>

            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword?.message}
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Profile Image
            </label>

            <label className="mt-2 flex cursor-pointer items-center justify-center border border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition">
              <span className="text-sm text-gray-600">
                Click to upload image
              </span>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImageFile(file);
                  setValue("image", file);
                }}
              />
            </label>

            {imageFile && (
              <p className="text-sm text-gray-500 mt-2">
                Selected: {imageFile.name}
              </p>
            )}

            {uploading && (
              <p className="text-sm text-blue-500 mt-1">
                Uploading image...
              </p>
            )}

            {errors.image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 active:scale-[0.98] transition"
          >
            {uploading ? "Creating Account..." : "Signup"}
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>



    </div>
  );
}