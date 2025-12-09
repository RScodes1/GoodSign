# Good Sign
  Create digital signatures and apply them to your documents

## 1. Project Setup

### a. Prerequisites
- React.js version: `18.2.0`
- API Keys: Remove BG - API KEY (For using the api to remove the background)

### b. Installation Steps

#### Frontend
```bash
npm install
```

#### Environment Variables
```bash
REACT_APP_REMOVE_BG_KEY=***************************
```

### c. Running Locally
```bash 
- Frontend
cd frontend
npm run start

Runs frontend on http://localhost:3000
```

## 2. Tech Stack

### Frontend, Backend, DB, AI

-Frontend: React, Tailwind CSS, Create React App (CRA), 
-Drag & Drop: React Draggable
-Other libs: React Pdf, Pdf-Lib
-Cloud deployment - Frontend on Vercel 

## ⚖️ 4. Decisions & Assumptions

### Key design decisions

**Signature Creation Flow**
-Users create signatures using three methods: Draw, Type, or Upload.
-Final preview modal allows resizing, choosing format (PNG/JPG), and downloading.

**Local Signature Library**
-Signatures are stored in browser localStorage so users can see, download, and re-use them anytime.

**Instant UI Sync**
-addSignature triggers a store update, Home re-renders automatically.
-No parent-to-child props drilling; centralized store prevents stale UI.

**Download Handling**
-Canvas-based resizing preserves aspect ratio.
-JPG generation forces a white background to avoid transparency issues.

### Implementation assumptions

**Signature format**
-All base signatures (drawn, typed, uploaded) are converted to DataURL (image/png) before saving.
-A unique ID is generated for each signature.

**No backend required**
-Everything runs client-side (by assignment requirement).
-Signatures stored in localStorage, so persistence is browser-bound.

**Users may revisit the app**
-Home page loads all existing signatures on mount.
-Deleting or adding signatures updates localStorage immediately.

**Document Upload Flow**
-Using a signature on a PDF happens via a separate screen, but the signature library is accessible independently.

## 5. AI Tools Usage

### Tools used

**ChatGPT**
-UI flow design
-Debugging errors (circular JSON, stale UI, prop drilling issues)
-Creating responsive modals, canvas logic, and store architecture

### How AI helped 

**Designed clean component structure:**
-SignatureCreator → SignaturePreviewModal → SignatureLibrary
-Suggested using a global store (React Context) to make signatures instantly appear after saving.

**Helped debug:**
-Delayed re-renders when saving signatures
-Canvas resizing and aspect-ratio logic

**Provided reusable logic for:**
converting DataURL to downloadable PNG/JPG
localStorage CRUD operations
modal UX improvements (back, save, download)

### Notable prompts / approaches

-How to update a global signature list instantly from inside a modal
-Create a signature preview modal with PNG/JPG download options”
-Canvas resize while keeping aspect ratio centered”

### Learnings

-Centralized state management solves re-render issues when multiple modals depend on shared data.
-Canvas export logic needs careful format handling (PNG transparency vs JPG white background).
-UI responsiveness improves drastically when:
    - storing signatures globally
    - separating preview vs final save

## Repo Structure
```bash
/frontend
  /src
    /components
      /Document
        DocumentEditor.jsx
        DocumentUploaderHandler.jsx
      /Modals
        CreateSignatureModal.jsx
        SignaturePickerModal.jsx
        SignaturePreviewModal.jsx
      Header.jsx
    /hooks
      useAppliedSignature.js
      useFitScale.js
      useSignatures
    /pages
      Home.js
    App.js
    index.css
    index.js
```
