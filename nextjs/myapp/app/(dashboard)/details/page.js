"use client";
import Sidenav from "@/component/dashboard/Sidenav";
import React, {
    useEffect,
    useRef,
    useState
} from "react";

import api from "@/helper/utils/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Details = () => {

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [course, setCourse] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 3;

    const [total, setTotal] = useState(0);

    const didRun = useRef(false);
    const router = useRouter();


    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [studentToDelete, setStudentToDelete] =
        useState(null);



    const fetchStudents = async (
        page = 1,
        searchQuery = "",
        courseFilter = ""
    ) => {

        const toastId = toast.loading(
            "Fetching students..."
        );

        try {

            const res = await api.get(
                `/students?page=${page}&limit=${studentsPerPage}&search=${searchQuery}&course=${courseFilter}`
            );

            setStudents(res.data.data);
            setTotal(res.data.total);

            toast.update(toastId, {
                render: "Students loaded successfully",
                type: "success",
                isLoading: false,
                autoClose: 1500
            });

        } catch (err) {

            console.error(
                "Error fetching students",
                err
            );

            setStudents([]);

            toast.update(toastId, {
                render: "Failed to load students",
                type: "error",
                isLoading: false,
                autoClose: 2000
            });

        } finally {
            setLoading(false);
        }

    };



    /* OPEN DELETE MODAL */
    const handleDelete = (student) => {

        setStudentToDelete(student);
        setShowDeleteModal(true);

    };



    /* CONFIRM DELETE */
    const confirmDelete = async () => {

        if (!studentToDelete) return;

        const toastId = toast.loading(
            "Deleting student..."
        );

        try {

            await api.delete(
                `/students/${studentToDelete.id}`
            );

            fetchStudents(
                currentPage,
                search,
                course
            );

            toast.update(toastId, {
                render: "Student deleted",
                type: "success",
                isLoading: false,
                autoClose: 1500
            });

        } catch (err) {

            toast.update(toastId, {
                render: "Delete failed",
                type: "error",
                isLoading: false,
                autoClose: 2000
            });

        } finally {

            setShowDeleteModal(false);
            setStudentToDelete(null);

        }

    };



    const handleUpdate = (student) => {
        router.push(
            `/form?id=${student.id}`
        );
    };


    useEffect(() => {

        if (didRun.current) return;

        didRun.current = true;

        fetchStudents(
            1,
            "",
            ""
        );

    }, []);


    const totalPages =
        Math.ceil(
            total / studentsPerPage
        ) || 1;


    if (loading) {
        return (
            <p className="text-center mt-10">
                Loading students...
            </p>
        );
    }


    return (
        <div className="flex min-h-screen bg-gray-50">

            <Sidenav />

            <div className="flex-1 flex flex-col">

                <div className="flex justify-center bg-gray-100 px-4">

                    <div className="w-full bg-white shadow-lg rounded-2xl p-8">

                        <h1 className="text-2xl font-bold mb-6">
                            Students List
                        </h1>



                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="mb-4 p-2 border rounded w-full"
                            value={search}
                            onChange={(e) => {

                                const value = e.target.value;

                                setSearch(value);

                                setCurrentPage(1);

                                fetchStudents(
                                    1,
                                    value,
                                    course
                                );

                            }}
                        />



                        <div className="flex gap-2 mb-4 flex-wrap">

                            {
                                ["", "BTech", "MTech", "BCA", "MBA"]
                                    .map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => {
                                                setCourse(c);
                                                setCurrentPage(1);
                                                fetchStudents(
                                                    1,
                                                    search,
                                                    c
                                                );
                                            }}
                                            className={`px-3 py-1 rounded ${course === c
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-300"
                                                }`}
                                        >
                                            {c || "All"}
                                        </button>
                                    ))
                            }

                        </div>




                        <div className="overflow-x-auto bg-white shadow">

                            <table className="min-w-full border">

                                <thead className="bg-gray-100">

                                    <tr>
                                        <th className="p-3 border">
                                            Sr.no.
                                        </th>

                                        <th className="p-3 border">
                                            ID
                                        </th>

                                        <th className="p-3 border">
                                            Name
                                        </th>

                                        <th className="p-3 border">
                                            Email
                                        </th>

                                        <th className="p-3 border">
                                            Phone
                                        </th>

                                        <th className="p-3 border">
                                            DOB
                                        </th>

                                        <th className="p-3 border">
                                            Course
                                        </th>

                                        <th className="p-3 border">
                                            Gender
                                        </th>

                                        <th className="p-3 border">
                                            Address
                                        </th>

                                        <th className="p-3 border">
                                            Update
                                        </th>

                                        <th className="p-3 border">
                                            Delete
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {students.length > 0 ? (

                                        students.map(
                                            (student, index) => (
                                                <tr
                                                    key={student.id}
                                                    className="text-center"
                                                >

                                                    <td className="p-3 border">
                                                        {
                                                            (currentPage - 1)
                                                            * studentsPerPage
                                                            + index + 1
                                                        }
                                                    </td>

                                                    <td className="p-3 border">
                                                        {student.id}
                                                    </td>

                                                    <td className="p-3 border">
                                                        {student.fullName}
                                                    </td>

                                                    <td className="p-3 border">
                                                        {student.email}
                                                    </td>

                                                    <td className="p-3 border">
                                                        {student.phone}
                                                    </td>

                                                    <td className="p-3 border">
                                                        {
                                                            new Date(
                                                                student.dob
                                                            ).toLocaleDateString()
                                                        }
                                                    </td>

                                                    <td className="p-3 border">
                                                        {student.course}
                                                    </td>

                                                    <td className="p-3 border">
                                                        {student.gender}
                                                    </td>

                                                    <td className="p-3 border">
                                                        {student.address}
                                                    </td>


                                                    <td className="p-3 border">

                                                        <button
                                                            onClick={() =>
                                                                handleUpdate(student)
                                                            }
                                                            className="bg-blue-500 text-white px-3 py-1 rounded"
                                                        >
                                                            Update
                                                        </button>

                                                    </td>


                                                    <td className="p-3 border">

                                                        <button
                                                            onClick={() =>
                                                                handleDelete(student)
                                                            }
                                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                                        >
                                                            Delete
                                                        </button>

                                                    </td>

                                                </tr>
                                            ))

                                    ) : (

                                        <tr>
                                            <td
                                                colSpan="11"
                                                className="p-4 text-center text-gray-500"
                                            >
                                                No students found
                                            </td>
                                        </tr>

                                    )}

                                </tbody>
                            </table>

                        </div>




                        <div className="flex justify-center mt-4 gap-2">

                            <button
                                disabled={currentPage === 1}
                                onClick={() => {
                                    const newPage =
                                        currentPage - 1;

                                    setCurrentPage(
                                        newPage
                                    );

                                    fetchStudents(
                                        newPage,
                                        search,
                                        course
                                    );
                                }}
                                className="px-3 py-1 bg-gray-300 rounded"
                            >
                                Prev
                            </button>


                            <span className="px-3 py-1">
                                Page {currentPage}
                                of {totalPages}
                            </span>


                            <button
                                disabled={
                                    currentPage >= totalPages
                                }
                                onClick={() => {

                                    const newPage =
                                        currentPage + 1;

                                    setCurrentPage(
                                        newPage
                                    );

                                    fetchStudents(
                                        newPage,
                                        search,
                                        course
                                    );

                                }}
                                className="px-3 py-1 bg-gray-300 rounded"
                            >
                                Next
                            </button>

                        </div>

                    </div>
                </div>

                {showDeleteModal &&
                    studentToDelete && (

                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

                                <h2 className="text-xl font-bold mb-4">
                                    Confirm Delete
                                </h2>

                                <p className="mb-6 text-gray-600">
                                    Are you sure you want to delete
                                    student
                                    <strong>
                                        {" "}
                                        {studentToDelete.fullName}
                                    </strong>
                                    ?
                                </p>


                                <div className="flex justify-end gap-3">

                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setStudentToDelete(null);
                                        }}
                                        className="px-4 py-2 bg-gray-300 rounded"
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        onClick={confirmDelete}
                                        className="px-4 py-2 bg-red-600 text-white rounded"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        </div>

                    )}

            </div>
        </div>
    );

};

export default Details;