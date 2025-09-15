// components/UploadModal.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const URL = import.meta.env.VITE_API_URL;

const UploadModal = ({ onClose }) => {
  const [file, setFile] = useState(null);

  // 📥 Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
    e.target.value = ""; // reset input so selecting the same file again works
  };

  // 🗑️ Remove selected file
  const handleRemoveFile = () => setFile(null);

  // 📤 Handle file upload
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file before uploading!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await axios.post(`${URL}/user/import-users`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (result.status === 200) {
        toast.success("File uploaded successfully!");
        onClose();
      } else {
        toast.error("Unable to upload file");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      toast.error("Failed to upload file");
    }
  };

  // 📄 Handle sample file download
  const handleDownloadSample = () => {
    const sampleData = [
      ["name", "phone"],
      [
        "Rahul",
        "+918126578265",
      ],
      [
        "Ram",
        "+918126578265",
      ],
      [
        "Rohan",
        "+918126578265",
      ],
    ];

    const csvContent = sampleData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.download = "sample_users.csv";
    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4 text-gray-900">Upload Users</h2>

        {/* 📖 Instructions */}
        <div className="mb-4 text-sm text-gray-700 space-y-1">
          <p className="font-medium">Please follow these guidelines:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              All fields <strong>name, phone, folder_name</strong> are mandatory.
            </li>
            <li>Phone numbers must include their <strong>country code</strong>.</li>
            <li>Use CSV or XLSX file format only.</li>
          </ul>
        </div>

        {/* 📂 File Input */}
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
        >
          <svg
            className="w-8 h-8 text-gray-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 8h-4a4 4 0 010-8h1m4 4h-4"
            />
          </svg>
          <span className="text-gray-600 text-sm font-medium">Click to upload or drag & drop</span>
          <span className="text-xs text-gray-400 mt-1">CSV or XLSX files only</span>
          <input
            id="file-upload"
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Selected File Display */}
        {file && (
          <div className="mt-3 flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2">
            <p className="text-sm text-gray-700 truncate">{file.name}</p>
            <button
              onClick={handleRemoveFile}
              className="text-gray-500 hover:text-red-500"
              aria-label="Remove file"
            >
              ✕
            </button>
          </div>
        )}

        {/* 📥 Sample File Button */}
        <div className="flex justify-center my-4">
          <button
            onClick={handleDownloadSample}
            className="px-3 py-2 text-sm rounded-md bg-blue-500 hover:bg-blue-600 text-white"
          >
            Download Sample File
          </button>
        </div>

        {/* 🎯 Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
