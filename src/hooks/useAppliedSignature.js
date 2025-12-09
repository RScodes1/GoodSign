import { useState } from "react";

export function useAppliedSignature(initial = null) {
  const [appliedSignature, setAppliedSignature] = useState(initial);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [size, setSize] = useState({ width: 120, height: 60 });
  const [page, setPage] = useState(1);

  const normalizeSignature = async (sig) => {
    if (!sig) return null; // keep null as null
    if (typeof sig === "string") return sig;
    if (sig instanceof File || sig instanceof Blob) return URL.createObjectURL(sig);
    if (sig.image) return normalizeSignature(sig.image);
    return null;
  };

  const applySignature = async (sigPayload) => {

    if (!sigPayload) {
      setAppliedSignature(null);
      return;
    }

    const normalized = await normalizeSignature(sigPayload);

    if (!normalized) {
      setAppliedSignature(null);
      return;
    }

    setAppliedSignature(normalized);
    setPage(sigPayload?.page ?? page);
    setPosition(sigPayload?.pos ?? { x: 20, y: 20 });
    setSize(sigPayload?.size ?? { width: 120, height: 60 });
  };

  return {
    appliedSignature,
    position,
    setPosition,
    size,
    setSize,
    page,
    setPage,
    applySignature,
  };
}
