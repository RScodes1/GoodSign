import React from "react";

export default function DocumentUploadHandler({ onFileSelected }) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onFileSelected(file);
  };

  return (
    <input
      id="doc-upload"
      type="file"
      accept="application/pdf,image/*"
      className="hidden"
      onChange={handleFileChange}
    />
  );
}
