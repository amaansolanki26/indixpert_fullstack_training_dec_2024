"use client";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Sidenav from "@/component/dashboard/Sidenav";
import api from "@/helper/utils/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const schema = yup.object().shape({
    fullName: yup.string().required("Full name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup
        .string()
        .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
        .required("Phone is required"),
    dob: yup
        .date()
        .typeError("Date of birth is required")
        .max(new Date(), "DOB cannot be in the future")
        .required("Date of birth is required"),
    gender: yup.string().required("Gender is required"),
    course: yup.string().required("Course is required"),
    address: yup
        .string()
        .min(10, "Address must be at least 10 characters")
        .required("Address is required"),
});

export default function Form() {
    const router = useRouter();

    const searchParams = useSearchParams();
    const studentId = searchParams.get("id");
    const [initialData, setInitialData] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        const toastId = toast.loading(
            studentId ? "Updating student..." : "Submitting student..."
        );

        try {
            if (studentId) {
                await api.put(`/students/${studentId}`, data);
            } else {
                await api.post("/students", data);
            }

            toast.update(toastId, {
                render: studentId
                    ? "Student updated successfully "
                    : "Student enrolled successfully ",
                type: "success",
                isLoading: false,
                autoClose: 1500,
            });

            reset();

            setTimeout(() => {
                router.push("/details");
            }, 1500);

        } catch (err) {
            console.error(err);

            toast.update(toastId, {
                render: "Error saving student",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        }
    };

    useEffect(() => {
        const fetchStudent = async () => {
            if (!studentId) return;

            try {
                const res = await api.get(`/students/${studentId}`);

                console.log("Single Student:", res.data);

                reset(res.data);

            } catch (err) {
                console.error(err);
                toast.error("Failed to load student data");
            }
        };

        fetchStudent();
    }, [studentId, reset]);
    useEffect(() => {
        const fetchStudent = async () => {
            if (!studentId) return;

            try {
                const res = await api.get(`/students/${studentId}`);

                setInitialData(res.data);
                reset(res.data);

            } catch (err) {
                console.error(err);
                toast.error("Failed to load student data");
            }
        };

        fetchStudent();
    }, [studentId, reset]);
    const handleReset = () => {
        if (studentId && initialData) {
            reset(initialData);
        } else {
            reset();
        }
    };
    const inputClass =
        "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

    const errorClass = "text-red-500 text-sm mt-1";

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidenav />

            {/* MAIN AREA */}
            <div className="flex-1 flex flex-col">

                {/* CONTENT */}
                <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

                    <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">

                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                            {studentId ? "Update Student" : "Student Enrollment Form"}
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                            {/* Full Name */}
                            <div>
                                <input
                                    placeholder="Full Name"
                                    {...register("fullName")}
                                    className={inputClass}
                                />
                                <p className={errorClass}>
                                    {errors.fullName?.message}
                                </p>
                            </div>

                            {/* Email */}
                            <div>
                                <input
                                    placeholder="Email"
                                    {...register("email")}
                                    className={inputClass}
                                />
                                <p className={errorClass}>
                                    {errors.email?.message}
                                </p>
                            </div>

                            {/* Phone */}
                            <div>
                                <input
                                    placeholder="Phone Number"
                                    {...register("phone")}
                                    className={inputClass}
                                />
                                <p className={errorClass}>
                                    {errors.phone?.message}
                                </p>
                            </div>

                            {/* DOB */}
                            <div>
                                <input
                                    type="date"
                                    max={new Date().toISOString().split("T")[0]}
                                    {...register("dob")}
                                    className={inputClass}
                                />
                                <p className={errorClass}>
                                    {errors.dob?.message}
                                </p>
                            </div>

                            {/* Gender + Course */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>
                                    <select {...register("gender")} className={inputClass}>
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <p className={errorClass}>
                                        {errors.gender?.message}
                                    </p>
                                </div>

                                <div>
                                    <select {...register("course")} className={inputClass}>
                                        <option value="">Select Course</option>
                                        <option value="BCA">BCA</option>
                                        <option value="BTech">BTech</option>
                                        <option value="BBA">BBA</option>
                                        <option value="MBA">MBA</option>
                                    </select>
                                    <p className={errorClass}>
                                        {errors.course?.message}
                                    </p>
                                </div>

                            </div>

                            {/* Address */}
                            <div>
                                <textarea
                                    placeholder="Address"
                                    {...register("address")}
                                    className={inputClass}
                                    rows={3}
                                />
                                <p className={errorClass}>
                                    {errors.address?.message}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                                >
                                    {isSubmitting
                                        ? studentId
                                            ? "Updating..."
                                            : "Submitting..."
                                        : studentId
                                            ? "Update Student"
                                            : "Enroll Student"}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="w-full bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 rounded-lg transition"
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}