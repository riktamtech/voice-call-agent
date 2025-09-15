import React from "react";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineFileText,
} from "react-icons/ai";

const FoldersTable = ({ folders, onViewInstructions, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-center">Folder Name</th>
            <th className="px-6 py-3 text-center">Voice</th>
            <th className="px-6 py-3 text-center">LLM</th>
            <th className="px-6 py-3 text-center">Status</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {folders.length > 0 ? (
            folders.map((folder, idx) => (
              <tr
                key={folder._id}
                className={`border-b transition-colors duration-150 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-indigo-50`}
              >
                <td className="px-6 py-4 text-center">
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                    {folder.folder_name}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">{folder.voice_model}</td>
                <td className="px-6 py-4 text-center">{folder.llm_model}</td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      folder.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {folder.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-3 justify-center">
                  <button
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition"
                    onClick={() => onViewInstructions(folder)}
                  >
                    <AiOutlineFileText size={16} />
                  </button>
                  <button
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition"
                    onClick={() => onEdit(folder)}
                  >
                    <AiOutlineEdit size={16} />
                  </button>
                  <button
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                    onClick={() => onDelete(folder)}
                  >
                    <AiOutlineDelete size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="px-6 py-4 text-center text-gray-500"
              >
                No folders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FoldersTable;
