import React from "react";

const DeleteUserModal = ({ user, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Delete User?
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(user)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
