// // SignatureElement.jsx
// import React, { useRef } from "react";
// import Draggable from "react-draggable";

// export default function SignatureElement({
//   image,
//   pos,
//   size,
//   rotation,
//   onChange,
//   onDelete,
// }) {
//   const nodeRef = useRef(null);

//   const handleResize = (e) => {
//     e.stopPropagation();
//     const newWidth = size.width + e.movementX;
//     const newHeight = size.height + e.movementY;
//     onChange({ size: { width: newWidth, height: newHeight } });
//   };

//   const handleRotate = (e) => {
//     e.stopPropagation();
//     onChange({ rotation: rotation + e.movementX * 0.5 });
//   };

//   return (
//     <Draggable
//       nodeRef={nodeRef}
//       position={pos}
//       bounds="parent"
//       onDrag={(e, data) => onChange({ pos: { x: data.x, y: data.y } })}
//     >
//       <div
//         ref={nodeRef}
//         style={{
//           width: size.width,
//           height: size.height,
//           transform: `rotate(${rotation}deg)`,
//         }}
//         className="absolute group cursor-move"
//       >
//         <img
//           src={image}
//           className="w-full h-full object-contain pointer-events-none"
//         />

//         {/* Delete */}
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             onDelete();
//           }}
//           className="absolute -top-3 -right-3 w-6 h-6 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
//         >
//           ×
//         </button>

//         {/* Resize handle */}
//         <div
//           onMouseDown={(e) => {
//             e.stopPropagation();
//             window.addEventListener("mousemove", handleResize);
//             window.addEventListener("mouseup", () => {
//               window.removeEventListener("mousemove", handleResize);
//             });
//           }}
//           className="absolute bottom-0 right-0 w-4 h-4 bg-blue-600 rounded-full cursor-se-resize opacity-0 group-hover:opacity-100"
//         />

//         {/* Rotate handle */}
//         <div
//           onMouseDown={(e) => {
//             e.stopPropagation();
//             window.addEventListener("mousemove", handleRotate);
//             window.addEventListener("mouseup", () => {
//               window.removeEventListener("mousemove", handleRotate);
//             });
//           }}
//           className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-500 rounded-full cursor-pointer opacity-0 group-hover:opacity-100"
//         />
//       </div>
//     </Draggable>
//   );
// }
