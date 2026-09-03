"use client";

import { useEffect, useState } from "react";
import Sidenav from "@/component/dashboard/Sidenav";
import api from "@/helper/utils/api";
import Card from "@/component/dashboard/Card";
import { toast } from "react-toastify";

const Pagination = () => {
    const [users, setUsers] = useState([]);
    const [offset, setOffset] = useState(0);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [viewMode, setViewMode] = useState("table");
    const [paginationType, setPaginationType] = useState("numeric");

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [editMode, setEditMode] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
        state: "",
        city: ""
    });

    const currentPage = offset / limit + 1;
    const totalPages = Math.ceil(total / limit);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setOffset(0);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const fetchUsers = async (currentOffset) => {
        try {
            setLoading(true);

            const res = await api.get(
                `/pagination?offset=${currentOffset}&limit=${limit}&search=${debouncedSearch}`
            );

            setUsers(res.data.data);
            setTotal(res.data.total);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(offset);
    }, [offset, debouncedSearch]);

    const nextPage = () => {
        if (offset + limit < total) {
            setOffset(offset + limit);
        }
    };

    const prevPage = () => {
        if (offset - limit >= 0) {
            setOffset(offset - limit);
        }
    };

    const openUserModal = (user) => {
        setSelectedUser(user);

        setFormData({
            name: user.name,
            email: user.email,
            contact: user.contact,
            state: user.state,
            city: user.city
        });

        setEditMode(false);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
        setEditMode(false);
        setShowDeleteModal(false);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const updateUser = async () => {
        try {
            await api.put(
                `/users/${selectedUser.id}`,
                formData
            );

            setUsers(
                users.map((u) =>
                    u.id === selectedUser.id
                        ? { ...u, ...formData }
                        : u
                )
            );

            setSelectedUser({
                ...selectedUser,
                ...formData
            });

            setEditMode(false);

            toast.success("User updated successfully");

        } catch (error) {
            console.error(error);
            toast.error("Update failed");
        }
    };

    const deleteUser = async () => {
        try {

            await api.delete(`/users/${selectedUser.id}`);

            const updatedUsers = users.filter(
                (u) => u.id !== selectedUser.id
            );

            setUsers(updatedUsers);

            setTotal((prev)=>prev-1);

            if(updatedUsers.length===0 && offset>0){
                setOffset(offset-limit);
            }

            closeModal();

            toast.success("User deleted successfully");

        } catch (error) {
            console.error(error);
            toast.error("Delete failed");
        }
    };

        const getPagination = () => {
            const pages = [];

            if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {

                pages.push(1);

                if (currentPage > 3) {
                    pages.push("...");
                }

                const start = Math.max(2, currentPage - 1);
                const end = Math.min(
                    totalPages - 1,
                    currentPage + 1
                );

                for (let i = start; i <= end; i++) {
                    pages.push(i);
                }

                if (currentPage < totalPages - 2) {
                    pages.push("...");
                }

                pages.push(totalPages);
            }

            return pages;
        };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidenav />

            <div className="flex-1 flex flex-col">
                <main className="p-6">

                    <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                        <h1 className="text-xl font-bold">
                            Users Table
                        </h1>

                        <div className="flex gap-3 flex-wrap">

                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e)=>setSearch(e.target.value)}
                                className="border rounded-lg px-4 py-2 w-72"
                            />

                            <button
                                onClick={() =>
                                    setViewMode(
                                        viewMode==="table"
                                            ? "card"
                                            : "table"
                                    )
                                }
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Switch to {viewMode==="table" ? "Card":"Table"} View
                            </button>

                            <button
                                onClick={() =>
                                    setPaginationType(
                                        paginationType==="numeric"
                                        ? "ellipsis"
                                        : "numeric"
                                    )
                                }
                                className="px-4 py-2 bg-green-600 text-white rounded"
                            >
                                Toggle Pagination
                            </button>

                        </div>
                    </div>

                    {viewMode==="table" ? (
                        <div className="overflow-x-auto bg-white shadow rounded-lg">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="p-3">ID</th>
                                        <th className="p-3">Name</th>
                                        <th className="p-3">Email</th>
                                        <th className="p-3">Contact</th>
                                        <th className="p-3">State</th>
                                        <th className="p-3">City</th>
                                    </tr>
                                </thead>

                                <tbody>

                                {loading ? (
                                    <tr>
                                        <td
                                          colSpan="6"
                                          className="text-center p-4"
                                        >
                                            Loading...
                                        </td>
                                    </tr>
                                ) : users.length>0 ? (

                                    users.map((user)=>(
                                        <tr
                                            key={user.id}
                                            className="border-t"
                                        >
                                            <td className="p-3">
                                                <button
                                                    onClick={() =>
                                                      openUserModal(user)
                                                    }
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {user.id}
                                                </button>
                                            </td>

                                            <td className="p-3">
                                                {user.name}
                                            </td>

                                            <td className="p-3">
                                                {user.email}
                                            </td>

                                            <td className="p-3">
                                                {user.contact}
                                            </td>

                                            <td className="p-3">
                                                {user.state}
                                            </td>

                                            <td className="p-3">
                                                {user.city}
                                            </td>

                                        </tr>
                                    ))

                                ) : (
                                    <tr>
                                        <td
                                          colSpan="6"
                                          className="text-center p-4"
                                        >
                                            No data found
                                        </td>
                                    </tr>
                                )}

                                </tbody>
                            </table>
                        </div>
                    ) : (

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {users.map((user)=>(
                                <div
                                    key={user.id}
                                    onClick={()=>openUserModal(user)}
                                    className="cursor-pointer"
                                >
                                    <Card user={user}/>
                                </div>
                            ))}
                        </div>

                    )}

                    {/* Pagination */}
                    <div className="flex justify-center mt-6 gap-2 flex-wrap">

                        <button
                            onClick={prevPage}
                            disabled={offset===0}
                            className="px-3 py-1 rounded border bg-white disabled:opacity-40"
                        >
                            Prev
                        </button>

                        {paginationType==="numeric" &&
                            Array.from(
                                {length:totalPages},
                                (_,index)=>(
                                    <button
                                        key={index}
                                        onClick={()=>setOffset(index*limit)}
                                        className={`px-3 py-1 rounded border ${
                                            currentPage===index+1
                                            ? "bg-blue-500 text-white"
                                            : "bg-white"
                                        }`}
                                    >
                                        {index+1}
                                    </button>
                                )
                            )
                        }

                        {paginationType==="ellipsis" &&
                            getPagination().map((page,index)=>
                                page==="..." ? (
                                    <span key={index}>...</span>
                                ) : (
                                    <button
                                      key={index}
                                      onClick={() =>
                                        setOffset((page-1)*limit)
                                      }
                                      className={`px-3 py-1 rounded border ${
                                        currentPage===page
                                        ? "bg-blue-500 text-white"
                                        : "bg-white"
                                      }`}
                                    >
                                        {page}
                                    </button>
                                )
                            )
                        }

                        <button
                            onClick={nextPage}
                            disabled={offset+limit>=total}
                            className="px-3 py-1 rounded border bg-white disabled:opacity-40"
                        >
                            Next
                        </button>

                    </div>

                    {/* USER MODAL */}
                    {showModal && selectedUser && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">

                                <button
                                    onClick={closeModal}
                                    className="absolute top-3 right-4 text-xl"
                                >
                                    x
                                </button>

                                <h2 className="text-2xl font-bold mb-5">
                                    User Details
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <strong>ID:</strong> {selectedUser.id}
                                    </div>

                                    {editMode ? (
                                        <>
                                            <input
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full border p-2 rounded"
                                            />

                                            <input
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full border p-2 rounded"
                                            />

                                            <input
                                                name="contact"
                                                value={formData.contact}
                                                onChange={handleChange}
                                                className="w-full border p-2 rounded"
                                            />

                                            <input
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className="w-full border p-2 rounded"
                                            />

                                            <input
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="w-full border p-2 rounded"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <strong>Name:</strong> {selectedUser.name}
                                            </div>

                                            <div>
                                                <strong>Email:</strong> {selectedUser.email}
                                            </div>

                                            <div>
                                                <strong>Contact:</strong> {selectedUser.contact}
                                            </div>

                                            <div>
                                                <strong>State:</strong> {selectedUser.state}
                                            </div>

                                            <div>
                                                <strong>City:</strong> {selectedUser.city}
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex gap-3 mt-6">

                                    {editMode ? (
                                        <button
                                            onClick={updateUser}
                                            className="w-full bg-green-600 text-white py-2 rounded-lg"
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            onClick={()=>setEditMode(true)}
                                            className="w-full bg-yellow-500 text-white py-2 rounded-lg"
                                        >
                                            Edit
                                        </button>
                                    )}

                                    {/* DELETE BUTTON */}
                                    <button
                                        onClick={() =>
                                          setShowDeleteModal(true)
                                        }
                                        className="w-full bg-red-600 text-white py-2 rounded-lg"
                                    >
                                        Delete
                                    </button>

                                    <button
                                        onClick={closeModal}
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg"
                                    >
                                        Close
                                    </button>

                                </div>
                            </div>
                        </div>
                    )}

                    {/* CUSTOM DELETE CONFIRM MODAL */}
                    {showDeleteModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">

                            <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
                                <h2 className="text-xl font-bold mb-4">
                                    Confirm Delete
                                </h2>

                                <p className="mb-6">
                                    Are you sure you want to delete this user?
                                </p>

                                <div className="flex gap-3">

                                    <button
                                        onClick={deleteUser}
                                        className="w-full bg-red-600 text-white py-2 rounded"
                                    >
                                        Yes Delete
                                    </button>

                                    <button
                                        onClick={()=>setShowDeleteModal(false)}
                                        className="w-full bg-gray-300 py-2 rounded"
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};

export default Pagination;