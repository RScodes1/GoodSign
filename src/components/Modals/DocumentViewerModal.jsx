import React from "react";

export default function DocumentViewerModal({ isOpen, onClose, onApplySignature }) {
  if (!isOpen) return null;

  return (
   <div
      className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
      onClick={onClose}              // CLICK OUTSIDE
    >
      <div
        className="bg-white rounded-lg shadow-lg w-11/12 max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}  // PREVENT CLOSE ON INNER CLICK
      >
        
        <h2 className="text-xl font-semibold mb-4">Document Viewer</h2>

        {/* Document Render Area */}
        <div className="w-full h-72 border border-gray-300 rounded-md mb-4 flex items-center justify-center text-gray-400">
          PDF / Image will render here
        </div>

        {/* Page Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            Previous
          </button>

          <span className="text-gray-600 text-sm">Page 1 of 5</span>

          <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            Next
          </button>
        </div>

        {/* Action Buttons */}
        <button
          onClick={onApplySignature}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full mb-2"
        >
          Apply Signature
        </button>

        <button
          onClick={onClose}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
}
