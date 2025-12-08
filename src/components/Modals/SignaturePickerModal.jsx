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
        className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-4 sm:p-6 max-h-[80vh] sm:max-h-[70vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4 text-center sm:text-left">
          Select a Signature
        </h2>

        {signatures.length === 0 ? (
          <p className="text-gray-500 text-center">No signatures saved</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {signatures.map((sig) => (
              <div key={sig.id} className="flex flex-col items-center gap-2">

                <button
                  onClick={() => onSelect(sig)}
                  className="border rounded-lg p-2 hover:bg-gray-100 w-full"
                >

               <button
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onDelete(sig.id) 
                   }}
                  className="text-white text-center ml-20 hover:bg-red-900 rounded-md h-7 w-7 bg-red-600 text-xl hover:underline"
                >
                  x
                </button>

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
