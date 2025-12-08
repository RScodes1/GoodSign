import React, { useState, useEffect } from "react";
import Header from "../components/Header";

import CreateSignatureModal from "../components/Modals/CreateSignatureModal";
import SignaturePreviewModal from "../components/Modals/SignaturePreviewModal";
import SignaturePickerModal from "../components/Modals/SignaturePickerModal";

import DocumentUploadHandler from "../components/Document/DocumentUploadHandler";
import DocumentEditor from "../components/Document/DocumentEditor";

export default function Home() {

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSignaturePickerOpen, setIsSignaturePickerOpen] = useState(false);

  const [signatureImage, setSignatureImage] = useState(null);
  const [savedSignatures, setSavedSignatures] = useState([]);

  // ---------- Document workflow ----------
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  // Load saved signatures
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("goodsign_signatures") || "[]");
    setSavedSignatures(saved);
  }, []);

  const handleDeleteSignature = (id) => {
  const updated = savedSignatures.filter(sig => sig.id !== id);
  setSavedSignatures(updated);
  localStorage.setItem("goodsign_signatures", JSON.stringify(updated));
};

  const saveSignatureToStorage = (signature) => {
    const updated = [...savedSignatures, signature];
    setSavedSignatures(updated);
    localStorage.setItem("goodsign_signatures", JSON.stringify(updated));
  };

  const handleUploadDocument = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    setUploadedDocument({
      name: file.name,
      type: file.type,
      data: arrayBuffer,
      fileObject: file,
      appliedSignature: null,
    });
    setShowEditor(true);
  };

  // Handle signature selection
  const handleSelectSignature = (sig) => {
    setIsSignaturePickerOpen(false);
    setUploadedDocument((prev) => ({ ...prev, appliedSignature: sig }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HEADER */}
      <Header />

      {/* Hidden uploader */}
      <DocumentUploadHandler onFileSelected={handleUploadDocument} />

      {/* Document Editor */}
      {showEditor && uploadedDocument && (
        <div className="flex-1 flex justify-center items-start p-4 w-full h-full">
          <DocumentEditor
            file={uploadedDocument}
            onBack={() => setShowEditor(false)}
            openSignatureModal={() => setIsSignaturePickerOpen(true)}
          />
        </div>
      )}

      {/* MAIN LANDING PAGE CONTENT */}
      {!showEditor && (
        <div className="flex flex-col items-center text-center px-6 mt-10">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Sign Documents Effortlessly
          </h1>

          <p className="text-gray-600 mt-3 max-w-lg">
            Upload your PDFs or images, add your signature, drag, resize, and export
            professionally - all in your browser.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
              onClick={() => setIsCreateOpen(true)}
              className="px-6 py-3 bg-green-600 text-white hover:bg-green-700 rounded-xl hover:bg-gray-300"
            >
              Create Signature
            </button>

            <button
              onClick={() => document.getElementById("doc-upload")?.click()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
            >
              Upload Document
            </button>

          
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-14 max-w-4xl">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg">Upload Any Document</h3>
              <p className="text-gray-600 mt-2 text-sm">
                PDF, PNG, JPG - GoodSign supports all major formats.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg">Drag & Resize Signature</h3>
              <p className="text-gray-600 mt-2 text-sm">
                Easily position and scale your signature anywhere.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg">Export High Quality</h3>
              <p className="text-gray-600 mt-2 text-sm">
                Export signed PDFs or images with top-notch clarity.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Signature Picker */}
   <SignaturePickerModal
        isOpen={isSignaturePickerOpen}
        signatures={savedSignatures}
        onClose={() => setIsSignaturePickerOpen(false)}
        onSelect={handleSelectSignature}
        onDelete={handleDeleteSignature} 
      />


      <CreateSignatureModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={(image) => {
          setSignatureImage(image);
          setIsCreateOpen(false);
          setIsPreviewOpen(true);
        }}
      />

      {/* Preview Signature */}
      <SignaturePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        image={signatureImage}
        onBack={() => {
          setIsPreviewOpen(false);
          setIsCreateOpen(true);
        }}
        onSaveFinal={(img) => saveSignatureToStorage(img)}
      />
    </div>
  );
}
