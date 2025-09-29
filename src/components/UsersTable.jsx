import React, { useState, useEffect } from "react";
import {
    AiOutlineEdit,
    AiOutlineDelete,
    AiOutlineFileText,
    AiOutlinePhone,
    AiOutlineAudio,
    AiOutlineAudioMuted,
} from "react-icons/ai";
import { toast } from "react-toastify";

import axios from "axios";
const statusClasses = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    busy: "bg-red-100 text-red-800",
    failed: "bg-red-100 text-red-800",
    "no-answer": "bg-red-100 text-red-800",
};
const URL = import.meta.env.VITE_API_URL;

const UsersTable = ({ users, onViewInstructions, onEdit, onDelete, onSelectionChange }) => {
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const [audioModal, setAudioModal] = useState({ open: false, url: "" });

    // Handle single checkbox toggle
    const handleCheckboxChange = (userId) => {
        setSelectedUserIds((prev) => {
            if (prev.includes(userId)) {
                return prev.filter((id) => id !== userId);
            } else {
                return [...prev, userId];
            }
        });
    };

    // Handle "select all" toggle
    const handleSelectAllChange = () => {
        if (selectAll) {
            setSelectedUserIds([]); // clear all
        } else {
            setSelectedUserIds(users.map((user) => user.user_id)); // select all
        }
        setSelectAll(!selectAll);
    };

    // Keep parent updated with selection
    useEffect(() => {
        if (onSelectionChange) {
            onSelectionChange(selectedUserIds);
        }
    }, [selectedUserIds]);

    // Keep "select all" checkbox synced
    useEffect(() => {
        if (selectedUserIds.length === users.length && users.length > 0) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [selectedUserIds, users]);


    const callUser = async (user) => {
        try {
            console.log("Calling user:", user.user_id);
            const result = await axios.post(`${URL}/call/start-call`, { user_id: user.user_id });
            toast.success(`Call initated successfully to ${user.name}!`);
        } catch (error) {
            console.error("Error placing call:", error);
            toast.error("Failed to place call. Please try again.");
        }
    };

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-100">

            <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs uppercase bg-gray-50">
                    <tr>
                        {/* Select All Checkbox */}
                        <th className="px-6 py-3 text-center">
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAllChange}
                            />
                        </th>
                        <th className="px-6 py-3 text-center">Name</th>
                        <th className="px-6 py-3 text-center">Phone</th>
                        <th className="px-6 py-3 text-center">Call Status</th>
                        <th className="px-6 py-3 text-center">Folder</th>
                        <th className="px-6 py-3 text-center">Scheduled Time</th>
                        <th className="px-6 py-3 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user, idx) => (
                            <tr
                                key={user._id}
                                className={`border-b transition-colors duration-150 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    } hover:bg-indigo-50`}
                            >
                                {/* Row checkbox */}
                                <td className="px-6 py-4 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedUserIds.includes(user.user_id)}
                                        onChange={() => handleCheckboxChange(user.user_id)}
                                    />
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 text-center">
                                    {user.name}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                                        {user.phone}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span
                                        className={`text-xs font-bold px-3 py-1 rounded-full ${statusClasses[user.call_status] ?? "bg-gray-100 text-gray-800"
                                            }`}
                                    >
                                        {user.call_status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                                        {user.folder_name ?? "N/A"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span
                                        className={`text-xs font-semibold px-3 py-1 rounded-full ${user.schedule_time
                                            ? "bg-green-100 text-green-800"
                                            : "bg-gray-100 text-gray-800"
                                            }`}
                                    >
                                        {user.schedule_time
                                            ? new Date(user.schedule_time).toLocaleString()
                                            : "Not Scheduled"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex gap-3 justify-center">
                                    <button
                                        className="w-9 h-9 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition"
                                        onClick={() => onViewInstructions(user)}
                                    >
                                        <AiOutlineFileText size={16} />
                                    </button>
                                    <button
                                        className="w-9 h-9 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition"
                                        onClick={() => callUser(user)}
                                    >
                                        <AiOutlinePhone size={16} />
                                    </button>
                                    <button
                                        className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition"
                                        onClick={() => onEdit(user)}
                                    >
                                        <AiOutlineEdit size={16} />
                                    </button>
                                    {user.recording_url ? (
                                        <button
                                            className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                                            onClick={() => setAudioModal({ open: true, url: user.recording_url })}
                                        >
                                            <AiOutlineAudio size={16} />
                                        </button>
                                    ) : (
                                        <button
                                            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 cursor-not-allowed"
                                            disabled
                                        >
                                            <AiOutlineAudioMuted size={16} />
                                        </button>
                                    )}


                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="7"
                                className="px-6 py-4 text-center text-gray-500"
                            >
                                No Users found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {audioModal.open && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4">Recording</h3>
                        <audio src={audioModal.url} controls autoPlay className="w-full mb-6" />

                        {/* Footer Buttons - aligned bottom right */}
                        <div className="flex justify-end space-x-3">
                            <button
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                                onClick={() => setAudioModal({ open: false, url: "" })}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default UsersTable;
