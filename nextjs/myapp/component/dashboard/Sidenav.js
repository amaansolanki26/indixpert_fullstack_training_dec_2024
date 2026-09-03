import Link from 'next/link'
import React from 'react'

const Sidenav = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">

        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Dashboard
        </h2>

        <nav className="space-y-2 flex-1">

          <Link
            href="/dashboard"
            className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition"
          >
            Home
          </Link>

          {/* Add more links if needed */}
          <Link
            href="/form"
            className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition"
          >
            Enrollment Form
          </Link>

          <Link
            href="/details"
            className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition"
          >
            Student Details
          </Link>
          <Link href="/pagination"
          className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition">
            Users Data
          </Link>

        </nav>

        <div className="mt-auto pt-6 border-t border-gray-200">

          <p className="text-xs text-gray-400">
            Logged in securely
          </p>

        </div>

      </aside>
  )
}

export default Sidenav
