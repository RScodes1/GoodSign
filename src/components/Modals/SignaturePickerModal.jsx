import React from "react";

export default function SignaturePickerModal({
  isOpen,
  signatures,
  onSelect,
  onClose,
  onDelete
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-4 sm:p-6
                   max-h-[80vh] sm:max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4 text-center sm:text-left">
          Select a Signature
        </h2>

        {/* Scrollable section */}
        <div className="overflow-y-auto max-h-[50vh] pr-2">
          {signatures.length === 0 ? (
            <p className="text-gray-500 text-center">No signatures saved</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {signatures.map((sig) => (
                <div
                  key={sig.id}
                  className="relative border rounded-lg p-2 hover:bg-gray-100"
                >
                  {/* Delete button (fixed position, not inside select button) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(sig.id);
                    }}
                    className="absolute -top-2 -right-2 bg-red-600 text-white 
                               rounded-full h-6 w-6 flex items-center justify-center 
                               hover:bg-red-700 shadow text-lg"
                  >
                    ×
                  </button>

                  {/* Click to select signature */}
                  <button
                    onClick={() => onSelect(sig)}
                    className="w-full flex justify-center"
                  >
                    <img
                      src={sig.image}
                      alt="Saved signature"
                      className="w-full h-20 object-contain"
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
}
