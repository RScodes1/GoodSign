import React, { useEffect, useRef, useState } from "react";
import { pdfjs } from "react-pdf";
import Draggable from "react-draggable";
import { PDFDocument } from "pdf-lib";

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function DocumentEditor({ file, onBack, openSignatureModal }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const renderTaskRef = useRef(null);
  const signatureRef = useRef(null);
  const prevFileNameRef = useRef(null);

  const [pdfDoc, setPdfDoc] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isPdf, setIsPdf] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [scale, setScale] = useState(1);

  const [appliedSignature, setAppliedSignature] = useState(null); // string URL (dataURL or objectURL)
  const [appliedSignaturePage, setAppliedSignaturePage] = useState(null);
  const [signaturePos, setSignaturePos] = useState({ x: 20, y: 20 });
  const [signatureSize, setSignatureSize] = useState({ width: 120, height: 60 });

     console.log({appliedSignature});


  const normalizeSignature = async (sig) => {
    if (!sig) return null;

    if (typeof sig === "string") return sig;

    if (sig instanceof File || sig instanceof Blob) {
      return URL.createObjectURL(sig);
    }

    if (sig.image) {
      return normalizeSignature(sig.image);
    }

    return null;
  };

  // Detect PDF or image and load PDF doc
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
      setImageURL(URL.createObjectURL(file.fileObject || file));
    } else {
      // load pdf.js doc
      const safeBuffer = file.data.slice(0);
      pdfjs.getDocument({ data: safeBuffer }).promise.then((doc) => {
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        if (isNewFile) setPage(1);
      });
    }

    // If the file has an appliedSignature property, normalize and load it.
    (async () => {
      if (file.appliedSignature) {
        const normalized = await normalizeSignature(file.appliedSignature);
        if (normalized) {
          setAppliedSignature(normalized);
          setAppliedSignaturePage(file.appliedSignature.page ?? page);
          // If the file gives a pos/size, use them; otherwise keep defaults
          if (file.appliedSignature.pos) setSignaturePos(file.appliedSignature.pos);
          if (file.appliedSignature.size) setSignatureSize(file.appliedSignature.size);
        }
      }
    })();
  }, [file]);

  // Compute scale to fit container
  const computeScale = (viewportWidth, viewportHeight) => {
    const container = containerRef.current;
    if (!container) return 1;

    const maxWidth = container.clientWidth - 40;
    const maxHeight = container.clientHeight - 40;

    return Math.min(maxWidth / viewportWidth, maxHeight / viewportHeight, 1);
  };

  // Render PDF or Image on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");

    if (!isPdf && imageURL) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageURL;
      img.onload = () => {
        const fitScale = Math.min((container.clientWidth - 40) / img.width, (container.clientHeight - 40) / img.height, 1);
        setScale(fitScale);

        canvas.width = img.width * fitScale;
        canvas.height = img.height * fitScale;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      return;
    }

    if (isPdf && pdfDoc) {
      const renderPage = async () => {
        const pdfPage = await pdfDoc.getPage(page);
        const viewport = pdfPage.getViewport({ scale: 1 });
        const fitScale = computeScale(viewport.width, viewport.height);
        setScale(fitScale);

        canvas.width = viewport.width * fitScale;
        canvas.height = viewport.height * fitScale;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (renderTaskRef.current) renderTaskRef.current.cancel();

        const renderTask = pdfPage.render({
          canvasContext: ctx,
          viewport: pdfPage.getViewport({ scale: fitScale }),
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
  }, [pdfDoc, page, imageURL, isPdf, containerRef.current]);

  // When user applies signature via callback (modal calls this)
  const handleApplySignature = async (signaturePayload) => {
    // signaturePayload may be a dataURL string, Blob/File, or { image, page, pos, size }
    console.log("handleApplySignature payload:", signaturePayload);

    // Normalize
    const normalized = await normalizeSignature(signaturePayload);
    if (!normalized) return;

    // Set signature image URL that <img> can use
    setAppliedSignature(normalized);

    // If payload contains page info, use it, otherwise use current page
    const pageFromPayload = signaturePayload && signaturePayload.page ? signaturePayload.page : page;
    setAppliedSignaturePage(pageFromPayload);

    // optionally accept pos/size from payload
    if (signaturePayload?.pos) setSignaturePos(signaturePayload.pos);
    else setSignaturePos({ x: 20, y: 20 });

    if (signaturePayload?.size) setSignatureSize(signaturePayload.size);
    else setSignatureSize({ width: 120, height: 60 });
  };

  // Reset position when signature is applied to the same page (ensure visible)
  useEffect(() => {
    if (appliedSignature && appliedSignaturePage === page) {
      // ensure signature appears in default place for that page
      // (keep existing pos if it was provided)
      setSignaturePos((prev) => ({ x: prev?.x ?? 20, y: prev?.y ?? 20 }));
    }
  }, [page, appliedSignature, appliedSignaturePage]);

  const handleExport = async () => {
    if (isPdf && pdfDoc) {
      const pdfDocLib = await PDFDocument.load(file.data);
      const pages = pdfDocLib.getPages();

      if (appliedSignature && appliedSignaturePage != null) {
        const p = pages[appliedSignaturePage - 1];
        const { width, height } = p.getSize();
        const imgBytes = await fetch(appliedSignature).then((r) => r.arrayBuffer());
        const pngImage = await pdfDocLib.embedPng(imgBytes);

        p.drawImage(pngImage, {
          x: signaturePos.x / scale,
          y: height - signaturePos.y / scale - signatureSize.height / scale,
          width: signatureSize.width / scale,
          height: signatureSize.height / scale,
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
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-2 bg-gray-200 rounded-md mx-2">Previous</button>
            <span className="text-gray-700 font-medium">Page {page} / {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-2 bg-gray-200 rounded-md mx-2">Next</button>
          </div>
        )}

        <div className="flex space-x-2">
          {/* Pass callback to modal — modal should call it or update file.appliedSignature */}
          <button onClick={() => openSignatureModal(handleApplySignature)} className="px-4 py-2 bg-blue-600 text-white rounded-md">Apply Signature</button>
          <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded-md">Export</button>
        </div>
      </div>

      {/* Canvas + draggable signature */}
      <div className="flex-1 overflow-auto flex justify-center items-start p-6 relative">
        <canvas ref={canvasRef} className="shadow-lg bg-white max-w-full" />

      {appliedSignature && appliedSignaturePage === page && (
  <Draggable
    bounds="parent"
    nodeRef={signatureRef}
    position={signaturePos}
    onStop={(e, data) => setSignaturePos({ x: data.x, y: data.y })}
  >
    <div
      ref={signatureRef}
      style={{
        width: signatureSize.width,
        height: signatureSize.height,
        position: "absolute",
        cursor: "move",
      }}
      className="relative"
    >
      {/* DELETE BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // prevent dragging/selecting
            setAppliedSignature(null); // remove image
            setAppliedSignaturePage(null);
          }}
          className="absolute -top-3 -right-3 bg-red-600 text-white rounded w-6 h-6 flex items-center justify-center hover:bg-red-700 shadow"
        >
          ×
        </button>

            <img
              src={appliedSignature}
              alt="signature"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </Draggable>
      )}

      </div>
    </div>
  );
}
