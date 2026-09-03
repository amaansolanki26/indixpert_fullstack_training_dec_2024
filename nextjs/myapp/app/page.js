import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className="min-h-screen bg-gray-50">

  {/* NAVBAR */}
  <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">

    {/* Logo */}
    <h1 className="text-xl font-bold text-gray-800 tracking-wide">
      MyApp
    </h1>

    {/* Links */}
    <div className="flex items-center gap-6 text-sm font-medium">

      <Link
        href="/login"
        className="text-gray-600 hover:text-black transition"
      >
        Login
      </Link>

      <Link
        href="/signup"
        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
      >
        Signup
      </Link>

    </div>
  </nav>

  {/* HERO / CONTENT */}
  <div className="flex items-center justify-center h-[80vh] px-6">

    <div className="text-center space-y-4">

      <h2 className="text-4xl font-bold text-gray-800">
        Welcome to Home Page
      </h2>

      <p className="text-gray-500 max-w-md mx-auto">
        A clean and simple authentication system with modern UI design,
        secure login, and smooth user experience.
      </p>

      <div className="pt-4">
        <Link
          href="/signup"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Get Started
        </Link>
      </div>

    </div>

  </div>

</div>
  )
}

export default page
