import React from 'react'

const LeftSide = () => {
  return (
    <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white items-center justify-center p-12">

  <div className="text-center space-y-6 max-w-md">

    {/* Heading */}
    <h1 className="text-5xl font-bold leading-tight">
      Secure Dashboard
    </h1>

    {/* Subtitle */}
    <p className="text-gray-300 text-lg">
      Manage your account, tokens, authentication, and sessions with enterprise-grade security.
    </p>

    {/* CTA Button */}
    <div className="pt-6">

      <p className="text-xs text-gray-400 mt-3">
        Start managing your system in seconds
      </p>

    </div>

  </div>

</div>
  )
}

export default LeftSide
