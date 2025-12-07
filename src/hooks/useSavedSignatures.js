// import { useEffect, useState } from "react";

// const STORAGE_KEY = "goodsign_signatures";

// export default function useSavedSignatures() {
//   const [signatures, setSignatures] = useState([]);

//   useEffect(() => {
//     const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
//     setSignatures(saved);
//   }, []);

//   const addSignature = (img) => {
//     const newSig = {
//       id: Date.now().toString(),
//       image: img,
//       createdAt: Date.now()
//     };

//     const updated = [...signatures, newSig];
//     setSignatures(updated);
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
//   };

//   return { signatures, addSignature };
// }
