import React, { useState } from "react";

export default function SignaturePreviewModal({ isOpen, onClose, image, onBack }) {
  const [format, setFormat] = useState("png");
  const [resolution, setResolution] = useState("600x200");
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");

  if (!isOpen) return null;

  const saveToLibrary = (imgURL) => {
    const key = "goodsign_signatures";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const newSignature = { id: Date.now().toString(), image: imgURL, createdAt: Date.now(), format: "png" };
    existing.push(newSignature);
    localStorage.setItem(key, JSON.stringify(existing));
    // optional: provide feedback (toast) — omitted for brevity
  };

  const downloadSignature = () => {
    let width = 600, height = 200;
    if (resolution === "300x100") { width = 300; height = 100; }
    else if (resolution === "600x200") { width = 600; height = 200; }
    else if (resolution === "custom") { width = Number(customWidth || 600); height = Number(customHeight || 200); }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (format === "jpg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image;

    img.onload = () => {
      const aspect = img.width / img.height;
      let drawW = width;
      let drawH = drawW / aspect;
      if (drawH > height) { drawH = height; drawW = drawH * aspect; }
      const x = (width - drawW) / 2;
      const y = (height - drawH) / 2;
      ctx.drawImage(img, x, y, drawW, drawH);

      const link = document.createElement("a");
      link.download = `signature.${format}`;
      link.href = canvas.toDataURL(`image/${format}`);
      link.click();
    };
    img.onerror = () => {
      // fallback: if image can't load, still try to download original blob-url
      const link = document.createElement("a");
      link.href = image;
      link.download = `signature.${format}`;
      link.click();
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-semibold">Signature Preview</h2>
          <button onClick={onBack} className="px-4 py-1 ml-auto bg-gray-200 rounded-md hover:bg-red-600 hover:text-white">Back</button>
        </div>

        <div className="w-full h-48 border border-gray-300 rounded-md mb-4 flex items-center justify-center overflow-hidden">
          {image ? <img src={image} alt="Signature Preview" className="max-h-full max-w-full object-contain" /> : <span className="text-gray-400">No signature found</span>}
        </div>

        <div className="flex justify-between mb-4">
          <button onClick={() => setFormat("png")} className={`px-4 py-2 rounded-md w-1/2 mr-2 ${format === "png" ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>PNG</button>
          <button onClick={() => setFormat("jpg")} className={`px-4 py-2 rounded-md w-1/2 ml-2 ${format === "jpg" ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>JPG</button>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Resolution</label>
          <select value={resolution} onChange={(e) => setResolution(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 mt-1">
            <option value="300x100">300 × 100</option>
            <option value="600x200">600 × 200</option>
            <option value="custom">Custom</option>
          </select>

          {resolution === "custom" && (
            <div className="flex gap-2 mt-3">
              <input type="number" placeholder="Width" value={customWidth} onChange={(e) => setCustomWidth(e.target.value)} className="w-1/2 border border-gray-300 rounded-md p-2" />
              <input type="number" placeholder="Height" value={customHeight} onChange={(e) => setCustomHeight(e.target.value)} className="w-1/2 border border-gray-300 rounded-md p-2" />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button onClick={() => saveToLibrary(image)} className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Save to Library</button>
          <button onClick={downloadSignature} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Download {format.toUpperCase()}</button>
        </div>
      </div>
    </div>
  );
}
