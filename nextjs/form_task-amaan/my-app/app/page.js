"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";      
import { createUser } from "../service/userService"


const personalSchema = yup.object({
  firstName: yup.string().min(2).max(50).matches(/^[a-zA-Z\s]+$/, "Only letters allowed").required(),
  lastName: yup.string().min(2).max(50).matches(/^[a-zA-Z\s]+$/, "Only letters allowed").required(),
  email: yup.string().email("Invalid email").required(),
  phone: yup.string().matches(/^[6-9][0-9]{9}$/, "Valid 10-digit Indian number").required(),
  dob: yup.string().required("Date of birth is required"),
  gender: yup.string().oneOf(["male", "female", "other"]).required(),
  
  address: yup.string().min(10).max(255).required(),
  city: yup.string().min(2).matches(/^[a-zA-Z\s]+$/, "Only letters").required(),
  state: yup.string().min(2).matches(/^[a-zA-Z\s]+$/, "Only letters").required(),
  country: yup.string().min(2).matches(/^[a-zA-Z\s]+$/, "Only letters").required(),
  zipCode: yup.string().matches(/^[1-9][0-9]{5}$/, "6-digit ZIP code").required(),
});

const companySchema = yup.object({
  companyName: yup.string().min(2).max(100).required(),
  designation: yup.string().min(2).max(100).required(),
  department: yup.string().min(2).max(100).required(),
  companyEmail: yup.string().email("Invalid company email").required(),
  website: yup.string().url().matches(/^(https?:\/\/)/, "Must start with http:// or https://").required(),
  gstNumber: yup.string().matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST number").required(),

  address: yup.string().min(10).max(255).required(),
  city: yup.string().min(2).matches(/^[a-zA-Z\s]+$/, "Only letters").required(),
  state: yup.string().min(2).matches(/^[a-zA-Z\s]+$/, "Only letters").required(),
  country: yup.string().min(2).matches(/^[a-zA-Z\s]+$/, "Only letters").required(),
  zipCode: yup.string().matches(/^[1-9][0-9]{5}$/, "6-digit ZIP code").required(),
});

const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-600">
      {label} <span className="text-red-500">*</span>
    </label>
    {children}
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1">
        {error}
      </p>
    )}
  </div>
);

