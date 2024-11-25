import React from 'react'

function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
    <div className="relative">
      <div className="w-16 h-16 border-8 border-t-8 border-white border-opacity-60 border-t-[#BD1E51] rounded-full animate-spin-fast"></div>
      <div className="absolute inset-0 bg-gray-800 opacity-0"></div>
    </div>
  </div>
  )
}

export default LoadingScreen
