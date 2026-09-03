"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { signOut } from "aws-amplify/auth";
import { toast } from "react-toastify";
import api from "@/helper/utils/api";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/authSlice";
import Sidenav from "@/component/dashboard/Sidenav";

export default function Dashboard() {
  const router = useRouter();

  const [tokenInfo, setTokenInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSession, setLoadingSession] = useState(false);
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch (err) {
        console.log("Failed to fetch user", err);
      }
    };

    getUser();
  }, []);

  const getSession = async () => {
    if (loadingSession) return;
    setLoadingSession(true);

    const toastId = toast.loading("Checking session...");

    try {
      const res = await api.get("/dashboard");
      const data = res.data;

      setTokenInfo({
        message: data.message,
        token: data.token,
      });

      toast.update(toastId, {
        render: "Session loaded successfully",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });

      setLoading(false);
    } catch (err) {
      toast.update(toastId, {
        render: "Authentication failed",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });

      router.push("/login");
    } finally {
      setLoadingSession(false);
    }
  };

  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    getSession();
  }, []);

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");

    try {
      await signOut({ global: true });

      dispatch(logout());

      toast.update(toastId, {
        render: "Logged out successfully ",
        type: "success",
        isLoading: false,
        autoClose: 1500,
        className: "bg-green-600 text-white rounded-lg",
      });

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err) {
      console.log("Logout error:", err);

      toast.update(toastId, {
        render: "Logout failed",
        type: "error",
        isLoading: false,
        autoClose: 2000,
        className: "bg-red-600 text-white rounded-lg",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidenav />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">

          <h3 className="text-lg font-semibold text-gray-800">
            My Dashboard
          </h3>

          <button
            onClick={handleLogout}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Logout
          </button>

        </header>

        {/* CONTENT */}
        <main className="p-6">

          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Session Overview
          </h1>

          {tokenInfo ? (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6 max-w-2xl">

              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase">
                  Message
                </h2>
                <p className="text-gray-800 mt-1">
                  {tokenInfo.message}
                </p>
              </div>


              <button
                onClick={getSession}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Refresh Session
              </button>
              {user && (
                <div className="bg-white p-6 rounded-xl shadow-md max-w-md">

                  {user?.picture && (
                    <img
                      src={user.picture}
                      alt="profile"
                      className="w-16 h-16 rounded-full"
                    />
                  )}

                  <h2 className="text-xl font-bold">{user.name?.charAt(0).toUpperCase() + user.name?.slice(1)}</h2>
                  <p className="text-gray-600">{user.email}</p>


                  <p className="text-sm text-gray-400">
                    Verified: {user.is_verified ? "Yes" : "No"}
                  </p>
                </div>
              )}


            </div>
          ) : (
            <div className="bg-white border border-red-200 text-red-600 p-4 rounded-lg max-w-md">
              No active session found. Please login again.
            </div>
          )}

        </main>

      </div>

    </div>
  );
}