export default function RegistrationForm() {
  const [submitted, setSubmitted] = useState({ personal: false, company: false });
  const [loading, setLoading] = useState(false);

  const personalForm = useForm({
    resolver: yupResolver(personalSchema),
    mode: "onBlur",
  });

  const companyForm = useForm({
    resolver: yupResolver(companySchema),
    mode: "onBlur",
  });

  const inputClass = (form, field) => {
    const errors = form.formState.errors;
    return `w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
      errors[field] ? "border-red-400 focus:ring-red-100" : "border-gray-300 focus:ring-blue-100 focus:border-blue-400"
    }`;
  };

  const onPersonalSubmit = async (personalData) => {
    setLoading(true);
    try {
        const payload = {
            personal: {
                firstName: personalData.firstName,
                lastName: personalData.lastName,
                email: personalData.email,
                phone: personalData.phone,
                dob: personalData.dob,
                gender: personalData.gender,
                address: {
                    address: personalData.address,
                    city: personalData.city,
                    state: personalData.state,
                    country: personalData.country,
                    zipCode: personalData.zipCode,
                }
            },
            company: null,
        };

        await createUser(payload);
        toast.success("Personal information saved successfully!");
        setSubmitted(prev => ({ ...prev, personal: true }));

    } catch (error) {
        toast.error(error.response?.data?.detail || "Failed to save personal data");
    } finally {
        setLoading(false);
    }
};

  const onCompanySubmit = async (companyData) => {
    if (!submitted.personal) {
        toast.error("Please save Personal Information first!");
        return;
    }

    setLoading(true);
    try {
        const personalData = personalForm.getValues();
        const payload = {
            personal: {
                firstName: personalData.firstName,
                lastName: personalData.lastName,
                email: personalData.email,
                phone: personalData.phone,
                dob: personalData.dob,
                gender: personalData.gender,
                address: {
                    address: personalData.address,
                    city: personalData.city,
                    state: personalData.state,
                    country: personalData.country,
                    zipCode: personalData.zipCode,
                }
            },
            company: {
                companyName: companyData.companyName,
                designation: companyData.designation,
                department: companyData.department,
                companyEmail: companyData.companyEmail,
                website: companyData.website || null,
                gstNumber: companyData.gstNumber || null,
                address: {
                    address: companyData.address,
                    city: companyData.city,
                    state: companyData.state,
                    country: companyData.country,
                    zipCode: companyData.zipCode,
                }
            }
        };

        await createUser(payload);
        toast.success("Company information saved successfully!");
        setSubmitted(prev => ({ ...prev, company: true }));
        personalForm.reset();
        companyForm.reset();
    } catch (error) {
        toast.error(error.response?.data?.detail || "Failed to save company data");
    } finally {
        setLoading(false);
    }
};
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Registration
        </h1>

        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">Personal Information</h2>
                  <p className="text-sm text-gray-500">(Required)</p>
                </div>
              </div>
              {submitted.personal && (
                <span className="text-green-600 text-sm font-medium"> Saved</span>
              )}
            </div>

            <form onSubmit={personalForm.handleSubmit(onPersonalSubmit)} className="space-y-6">
            
              <div className="grid grid-cols-2 gap-4">
                <Field label="First name" error={personalForm.formState.errors.firstName?.message}>
                  <input type="text" {...personalForm.register("firstName")} placeholder="John" className={inputClass(personalForm, "firstName")} />
                </Field>

                <Field label="Last name" error={personalForm.formState.errors.lastName?.message}>
                  <input type="text" {...personalForm.register("lastName")} placeholder="Doe" className={inputClass(personalForm, "lastName")} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Email" error={personalForm.formState.errors.email?.message}>
                  <input type="email" {...personalForm.register("email")} placeholder="john@example.com" className={inputClass(personalForm, "email")} />
                </Field>

                <Field label="Phone number" error={personalForm.formState.errors.phone?.message}>
                  <input type="text" {...personalForm.register("phone")} placeholder="9876543210" maxLength={10} className={inputClass(personalForm, "phone")} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Date of birth" error={personalForm.formState.errors.dob?.message}>
                  <input type="date" {...personalForm.register("dob")} className={inputClass(personalForm, "dob")} />
                </Field>

                <Field label="Gender" error={personalForm.formState.errors.gender?.message}>
                  <select {...personalForm.register("gender")} className={inputClass(personalForm, "gender")}>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Address Details</h3>
                <Field label="Address" error={personalForm.formState.errors.address?.message}>
                  <textarea {...personalForm.register("address")} rows={3} placeholder="123, Main Street, Near City Park" className={inputClass(personalForm, "address")} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="City" error={personalForm.formState.errors.city?.message}>
                  <input type="text" {...personalForm.register("city")} placeholder="Mumbai" className={inputClass(personalForm, "city")} />
                </Field>

                <Field label="State" error={personalForm.formState.errors.state?.message}>
                  <input type="text" {...personalForm.register("state")} placeholder="Maharashtra" className={inputClass(personalForm, "state")} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Country" error={personalForm.formState.errors.country?.message}>
                  <input type="text" {...personalForm.register("country")} placeholder="India" className={inputClass(personalForm, "country")} />
                </Field>

                <Field label="ZIP code" error={personalForm.formState.errors.zipCode?.message}>
                  <input type="text" {...personalForm.register("zipCode")} placeholder="400001" maxLength={6} className={inputClass(personalForm, "zipCode")} />
                </Field>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3.5 rounded-xl font-medium transition"
              >
                {loading ? "Saving..." : "Save Personal Information"}
              </button>
            </form>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">Company Information</h2>
                  <p className="text-sm text-gray-500">(Optional)</p>
                </div>
              </div>
              {submitted.company && (
                <span className="text-green-600 text-sm font-medium"> Saved</span>
              )}
            </div>

            <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <Field label="Company name" error={companyForm.formState.errors.companyName?.message}>
                  <input type="text" {...companyForm.register("companyName")} placeholder="Acme Corp" className={inputClass(companyForm, "companyName")} />
                </Field>

                <Field label="Designation" error={companyForm.formState.errors.designation?.message}>
                  <input type="text" {...companyForm.register("designation")} placeholder="Software Engineer" className={inputClass(companyForm, "designation")} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Department" error={companyForm.formState.errors.department?.message}>
                  <input type="text" {...companyForm.register("department")} placeholder="Engineering" className={inputClass(companyForm, "department")} />
                </Field>

                <Field label="Company email" error={companyForm.formState.errors.companyEmail?.message}>
                  <input type="email" {...companyForm.register("companyEmail")} placeholder="john@acme.com" className={inputClass(companyForm, "companyEmail")} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Website" error={companyForm.formState.errors.website?.message}>
                  <input type="text" {...companyForm.register("website")} placeholder="https://acme.com" className={inputClass(companyForm, "website")} />
                </Field>

                <Field label="GST number" error={companyForm.formState.errors.gstNumber?.message}>
                  <input type="text" {...companyForm.register("gstNumber")} placeholder="22AAAAA0000A1Z5" maxLength={15} className={inputClass(companyForm, "gstNumber")} />
                </Field>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Company Address</h3>
                <Field label="Address" error={companyForm.formState.errors.address?.message}>
                  <textarea {...companyForm.register("address")} rows={3} placeholder="123, Main Street, Near City Park" className={inputClass(companyForm, "address")} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="City" error={companyForm.formState.errors.city?.message}>
                  <input type="text" {...companyForm.register("city")} placeholder="Mumbai" className={inputClass(companyForm, "city")} />
                </Field>

                <Field label="State" error={companyForm.formState.errors.state?.message}>
                  <input type="text" {...companyForm.register("state")} placeholder="Maharashtra" className={inputClass(companyForm, "state")} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Country" error={companyForm.formState.errors.country?.message}>
                  <input type="text" {...companyForm.register("country")} placeholder="India" className={inputClass(companyForm, "country")} />
                </Field>

                <Field label="ZIP code" error={companyForm.formState.errors.zipCode?.message}>
                  <input type="text" {...companyForm.register("zipCode")} placeholder="400001" maxLength={6} className={inputClass(companyForm, "zipCode")} />
                </Field>
              </div>

              <button
                type="submit"
                disabled={loading || !submitted.personal}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-3.5 rounded-xl font-medium transition"
              >
                {loading ? "Saving..." : "Save Company Information"}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 text-center">
          {submitted.personal && (
            <p className="text-green-600 font-medium">
               Personal information has been saved.
            </p>
          )}
          {submitted.company && (
            <p className="text-green-600 font-medium mt-1">
               Company information has been saved.
            </p>
          )}
          {!submitted.personal && (
            <p className="text-gray-500">You can submit only personal information if you don't want to add company details.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================================


// export default function Page() {

//   const {
//     register,
//     handleSubmit,
//     formState: { errors }
//   } = useForm({
//     resolver: yupResolver(schema)
//   });

//   const onSubmit = (data) => {

//     console.log(data);

//   };

//   return (

//     <div className="min-h-screen bg-gray-100 flex justify-center items-center p-10">

//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="bg-white shadow-xl rounded-xl p-8 w-full max-w-4xl"
//       >

//         <h1 className="text-3xl font-bold mb-8">

//           Personal Information

//         </h1>

//         <div className="grid grid-cols-2 gap-5 mb-5">

//           <div>

//             <label className="block mb-2">

//               First Name

//             </label>

//             <input
//               type="text"
//               {...register("firstName")}
//               className="w-full border rounded-lg p-3"
//             />

//             <p className="text-red-500 text-sm">

//               {errors.firstName?.message}

//             </p>

//           </div>

//           <div>

//             <label className="block mb-2">

//               Last Name

//             </label>

//             <input
//               type="text"
//               {...register("lastName")}
//               className="w-full border rounded-lg p-3"
//             />

//             <p className="text-red-500 text-sm">

//               {errors.lastName?.message}

//             </p>

//           </div>

//         </div>

//         <div className="grid grid-cols-2 gap-5 mb-5">

//           <div>

//             <label className="block mb-2">

//               Email

//             </label>

//             <input
//               type="email"
//               {...register("email")}
//               className="w-full border rounded-lg p-3"
//             />

//             <p className="text-red-500 text-sm">

//               {errors.email?.message}

//             </p>

//           </div>

//           <div>

//             <label className="block mb-2">

//               Phone Number

//             </label>

//             <input
//               type="text"
//               {...register("phone")}
//               className="w-full border rounded-lg p-3"
//             />

//             <p className="text-red-500 text-sm">

//               {errors.phone?.message}

//             </p>

//           </div>

//         </div>

//         <div className="grid grid-cols-2 gap-5 mb-8">

//           <div>

//             <label className="block mb-2">

//               Date Of Birth

//             </label>

//             <input
//               type="date"
//               {...register("dob")}
//               className="w-full border rounded-lg p-3"
//             />

//             <p className="text-red-500 text-sm">

//               {errors.dob?.message}

//             </p>

//           </div>

//           <div>

//             <label className="block mb-2">

//               Gender

//             </label>

//             <select
//               {...register("gender")}
//               className="w-full border rounded-lg p-3"
//             >

//               <option value="">Select</option>

//               <option>Male</option>

//               <option>Female</option>

//               <option>Other</option>

//             </select>

//             <p className="text-red-500 text-sm">

//               {errors.gender?.message}

//             </p>

//           </div>

//         </div>

//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
//         >

//           Save Personal Info

//         </button>

//       </form>

//       <hr className="my-10"/>

// <h1 className="text-3xl font-bold mb-8">

// Company Information

// </h1>

// <div className="grid grid-cols-2 gap-5 mb-5">

// <div>

// <label className="block mb-2">

// Company Name

// </label>

// <input
// type="text"
// {...register("companyName")}
// className="w-full border rounded-lg p-3"
// />

// <p className="text-red-500 text-sm">

// {errors.companyName?.message}

// </p>

// </div>

// <div>

// <label className="block mb-2">

// Designation

// </label>

// <input
// type="text"
// {...register("designation")}
// className="w-full border rounded-lg p-3"
// />

// <p className="text-red-500 text-sm">

// {errors.designation?.message}

// </p>

// </div>

// </div>

// <div className="grid grid-cols-2 gap-5 mb-5">

// <div>

// <label className="block mb-2">

// Department

// </label>

// <input
// type="text"
// {...register("department")}
// className="w-full border rounded-lg p-3"
// />

// <p className="text-red-500 text-sm">

// {errors.department?.message}

// </p>

// </div>

// <div>

// <label className="block mb-2">

// Company Email

// </label>

// <input
// type="email"
// {...register("companyEmail")}
// className="w-full border rounded-lg p-3"
// />

// <p className="text-red-500 text-sm">

// {errors.companyEmail?.message}

// </p>

// </div>

// </div>

// <div className="grid grid-cols-2 gap-5 mb-5">

// <div>

// <label className="block mb-2">

// Website

// </label>

// <input
// type="text"
// placeholder="https://company.com"
// {...register("website")}
// className="w-full border rounded-lg p-3"
// />

// <p className="text-red-500 text-sm">

// {errors.website?.message}

// </p>

// </div>

// <div>

// <label className="block mb-2">

// GST Number

// </label>

// <input
// type="text"
// {...register("gstNumber")}
// className="w-full border rounded-lg p-3"
// />

// <p className="text-red-500 text-sm">

// {errors.gstNumber?.message}

// </p>

// </div>

// </div>
// <div className="mb-5">

// <label className="block mb-2">

// Address

// </label>

// <textarea
// rows="4"
// {...register("address")}
// className="w-full border rounded-lg p-3"
// />

// <p className="text-red-500 text-sm">

// {errors.address?.message}

// </p>

// </div>
// <div className="grid grid-cols-2 gap-5 mb-5">

// <div>

// <label className="block mb-2">

// City

// </label>

// <input
// type="text"
// {...register("city")}
// className="w-full border rounded-lg p-3"
// />

// <p className="text-red-500 text-sm">

// {errors.city?.message}

// </p>

// </div>

// <div>

// <label className="block mb-2">

// State

// </label>

// <input
// type="text"
// {...register("state")}
// className="w-full border rounded-lg p-3"
// />

// <p className="text-red-500 text-sm">

// {errors.state?.message}

// </p>

// </div>

// </div>
// <div className="grid grid-cols-2 gap-5 mb-8">

// <div>

// <label className="block mb-2">

// Country

// </label>

// <input
// type="text"
// {...register("country")}
// className="w-full border rounded-lg p-3"
// />

// <p className="text-red-500 text-sm">

// {errors.country?.message}

// </p>

// </div>

// <div>

// <label className="block mb-2">

// Zip Code

// </label>

// <input
// type="text"
// {...register("zipCode")}
// className="w-full border rounded-lg p-3"
// />

// <p className="text-red-500 text-sm">

// {errors.zipCode?.message}

// </p>

// </div>

// </div>
// <button
// type="submit"
// className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-semibold transition-all duration-300"
// >

// Submit Registration

// </button>

//     </div>

//   );

// }

