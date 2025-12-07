import React, { useState } from "react";
import Header from "../components/Header";
import CreateSignatureModal from "../components/Modals/CreateSignatureModal";
import SignaturePreviewModal from "../components/Modals/SignaturePreviewModal";

export default function Home() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header
        onOpenCreateSignature={() => setIsCreateOpen(true)}
        onUploadDocument={() => {}}
      />

      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="w-full md:w-4/5 bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center">
          <p className="text-gray-500 text-sm mb-4">
            Document viewer will appear here
          </p>
          <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
            Workspace Canvas
          </div>
        </div>
      </main>

      <CreateSignatureModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={(image) => {
          setSignatureImage(image);
          setIsCreateOpen(false);
          setIsPreviewOpen(true);
        }}
      />

      <SignaturePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        image={signatureImage}
        onBack={() => {
          setIsPreviewOpen(false)
          setIsCreateOpen(true)
        }}
      />
    </div>
  );
}
