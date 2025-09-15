import React from "react";

const UserModal = ({ user, onClose }) => {
  const transcription = user?.transcription || [];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
        {/* User Name */}
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          {user?.name || "Unnamed User"}
        </h2>

        {/* Transcription Section */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Transcription:
          </h3>

          {transcription.length > 0 ? (
            <div className="space-y-2 max-h-80 overflow-y-auto p-3 bg-gray-50 rounded-xl">
              {transcription.map((entry, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-2 ${
                    entry.role === "assistant"
                      ? "justify-start"
                      : "justify-end text-right"
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl shadow-sm max-w-xs ${
                      entry.role === "assistant"
                        ? "bg-indigo-100 text-indigo-900"
                        : "bg-green-100 text-green-900"
                    }`}
                  >
                    <p className="text-sm">{entry.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">
              No transcription available.
            </p>
          )}
        </div>

        {/* Close Button */}
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

export default UserModal;
