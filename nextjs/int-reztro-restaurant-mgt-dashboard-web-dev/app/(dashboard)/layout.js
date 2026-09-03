"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Footer from "@/components/footer";
import Header from "@/components/header";
import Sidenav from "@/components/sidenav";
import { ToastContainer } from "react-toastify";

export default function Layout({ children }) {

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("idToken");

    if (!token) {
      router.replace("/signin");
      return;
    }

    try {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      if (payload.exp * 1000 < Date.now()) {

        localStorage.clear();
        sessionStorage.clear();

        document.cookie =
          "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        router.replace("/signin");
      }

    } catch (error) {

      localStorage.clear();
      sessionStorage.clear();

      document.cookie =
        "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      router.replace("/signin");
    }
  }, [router]);

  return (
    <div className="d-flex min-vh-100">

      <aside className="d-none d-md-flex flex-column flex-shrink-0">
        <Sidenav />
      </aside>

      <div className="flex-grow-1 d-flex flex-column min-vh-100 bg-dashboard main-layout">

        <Header />

        <main className="flex-grow-1 d-flex flex-column mx-4">
          {children}
          <ToastContainer
            position="top-right"
            autoClose={1200}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
          />
        </main>

        <Footer />

      </div>
    </div>
  );
}