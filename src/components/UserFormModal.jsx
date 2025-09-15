import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";

const UserFormModal = ({ user, onClose, onSave }) => {
  const isEdit = !!user;
  const URL = import.meta.env.VITE_API_URL;

  const [folders, setFolders] = useState([]);
  const [formData, setFormData] = useState({
    user_id: "",
    name: "",
    phone: "",
    folder_id: "",
  });

  // Fetch folders for dropdown
  const fetchFolders = async () => {
    try {
      const res = await axios.get(`${URL}/folder/all`);
      setFolders(res.data.data.folders);
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        user_id: user.user_id || "",
        name: user.name || "",
        phone: user.phone || "",
        folder_id: user.folder_id || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.folder_id) {
      alert("Please select a folder");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          {isEdit ? "Edit User" : "Add New User"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="User Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <PhoneInput
              defaultCountry="in"
              value={formData.phone}
              onChange={handlePhoneChange}
              inputStyle={{ width: "100%" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Folder</label>
            <select
              name="folder_id"
              value={formData.folder_id}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="">Select Folder</option>
              {folders.map((f) => (
                <option key={f.folder_id} value={f.folder_id}>
                  {f.folder_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {isEdit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
