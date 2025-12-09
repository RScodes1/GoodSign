import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function CreateSignatureModal({
  isOpen,
  onClose,
  onSave,
  initialDrawnImage
}) {
  const [activeTab, setActiveTab] = useState("typed");
  const [typedName, setTypedName] = useState("");
  const [selectedFont, setSelectedFont] = useState("");
  const [fontSize, setFontSize] = useState(50);
  const [selectedWeight, setSelectedWeight] = useState("");
  const [selectedColor, setSelectedColor] = useState("#000000");

  const [uploadedFile, setUploadedFile] = useState(null);
  const [processedUpload, setProcessedUpload] = useState(null);
  const [drawnImage, setDrawnImage] = useState(initialDrawnImage || null);

  const drawCanvasRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setTypedName("");
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (activeTab !== "draw") return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    if (drawnImage) {
      const img = new Image();
      img.src = drawnImage;
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000000";

    let drawing = false;
    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const start = (e) => {
      drawing = true;
      ctx.beginPath();
      const { x, y } = getPos(e);
      ctx.moveTo(x, y);
    };
    const draw = (e) => {
      if (!drawing) return;
      const { x, y } = getPos(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    };
    const end = () => {
      drawing = false;
      setDrawnImage(canvas.toDataURL("image/png"));
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", draw);
    window.addEventListener("mouseup", end);

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", draw);
      window.removeEventListener("mouseup", end);
    };
  }, [activeTab, drawnImage]);

  useEffect(() => {
    if (!uploadedFile) return;
    const removeBG = async () => {
      const fd = new FormData();
      fd.append("image_file", uploadedFile);
      fd.append("size", "auto");
      try {
        const res = await axios.post(
          "https://api.remove.bg/v1.0/removebg",
          fd,
          {
            headers: {
              "X-Api-Key":
                process.env.REACT_APP_REMOVE_BG_KEY ||
                "zVimN1wbgWw84ycVhybM2aRE",
              "Content-Type": "multipart/form-data",
            },
            responseType: "blob",
          }
        );
        const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result; 
        setProcessedUpload(base64);
      };
      reader.readAsDataURL(res.data);
      } catch (err) {
         console.error("BG removal failed", err);

      const reader = new FileReader();
      reader.onloadend = () => {
        setProcessedUpload(reader.result);
      };
      reader.readAsDataURL(uploadedFile);
      }
    };
    removeBG();
  }, [uploadedFile]);

  if (!isOpen) return null;

  const generateSignatureImage = async () => {
    if (activeTab === "typed") {
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = selectedColor;
       await document.fonts.load(`${selectedWeight} ${fontSize}px "${selectedFont}"`);

       ctx.font = `${selectedWeight} ${fontSize}px "${selectedFont}"`;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(typedName, canvas.width / 2, canvas.height / 2);
      return canvas.toDataURL("image/png");
    }
    if (activeTab === "draw") {
      const img = drawCanvasRef.current?.toDataURL("image/png");
      if (img) setDrawnImage(img);
      return img;
    }
    if (activeTab === "upload") {
      return processedUpload;
    }
    return null;
  };

  return (
       <div
          className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
          onClick={onClose} // clicking backdrop closes modal
        >
          <div
            ref={modalRef}
            className={`bg-white rounded-lg shadow-lg w-11/12 p-6 ${
              activeTab === "draw" || activeTab === "upload" ? "max-w-xl" : "max-w-md"
            }`}
            onClick={(e) => e.stopPropagation()} // stops click from closing modal
          >
        <h2 className="text-xl font-semibold mb-4">Create Signature</h2>

        {/* Tabs */}
        <div className="flex mb-4 border-b border-gray-300">
          {["typed", "draw", "upload"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-center ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 font-semibold text-blue-600"
                  : "text-gray-500"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Typed */}
        {activeTab === "typed" && (
          <div className="mb-4">
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder="Type your name"
              className="w-full border border-gray-300 rounded-md p-2 mb-4"
            />
            <div className="flex gap-2 items-center">
              <select
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="border border-gray-300 rounded-md w-22 p-2"
              >
                <option>Select Font</option>
                <option>Allura</option>
                <option>Satisfy</option>
                <option>Alex Brush</option>
                <option>Mr Dafoe</option>
                <option>Special Elite</option>
                <option>Shadows Into Light</option>
                <option>Amatic SC</option>
                <option>Rock Salt</option>
              </select>
              <select
                value={selectedWeight}
                onChange={(e) => setSelectedWeight(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-18"
              >
                <option value="400">Regular</option>
                <option value="500">Medium</option>
                <option value="600">Semi-Bold</option>
                <option value="700">Bold</option>
              </select>
              <input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-16"
                placeholder="Size"
              />
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="h-10 w-10 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}

        {/* Draw */}
        {activeTab === "draw" && (
          <div>
            <canvas
              ref={drawCanvasRef}
              width={600}
              height={200}
              className="border border-gray-300 rounded-md mb-4 w-full bg-white"
            />
            <button
              onClick={() => {
                const ctx = drawCanvasRef.current.getContext("2d");
                ctx.clearRect(
                  0,
                  0,
                  drawCanvasRef.current.width,
                  drawCanvasRef.current.height
                );
                setDrawnImage(null);
              }}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        )}

        {/* Upload */}
        {activeTab === "upload" && (
          <div>
            <input
              type="file"
              accept="image/*"
              className="mb-4 w-full"
              onChange={(e) => setUploadedFile(e.target.files[0])}
            />
            <div className="w-full h-40 border border-gray-300 rounded-md mb-4 flex items-center justify-center overflow-hidden bg-white">
              {!processedUpload ? (
                <span className="text-gray-400">Preview Upload</span>
              ) : (
                <img
                  src={processedUpload}
                  alt="Signature Preview"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        )}

        <button
          onClick={async () => {
            const finalImage = await generateSignatureImage();
            if (!finalImage) return;
            onSave(finalImage);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
        >
          Preview
        </button>
      </div>
    </div>
  );
}
