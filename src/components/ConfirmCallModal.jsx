// components/ConfirmCallModal.jsx
import React from "react";

const ConfirmCallModal = ({ onClose, onConfirm, count }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
      <h2 className="text-lg font-bold mb-4 text-gray-900">
        Confirm Call
      </h2>
      <p className="mb-6 text-gray-700">
        Are you sure you want to place calls for <b>{count}</b> user(s)?
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmCallModal;
