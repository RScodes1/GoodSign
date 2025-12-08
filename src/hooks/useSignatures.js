import { useState, useEffect } from "react";

const SIGNATURES_KEY = "goodsign_signatures";

export function useSignatures() {
  const [signatures, setSignatures] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(SIGNATURES_KEY) || "[]");
    setSignatures(stored);
  }, []);

  const addSignature = (image) => {
    const newSig = {
      id: Date.now().toString(),
      image,
      createdAt: Date.now(),
      format: "png",
    };
    const updated = [...signatures, newSig];
    setSignatures(updated);
    localStorage.setItem(SIGNATURES_KEY, JSON.stringify(updated));
  };

  const removeSignature = (id) => {
    const updated = signatures.filter((s) => s.id !== id);
    setSignatures(updated);
    localStorage.setItem(SIGNATURES_KEY, JSON.stringify(updated));
  };

  return { signatures, addSignature, removeSignature };
}
