import React from "react";

const FolderModal = ({ folder, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-900">{folder.name}</h2>

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            Greet Instruction:
          </h3>
          <p className="text-gray-600 text-sm whitespace-pre-line">
            {folder.custom_greet_instruction}
          </p>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            Custom Instruction:
          </h3>
          <p className="text-gray-600 text-sm whitespace-pre-line">
            {folder.custom_instruction}
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default FolderModal;
