import React from "react";

export default function Header({ }) {
  return (
    <header className="w-full bg-white shadow px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
      
      {/* Logo / Title */}
      <h1 className="text-2xl font-bold text-gray-800">Good Sign</h1>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {/* Upload Document */}
        <button
          className="bg-green-600 text-white text-sm px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Home
        </button>

        {/* Create Signature */}
        <button
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          About
        </button>
      </div>
    </header>
  );
}
