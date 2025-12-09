import React, { useState } from "react";
import Header from "../components/Header";

import CreateSignatureModal from "../components/Modals/CreateSignatureModal";
import SignaturePreviewModal from "../components/Modals/SignaturePreviewModal";
import SignaturePickerModal from "../components/Modals/SignaturePickerModal";

import DocumentUploadHandler from "../components/Document/DocumentUploadHandler";
import DocumentEditor from "../components/Document/DocumentEditor";
import { useSignatures } from "../hooks/useSignatures";

export default function Home() {

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSignaturePickerOpen, setIsSignaturePickerOpen] = useState(false);

  const [signatureImage, setSignatureImage] = useState(null);

  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const { signatures, addSignature, removeSignature } = useSignatures();


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

         {!showEditor && (
  <div className="
    w-full px-6 mt-20
    flex flex-col lg:flex-row 
    gap-10 lg:gap-20 
    justify-center items-start
  ">

    {/* LEFT SECTION — Hero */}
    <div className="
      flex-1 max-w-2xl 
      flex flex-col items-center text-center
    ">
      <h1 className="text-5xl font-extrabold text-gray-800 leading-snug">
        Sign Documents Effortlessly
      </h1>

      <p className="text-gray-600 mt-4 text-lg max-w-xl">
        Upload PDFs or images, add your signature, drag, resize,
        and export professionally — right in your browser.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-8 py-3 bg-green-600 text-white hover:bg-green-700 rounded-xl"
        >
          Create Signature
        </button>

        <button
          onClick={() => document.getElementById("doc-upload")?.click()}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
        >
          Upload Document
        </button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-14 w-full max-w-3xl">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg">Upload Any Document</h3>
          <p className="text-gray-600 mt-2 text-sm">
            PDF, PNG, JPG — all major formats supported.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg">Drag & Resize</h3>
          <p className="text-gray-600 mt-2 text-sm">
            Position and scale signatures easily.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg">High-Quality Export</h3>
          <p className="text-gray-600 mt-2 text-sm">
            Export signed PDFs or images in great clarity.
          </p>
        </div>
      </div>
    </div>


    {/* RIGHT SECTION — Saved Signatures */}
    <div className="
      w-full lg:w-60 
      bg-white rounded-xl shadow p-4 
      h-[500px] overflow-y-auto
      flex-shrink-0
    ">
      <h2 className="text-xl font-bold mb-4 text-center">Saved Signatures</h2>

      {signatures.length === 0 ? (
        <p className="text-gray-500 text-center text-sm">No saved signatures yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {signatures.map(sig => (
            <div
              key={sig.id}
              className="bg-gray-50 p-3 rounded-xl shadow relative flex flex-col items-center"
            >
              {/* delete */}
              <button
                onClick={() => removeSignature(sig.id)}
                className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-700"
              >
                ×
              </button>

              {/* signature preview */}
              <img
                src={sig.image}
                alt="signature"
                className="w-full h-20 object-contain"
              />

              {/* download */}
              <button
                className="mt-2 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = sig.image;
                  a.download = `signature-${sig.id}.png`;
                  a.click();
                }}
              >
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

  </div>
)}

  <SignaturePickerModal
        isOpen={isSignaturePickerOpen}
        signatures={signatures}
        onClose={() => setIsSignaturePickerOpen(false)}
        onSelect={handleSelectSignature}
        onDelete={removeSignature}
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
        onSaveFinal={(img) => {
           addSignature(img);  
        }} 
      />
    </div>
  );
}
