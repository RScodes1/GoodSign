import React from "react";

export default function ApplySignatureModal({
  isOpen,
  onClose,
  documentUploaded,
  signatureCreated,
}) {
  if (!isOpen) return null;

  const canApply = documentUploaded && signatureCreated;

  return (
       <div
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
            onClick={onClose}// CLICK OUTSIDE
        >
      <div
        className="bg-white rounded-lg shadow-lg w-11/12 max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}  // PREVENT CLOSE ON INNER CLICK
      >
        <h2 className="text-xl font-semibold mb-4">Apply Signature</h2>

        {/* Validation Warning */}
        {!canApply && (
          <p className="text-red-600 mb-4">
            { !documentUploaded && "Please upload a document first. " }
            { !signatureCreated && "Please create a signature first." }
          </p>
        )}

        {/* Canvas Area */}
        <div
          className={`w-full h-64 border border-gray-300 rounded-md mb-4 flex items-center justify-center text-gray-400 ${
            !canApply ? "opacity-50" : ""
          }`}
        >
          {canApply
            ? "Document + Signature Canvas"
            : "Upload a document and create a signature to start"}
        </div>

        {/* Controls */}
        <div className="flex justify-between mb-4">
          <button
            className={`px-4 py-2 rounded-md hover:bg-gray-300 ${
              !canApply ? "bg-gray-200 cursor-not-allowed" : "bg-gray-100"
            }`}
            disabled={!canApply}
          >
            Move
          </button>
          <button
            className={`px-4 py-2 rounded-md hover:bg-gray-300 ${
              !canApply ? "bg-gray-200 cursor-not-allowed" : "bg-gray-100"
            }`}
            disabled={!canApply}
          >
            Scale
          </button>
          <button
            className={`px-4 py-2 rounded-md hover:bg-gray-300 ${
              !canApply ? "bg-gray-200 cursor-not-allowed" : "bg-gray-100"
            }`}
            disabled={!canApply}
          >
            Rotate
          </button>
        </div>

        {/* Apply & Save */}
        <button
          onClick={onClose}
          className={`mt-4 w-full px-4 py-2 rounded-md text-white ${
            canApply ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!canApply}
        >
          Apply & Save
        </button>
      </div>
    </div>
  );
}
