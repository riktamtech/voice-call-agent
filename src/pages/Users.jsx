import React, { useState, useEffect } from "react";
import axios from "axios";
import UsersTable from "../components/UsersTable";
import UserModal from "../components/UserModal";
import DeleteUserModal from "../components/DeleteUserModa";
import ConfirmCallModal from "../components/ConfirmCallModal";
import ScheduleCallModal from "../components/ScheduleCallModal";
import UserFormModal from "../components/UserFormModal";
import UploadModal from "../components/UploadModal";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import {
    AiOutlineReload,
} from "react-icons/ai";

const Users = () => {
    const URL = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(true);
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [folders, setFolders] = useState([]);
    const [selectedFolderId, setSelectedFolderId] = useState("");

    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserIds, setSelectedUserIds] = useState([]);

    const [showViewModal, setShowViewModal] = useState(false);
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showConfirmCallModal, setShowConfirmCallModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);

    // Fetch everything once
    // ✅ Keep your fetchData as is, but remove filtering inside it
    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, foldersRes] = await Promise.all([
                axios.get(`${URL}/user/all`),
                axios.get(`${URL}/folder/all`),
            ]);

            const users = usersRes.data.data.users;
            const folders = foldersRes.data.data.folders;

            setAllUsers(users);
            setFolders(folders);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error fetching data:", error);
        }
    };

    // ✅ This will re-filter automatically when data OR selected folder changes
    useEffect(() => {
        if (selectedFolderId) {
            setFilteredUsers(allUsers.filter((u) => u.folder_id === selectedFolderId));
        } else {
            setFilteredUsers(allUsers);
        }
    }, [allUsers, selectedFolderId]);

    // ✅ Fetch data initially + every 10 sec
    useEffect(() => {
        fetchData();
        // const interval = setInterval(fetchData, 10000);
        // return () => clearInterval(interval);
    }, []);

    // ✅ Keep your filterUsers exactly as it is
    const filterUsers = (folderId = "") => {
        setSelectedFolderId(folderId);
    };


    const handleSaveUser = async (formData) => {
        try {
            if (isEditMode) {
                await axios.post(`${URL}/user/update`, formData);
            } else {
                await axios.post(`${URL}/user/create`, formData);
            }
            setShowAddEditModal(false);
            await fetchData(); // refresh users
        } catch (error) {
            console.error("Error saving user:", error);
        }
    };

    const handleDeleteUser = async () => {
        try {
            await axios.delete(`${URL}/user/delete/${selectedUser.user_id}`);
            setShowDeleteModal(false);
            await fetchData();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const callUsersNow = async (user_ids) => {
        try {
            await axios.post(`${URL}/call/batch-call`, { user_ids });
            toast.success("Calls initiated successfully!");
            await fetchData();
        } catch (error) {
            toast.error("Failed to place calls.");
        }
    };

    const callUsersInBatch = async (user_ids, schedule_time) => {
        try {
            await axios.post(`${URL}/call/batch-call/schedule`, {
                user_ids,
                schedule_time,
            });
            toast.success("Calls scheduled successfully!");
            await fetchData();
        } catch (error) {
            toast.error("Failed to schedule calls.");
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                {/* Header + Action Buttons */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Users</h2>
                    <div className="flex gap-3 flex-wrap">
                        <button
                            className="px-4 py-2 rounded-xl border border-green-600 text-green-600 hover:bg-green-50 transition"
                            onClick={() => {
                                setSelectedUser(null);
                                setIsEditMode(false);
                                setShowAddEditModal(true);
                            }}
                        >
                            Add
                        </button>
                        <button
                            className="px-4 py-2 rounded-xl border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition"
                            onClick={() =>
                                selectedUserIds.length
                                    ? setShowConfirmCallModal(true)
                                    : alert("Select at least one user")
                            }
                        >
                            Place Call
                        </button>
                        <button
                            className="px-4 py-2 rounded-xl border border-yellow-500 text-yellow-600 hover:bg-yellow-50 transition"
                            onClick={() =>
                                selectedUserIds.length
                                    ? setShowScheduleModal(true)
                                    : alert("Select at least one user")
                            }
                        >
                            Schedule
                        </button>
                        <button
                            className="px-4 py-2 rounded-xl border border-orange-500 text-orange-600 hover:bg-orange-50 transition"
                            onClick={() => setShowUploadModal(true)}
                        >
                            Upload
                        </button>
                        <button
                            className="px-4 py-2 rounded-xl border border-gray-500 text-gray-600 hover:bg-gray-100 transition flex items-center gap-2"
                            onClick={fetchData}
                        >
                            <AiOutlineReload size={16} />
                        </button>
                    </div>
                </div>
                <Loader loading={loading} />
                {!loading && (
                    <>
                        {/* Folder Tabs */}
                        <div className="mb-6">
                            <div className="flex flex-wrap gap-3 bg-white shadow-md rounded-xl p-4">
                                <button
                                    onClick={() => filterUsers("")}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm ${selectedFolderId === ""
                                        ? "bg-indigo-600 text-white shadow-md scale-105"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    All
                                </button>
                                {folders.map((folder) => (
                                    <button
                                        key={folder.folder_id}
                                        onClick={() => filterUsers(folder.folder_id)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm ${selectedFolderId === folder.folder_id
                                            ? "bg-indigo-600 text-white shadow-md scale-105"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {folder.folder_name}
                                    </button>
                                ))}
                            </div>                    </div>

                        {/* Users Table */}
                        <UsersTable
                            users={filteredUsers}
                            onSelectionChange={setSelectedUserIds}
                            onViewInstructions={(u) => {
                                setSelectedUser(u);
                                setShowViewModal(true);
                            }}
                            onEdit={(u) => {
                                setSelectedUser(u);
                                setIsEditMode(true);
                                setShowAddEditModal(true);
                            }}
                            onDelete={(u) => {
                                setSelectedUser(u);
                                setShowDeleteModal(true);
                            }}
                        />
                    </>
                )}

                {/* Modals */}
                {showViewModal && selectedUser && (
                    <UserModal user={selectedUser} onClose={() => setShowViewModal(false)} />
                )}
                {showAddEditModal && (
                    <UserFormModal
                        user={isEditMode ? selectedUser : null}
                        isEdit={isEditMode}
                        onClose={() => setShowAddEditModal(false)}
                        onSave={handleSaveUser}
                    />
                )}
                {showDeleteModal && selectedUser && (
                    <DeleteUserModal
                        user={selectedUser}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={handleDeleteUser}
                    />
                )}
                {showUploadModal && (
                    <UploadModal onClose={() => setShowUploadModal(false)} />
                )}
                {showConfirmCallModal && (
                    <ConfirmCallModal
                        count={selectedUserIds.length}
                        onClose={() => setShowConfirmCallModal(false)}
                        onConfirm={() => {
                            callUsersNow(selectedUserIds);
                            setShowConfirmCallModal(false);
                        }}
                    />
                )}
                {showScheduleModal && (
                    <ScheduleCallModal
                        count={selectedUserIds.length}
                        onClose={() => setShowScheduleModal(false)}
                        onSchedule={(dateTime) => {
                            callUsersInBatch(selectedUserIds, dateTime);
                            setShowScheduleModal(false);
                        }}
                    />
                )}
            </div>
        </>

    );
};

export default Users;
