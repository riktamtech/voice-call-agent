import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineUserAdd } from "react-icons/ai";
import FoldersTable from "../components/FoldersTable";
import FolderModal from "../components/FolderModal";
import FolderFormModal from "../components/FolderFormModal";
import DeleteFolderModal from "../components/DeleteFolderModal";


const Folders = () => {
  const URL = import.meta.env.VITE_API_URL;
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch Folders
  const fetchFolders = async () => {
    try {
      const res = await axios.get(`${URL}/folder/all`);
      setFolders(res.data.data.folders);
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  // Add / Edit Folder
  const handleSaveFolder = async (folderData) => {
    try {
      if (isEditMode) {
        await axios.put(`${URL}/folder/update/${selectedFolder._id}`, folderData);
      } else {
        await axios.post(`${URL}/folder/create`, folderData);
      }
      setShowAddEditModal(false);
      fetchFolders();
    } catch (error) {
      console.error("Error saving folder:", error);
    }
  };

  // Delete Folder
  const handleDeleteFolder = async () => {
    try {
      await axios.delete(`${URL}/folder/${selectedFolder._id}`);
      setShowDeleteModal(false);
      fetchFolders();
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Folders</h2>
        <button
          className="lex items-center gap-2 px-4 py-2 rounded-xl border border-green-600 text-green-600 hover:bg-green-50 transition"
          onClick={() => {
            setSelectedFolder(null);
            setIsEditMode(false);
            setShowAddEditModal(true);
          }}
        >
          Add
        </button>
      </div>

      <FoldersTable
        folders={folders}
        onViewInstructions={(folder) => {
          setSelectedFolder(folder);
          setShowViewModal(true);
        }}
        onEdit={(folder) => {
          setSelectedFolder(folder);
          setIsEditMode(true);
          setShowAddEditModal(true);
        }}
        onDelete={(folder) => {
          setSelectedFolder(folder);
          setShowDeleteModal(true);
        }}
      />

      {/* View Folder Modal */}
      {showViewModal && selectedFolder && (
        <FolderModal folder={selectedFolder} onClose={() => setShowViewModal(false)} />
      )}

      {/* Add/Edit Folder Modal */}
      {showAddEditModal && (
        <FolderFormModal
          folder={isEditMode ? selectedFolder : null}
          isEdit={isEditMode}
          onClose={() => setShowAddEditModal(false)}
          onSave={handleSaveFolder}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedFolder && (
        <DeleteFolderModal
          itemName={selectedFolder.name}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteFolder}
        />
      )}
    </div>
  );
};

export default Folders;
