import React, { useState, useEffect } from "react";

const voiceModels = [
  "aura-2-thalia-en",
  "aura-2-apollo-en",
  "aura-2-aria-en",
];

const llmModels = [
  "gpt-4o-mini",
  "gpt-4.1",
  "gpt-4-turbo",
];

const FolderFormModal = ({ folder, onClose, onSave }) => {
  // If folder is passed → edit mode
  const isEdit = !!folder;

  const [formData, setFormData] = useState({
    folder_name: "",
    voice_model: "",
    llm_model: "",
    custom_greet_instruction: "",
    custom_instruction: "",
    is_active: true,
  });

  useEffect(() => {
    if (folder) {
      setFormData({
        folder_name: folder.folder_name || "",
        voice_model: folder.voice_model || "",
        llm_model: folder.llm_model || "",
        custom_greet_instruction: folder.custom_greet_instruction || "",
        custom_instruction: folder.custom_instruction || "",
        is_active: folder.is_active ?? true,
      });
    }
  }, [folder]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData)
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          {isEdit ? "Edit Folder" : "Add New Folder"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="folder_name"
            placeholder="Folder Name"
            value={formData.folder_name}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />

          <select
            name="voice_model"
            value={formData.voice_model}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select Voice Model</option>
            {voiceModels.map((vm) => (
              <option key={vm} value={vm}>
                {vm}
              </option>
            ))}
          </select>

          <select
            name="llm_model"
            value={formData.llm_model}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select LLM</option>
            {llmModels.map((lm) => (
              <option key={lm} value={lm}>
                {lm}
              </option>
            ))}
          </select>

          <textarea
            name="custom_greet_instruction"
            placeholder="Custom Greet Instruction"
            value={formData.custom_greet_instruction}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            rows={2}
          />

          <textarea
            name="custom_instruction"
            placeholder="Custom Instruction"
            value={formData.custom_instruction}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            rows={3}
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
            Active
          </label>

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

export default FolderFormModal;
