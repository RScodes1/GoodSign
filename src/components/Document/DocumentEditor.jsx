import React, { useEffect, useRef, useState } from "react";
import { pdfjs } from "react-pdf";
import Draggable from "react-draggable";
import { PDFDocument } from "pdf-lib";
import { useFitScale } from "../../hooks/useFitScale";
import { useAppliedSignature } from "../../hooks/useAppliedSignature";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function DocumentEditor({ file, onBack, openSignatureModal }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const signatureRef = useRef(null);
  const prevFileNameRef = useRef(null);
  const renderTaskRef = useRef(null);
  

  const [pdfDoc, setPdfDoc] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isPdf, setIsPdf] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  // Use the appliedSignature hook
  const { appliedSignature, position, setPosition, size, page: sigPage, setPage: setSigPage, applySignature } = useAppliedSignature();

  const scale = useFitScale(containerRef, contentWidth, contentHeight);

  const normalizeSignature = async (sig) => {
    if (!sig) return null;
    if (typeof sig === "string") return sig;
    if (sig instanceof File || sig instanceof Blob) return URL.createObjectURL(sig);
    if (sig.image) return normalizeSignature(sig.image);
    return null;
  };

  // Load PDF or image
  useEffect(() => {
    if (!file) return;

    const isPDF = file.type === "application/pdf";
    setIsPdf(isPDF);

    const isNewFile = prevFileNameRef.current !== file.name;
    if (isNewFile) {
      prevFileNameRef.current = file.name;
      setPage(1);
      setPdfDoc(null);
      setTotalPages(1);
    }

    if (!isPDF) {
      const imgURL = URL.createObjectURL(file.fileObject || file);
      setImageURL(imgURL);

      const img = new Image();
      img.src = imgURL;
      img.onload = () => {
        setContentWidth(img.width);
        setContentHeight(img.height);
      };
    } else {
      const safeBuffer = file.data.slice(0);
      pdfjs.getDocument({ data: safeBuffer }).promise.then((doc) => {
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
      });
    }

    // If the file has a signature, apply it
    (async () => {
      if (file.appliedSignature) {
        await applySignature(file.appliedSignature);
      }
    })();
  }, [file]);

  // Render PDF or image
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    if (!isPdf && imageURL) {
      const img = new Image();
      img.src = imageURL;
      img.onload = () => {
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setContentWidth(img.width);
        setContentHeight(img.height);
      };
      return;
    }

    if (isPdf && pdfDoc) {
      const renderPage = async () => {
        const pdfPage = await pdfDoc.getPage(page);
        const viewport = pdfPage.getViewport({ scale: 1 });
        setContentWidth(viewport.width);
        setContentHeight(viewport.height);

        canvas.width = viewport.width * scale;
        canvas.height = viewport.height * scale;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (renderTaskRef.current) renderTaskRef.current.cancel();

        const renderTask = pdfPage.render({
          canvasContext: ctx,
          viewport: pdfPage.getViewport({ scale }),
        });

        renderTaskRef.current = renderTask;
        try {
          await renderTask.promise;
        } catch (err) {
          if (err?.name !== "RenderingCancelledException") console.error(err);
        }
      };
      renderPage();
    }
  }, [pdfDoc, page, imageURL, isPdf, scale]);

  const handleExport = async () => {
    if (isPdf && pdfDoc) {
      const pdfDocLib = await PDFDocument.load(file.data);
      const pages = pdfDocLib.getPages();

      if (appliedSignature && sigPage != null) {
        const p = pages[sigPage - 1];
        const { width, height } = p.getSize();
        const imgBytes = await fetch(appliedSignature).then(r => r.arrayBuffer());
        const pngImage = await pdfDocLib.embedPng(imgBytes);

        p.drawImage(pngImage, {
          x: position.x / scale,
          y: height - position.y / scale - size.height / scale,
          width: size.width / scale,
          height: size.height / scale,
        });
      }

      const finalPdf = await pdfDocLib.save();
      const blob = new Blob([finalPdf], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(".pdf", "_signed.pdf");
      a.click();
    } else {
      const canvas = canvasRef.current;
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.[^/.]+$/, "_signed.png");
      a.click();
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-gray-100 flex flex-col z-40">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white shadow">
        <button onClick={onBack} className="px-4 py-2 bg-gray-200 rounded-md">Back</button>

        {isPdf && (
          <div>
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-2 bg-gray-200 rounded-md mx-2">Previous</button>
            <span className="text-gray-700 font-medium">Page {page} / {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-2 bg-gray-200 rounded-md mx-2">Next</button>
          </div>
        )}

        <div className="flex space-x-2">
          <button onClick={() => openSignatureModal(applySignature)} className="px-4 py-2 bg-blue-600 text-white rounded-md">Apply Signature</button>
          <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded-md">Export</button>
        </div>
      </div>

      {/* Canvas + draggable signature */}
      <div className="flex-1 overflow-auto flex justify-center items-start p-6 relative">
        <canvas ref={canvasRef} className="shadow-lg bg-white max-w-full" />
        {appliedSignature && sigPage === page && (
          <Draggable
            bounds="parent"
            nodeRef={signatureRef}
            position={position}
            onStop={(e, data) => setPosition({ x: data.x, y: data.y })}
          >
            <div
              ref={signatureRef}
              style={{ width: size.width, height: size.height, position: "absolute", cursor: "move" }}
              className="relative"
            >
              <button
                onClick={e => { 
                  e.stopPropagation();
                  applySignature(null); 
                  // handleDeleteSignature()
                }} 
                className="absolute -top-3 -right-3 bg-red-600 text-white rounded w-6 h-6 flex items-center justify-center hover:bg-red-700 shadow"
              >×</button>
              <img src={appliedSignature} alt="signature" style={{ width: "100%", height: "100%" }} />
            </div>
          </Draggable>
        )}
      </div>
    </div>
  );
}
