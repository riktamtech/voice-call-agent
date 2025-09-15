import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineFileText } from "react-icons/ai";
import { FiPhone } from "react-icons/fi";
import { RiQuestionAnswerLine } from "react-icons/ri";
import { AiOutlineUserAdd, AiOutlineSchedule, AiOutlinePhone, AiOutlineEdit, AiOutlineUpload, AiOutlineDelete } from "react-icons/ai";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import { toast } from "react-toastify";
const URL = import.meta.env.VITE_API_URL;

const Users = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const statusClasses = {
		completed: "bg-green-100 text-green-800",
		pending: "bg-yellow-100 text-yellow-800",
		busy: "bg-red-100 text-red-800",
		failed: "bg-red-100 text-red-800",
		"no-answer": "bg-red-100 text-red-800",
	};
	const [loading, setLoading] = useState(false);

	const [showImmediateModal, setShowImmediateModal] = useState(false);
	const [showScheduleModal, setShowScheduleModal] = useState(false);
	const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
	const [showUploadModal, setShowUploadModal] = useState(false);
	const [selectedIds, setSelectedIds] = useState([]);
	const [promptModal, setPromptModal] = useState(null);
	const [deleteModal, setDeleteModal] = useState(null);

	const [transcriptModal, setTranscriptModal] = useState(null);
	const [instructionsModal, setInstructionsModal] = useState(null);
	const [candidates, setCandidates] = useState([]);

	const [folders, setFolders] = useState([]);
	const [selectedFolder, setSelectedFolder] = useState(null);


	// Fetch candidates
	const fetchUsers = async () => {
		try {
			let route = URL + "/users/all";
			const res = await axios.get(route);
			const users = res.data.data.map((u) => ({
				id: u.user_id,
				name: u.name,
				phone: u.phone,
				folder_name: u.folder_name || "default", // add folder_name
				instruction: u.instruction,
				schedule_time: u.schedule_time,
				use_default: u.use_default,
				custom_instruction: u.custom_instruction,
				custom_greet_instruction: u.custom_greet_instruction,
				transcription: u.transcription,
				call_status: u.call_status,
			}));

			setCandidates(users);

			// Extract unique folder names
			const uniqueFolders = [...new Set(users.map(u => u.folder_name))];
			setFolders(uniqueFolders);
		} catch (error) {
			console.error("Error fetching users:", error);
		}
	};

	useEffect(() => {
		fetchUsers();
		const interval = setInterval(fetchUsers, 10000);
		return () => clearInterval(interval);
	}, []);

	const handleCheckboxChange = (id) => {
		setSelectedIds((prev) => (prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]));
	};

	const call = async (candidate) => {
		try {
			setLoading(true);
			let route = URL + "/start-call";
			await axios.post(route, {
				user_id: candidate.id,
			});

			toast.success(`Call initated successfully to ${candidate.name}!`);
		} catch (error) {
			console.error("Error placing call:", error);
			toast.error("Failed to place call. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const openTranscript = (candidate) => setTranscriptModal(candidate);
	const openInstructions = (candidate) => setInstructionsModal(candidate);
	return (
		<div className="flex min-h-screen relative">
			{/* Mobile Hamburger Button */}
			<button
				className="absolute top-4 left-4 z-50 md:hidden bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
				onClick={() => setSidebarOpen(!sidebarOpen)}
			>
				{sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
			</button>

			{/* Sidebar */}
			<AnimatePresence>
				{sidebarOpen && (
					<motion.aside
						initial={{ x: "-100%" }}
						animate={{ x: 0 }}
						exit={{ x: "-100%" }}
						transition={{ duration: 0.3 }}
						className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-40 flex flex-col items-center py-6 space-y-4 md:static md:translate-x-0"
					>
						{/* Logo + Tagline */}
						<img
							src="/logo.png"
							alt="Zcruit.ai Logo"
							className="h-28 w-28 object-contain"
						/>
						<p className="text-gray-600 text-center text-sm px-4">
							Your AI Recruiter, On Call.
						</p>

						{/* Navigation Links */}
						<nav className="mt-8 flex flex-col space-y-2 w-full px-6">
							<button className="text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-2" onClick={() => setShowAddCandidateModal(true)}>
								Add Users
							</button>
							<button className="text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-2" onClick={() => setShowScheduleModal(true)}>
								Schedule Calls
							</button>
							<button className="text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-2" onClick={() => setShowImmediateModal(true)}>
								Place Immediate Calls
							</button>
							<button className="text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-2" onClick={() => setShowUploadModal(true)}>
								Upload File
							</button>
						</nav>
					</motion.aside>
				)}
			</AnimatePresence>

			{/* Desktop Sidebar (Always Visible) */}
			<aside className="hidden md:flex md:w-64 bg-white shadow-md flex-col items-center py-6 space-y-4">
				<img src="/logo.png" alt="Zcruit.ai Logo" className="h-28 w-28 object-contain" />
				<p className="text-gray-600 text-center text-sm px-4">
					Your AI Recruiter, On Call.
				</p>
				<nav className="mt-8 flex flex-col space-y-2 w-full px-6">
					<button className="text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-2" onClick={() => setShowAddCandidateModal(true)}>
						Add Users
					</button>
					<button className="text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-2" onClick={() => setShowScheduleModal(true)}>
						Schedule Calls
					</button>
					<button className="text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-2" onClick={() => setShowImmediateModal(true)}>
						Place Immediate Calls
					</button>
					<button className="text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-2" onClick={() => setShowUploadModal(true)}>
						Upload File
					</button>
				</nav>
			</aside>

			{/* Main Content */}
			<main className="flex-1 bg-gray-50 p-8">
				<h2 className="text-3xl font-bold text-gray-800 mb-4">
					Welcome to Zcruit.ai
				</h2>
				<p className="text-gray-700">
					Your AI Recruiter, On Call. Manage candidates, schedule calls, and initiate conversations seamlessly.
				</p>

				<div className="mt-2 mb-6 flex flex-wrap gap-3 bg-white shadow-md rounded-xl p-4">
					{/* "All" Button */}
					<button
						onClick={() => setSelectedFolder(null)}
						className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm
      ${selectedFolder === null
								? "bg-indigo-600 text-white shadow-md scale-105"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							}`}
					>
						All
					</button>

					{/* Folder Buttons */}
					{folders.map((folder) => (
						<button
							key={folder}
							onClick={() => setSelectedFolder(folder)}
							className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm
        ${selectedFolder === folder
									? "bg-indigo-600 text-white shadow-md scale-105"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
								}`}
						>
							{folder}
						</button>
					))}
				</div>


				{/* Candidate Table */}
				<div className="bg-white p-6 rounded-2xl shadow-lg">
					<h2 className="text-2xl font-bold mb-6 text-gray-900">Candidates</h2>
					<div className="overflow-x-auto rounded-xl border border-gray-100">
						<table className="w-full text-sm text-left text-gray-600">
							<thead className="text-xs uppercase bg-gray-50">
								<tr>
									<th className="p-4">Select</th>
									<th className="px-6 py-3 text-center">Name</th>
									<th className="px-6 py-3 text-center">Phone Number</th>
									<th className="px-6 py-3 text-center">Call Status</th>
									<th className="px-6 py-3 text-center">Folder Name</th>
									<th className="px-6 py-3 text-center">Scheduled At</th>
									<th className="px-6 py-3 text-center">Actions</th>
								</tr>
							</thead>
							<tbody>
								{candidates
									.filter((c) => !selectedFolder || c.folder_name === selectedFolder)
									.map((c, idx) => (
										<tr
											key={c.id}
											className={`border-b transition-colors duration-150 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
												} hover:bg-indigo-50`}
										>
											<td className="w-4 p-4">
												<input
													type="checkbox"
													checked={selectedIds.includes(c.id)}
													onChange={() => handleCheckboxChange(c.id)}
													className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
												/>
											</td>
											<td className="px-6 py-4 font-medium text-gray-900 text-center">{c.name}</td>
											<td className="px-6 py-4 text-center">{c.phone}</td>
											<td className="px-6 py-4 text-center">
												<span
													className={`text-xs font-bold px-3 py-1 rounded-full ${statusClasses[c.call_status] ?? "bg-gray-100 text-gray-800"
														}`}
												>
													{c.call_status}
												</span>
											</td>
											<td className="px-6 py-4 text-center">
												<span className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
													{c.folder_name}
												</span>
											</td>
											<td className="px-6 py-4 text-center">
												<span
													className={`text-xs font-semibold px-3 py-1 rounded-full ${c.schedule_time
														? "bg-green-100 text-green-800"
														: "bg-gray-100 text-gray-800"
														}`}
												>
													{c.schedule_time
														? new Date(c.schedule_time).toLocaleString()
														: "Not Scheduled"}
												</span>
											</td>
											<td className="px-6 py-4 flex gap-3 justify-center">
												<button
													className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 shadow-sm hover:shadow transition"
													onClick={() => openTranscript(c)}
												>
													<AiOutlineFileText size={18} />
												</button>

												<button
													className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 shadow-sm hover:shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
													onClick={() => call(c)}
													disabled={loading}
												>
													<FiPhone size={18} />
												</button>

												<button
													className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 shadow-sm hover:shadow transition"
													onClick={() => openInstructions(c)}
												>
													<RiQuestionAnswerLine size={18} />
												</button>

												<button
													className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 shadow-sm hover:shadow transition"
													onClick={() => setPromptModal(c)}
												>
													<AiOutlineEdit size={18} />
												</button>

												<button
													className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 shadow-sm hover:shadow transition"
													onClick={() => setDeleteModal(c)}
												>
													<AiOutlineDelete size={18} />
												</button>
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</div>


				{showAddCandidateModal && (
					<AddCandidateModal
						isOpen={showAddCandidateModal}
						setShowAddCandidateModal={setShowAddCandidateModal}
						onClose={() => setShowAddCandidateModal(false)}
						fetchUsers={fetchUsers}
						folders={folders}
					/>
				)}

				{transcriptModal && (
					<TranscriptModal candidate={transcriptModal} onClose={() => setTranscriptModal(null)} />
				)}

				{instructionsModal && (
					<ShowInstructionsModal
						candidate={instructionsModal}
						onClose={() => setInstructionsModal(null)}
					/>
				)}

				{showScheduleModal && (
					<ScheduleModal
						isOpen={showScheduleModal}
						selectedIds={selectedIds}
						setShowScheduleModal={setShowScheduleModal}
						onClose={() => setShowScheduleModal(false)}
					/>
				)}

				{showImmediateModal && (
					<ImmediateModal
						isOpen={showImmediateModal}
						selectedIds={selectedIds}
						setShowImmediateModal={setShowImmediateModal}
						onClose={() => setShowImmediateModal(false)}
					/>
				)}

				{promptModal && (
					<UpdatePromptModal candidate={promptModal} onClose={() => setPromptModal(null)} fetchUsers={fetchUsers} />
				)}
				{showUploadModal && (
					<UploadModal onClose={() => setShowUploadModal(null)} fetchUsers={fetchUsers} />
				)}

				{deleteModal && (
					<DeleteUserModal candidate={deleteModal} onClose={() => setDeleteModal(null)} fetchUsers={fetchUsers} />
				)}
			</main>
		</div>
	);
};

// ================== Schedule Modal ==================

const ScheduleModal = ({ isOpen, onClose, selectedIds, setShowScheduleModal }) => {
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");
	const [useDefault, setUseDefault] = useState(true);
	const [instruction, setInstruction] = useState("");
	const [custom_greet_instruction, setGreetingPrompt] = useState("");
	const [custom_instruction, setCustomPrompt] = useState("");

	if (!isOpen) return null;

	const onConfirm = async () => {
		if (selectedIds.length === 0) {
			toast.error("Select at least one candidate");
			return;
		}
		if (!date || !time) {
			toast.error("Date and Time are required");
			return;
		}

		// validation for prompts
		if (!useDefault && (!custom_greet_instruction.trim() || !custom_instruction.trim())) {
			toast.error("Greeting and Custom Prompt are required when not using default");
			return;
		}

		try {
			const schedule_time = new Date(`${date}T${time}:00`).toISOString();
			await axios.post(URL + "/start-batch-call", {
				user_ids: selectedIds,
				use_default: useDefault,
				instruction: useDefault ? instruction : null,
				custom_greet_instruction: useDefault ? null : custom_greet_instruction,
				custom_instruction: useDefault ? null : custom_instruction,
				schedule_time,
			});
			toast.success("Batch call scheduled!");
			// reset
			setDate("");
			setTime("");
			setInstruction("");
			setGreetingPrompt("");
			setCustomPrompt("");
			setUseDefault(true);
			setShowScheduleModal(false);
		} catch (err) {
			console.error("Error placing call:", err);
			toast.error("Failed to schedule calls. Please try again.");
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
				<h2 className="text-xl font-semibold mb-4 text-center">Schedule Calls</h2>

				{/* Date */}
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">Date</label>
					<input
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>
				</div>

				{/* Time */}
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">Time</label>
					<input
						type="time"
						value={time}
						onChange={(e) => setTime(e.target.value)}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>
				</div>

				{/* Prompt Selection */}
				<div className="mb-4">
					<label className="flex items-center space-x-2">
						<input
							type="checkbox"
							checked={useDefault}
							onChange={(e) => setUseDefault(e.target.checked)}
							className="h-4 w-4 text-indigo-600"
						/>
						<span className="text-sm text-gray-700">Use default instruction</span>
					</label>
				</div>

				{/* Default Instruction */}
				{useDefault && (
					<div className="mb-4">
						<label className="block text-sm font-medium mb-1">Instruction</label>
						<textarea
							value={instruction}
							onChange={(e) => setInstruction(e.target.value)}
							placeholder="Default AI conversation instruction"
							className="w-full border text-sm text-gray-900 border-gray-300 bg-gray-50 rounded-md px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>
				)}

				{/* Greeting + Custom */}
				{!useDefault && (
					<>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">Greeting Prompt</label>
							<textarea
								value={custom_greet_instruction}
								onChange={(e) => setGreetingPrompt(e.target.value)}
								placeholder="e.g., Hello! This is an AI call..."
								className="w-full border text-sm text-gray-900 border-gray-300 bg-gray-50 rounded-md px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">Custom Prompt</label>
							<textarea
								value={custom_instruction}
								onChange={(e) => setCustomPrompt(e.target.value)}
								placeholder="e.g., Confirm the candidate’s availability..."
								className="w-full border text-sm text-gray-900 border-gray-300 bg-gray-50 rounded-md px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>
					</>
				)}

				{/* Actions */}
				<div className="flex justify-end space-x-2">
					<button
						onClick={onClose}
						className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className="px-4 py-2 text-sm rounded-md bg-green-600 hover:bg-green-700 text-white"
					>
						Confirm & Schedule Calls
					</button>
				</div>
			</div>
		</div>
	);
};

// ================== Immediate Modal ==================
const ImmediateModal = ({ isOpen, onClose, selectedIds, setShowImmediateModal }) => {
	const [useDefault, setUseDefault] = useState(true);
	const [instruction, setInstruction] = useState("");
	const [custom_greet_instruction, setGreetingPrompt] = useState("");
	const [custom_instruction, setCustomPrompt] = useState("");
	if (!isOpen) return null;

	const onConfirm = async () => {

		// validation for prompts
		if (!useDefault && (!custom_greet_instruction.trim() || !custom_instruction.trim())) {
			toast.error("Greeting and Custom Prompt are required when not using default");
			return;
		}


		if (selectedIds.length == 0) {
			toast.error("Select at least one candidate");
			return;
		}
		try {
			await axios.post(URL + "/start-batch-call", {
				user_ids: selectedIds,
				use_default: useDefault,
				instruction: useDefault ? instruction : null,
				custom_greet_instruction: useDefault ? null : custom_greet_instruction,
				custom_instruction: useDefault ? null : custom_instruction,
			});
			toast.success("Batch call initiated!");
			setInstruction("");
			setGreetingPrompt("");
			setCustomPrompt("");
			setUseDefault(true);
			setShowImmediateModal(false);
		} catch (err) {
			console.error("Error placing call:", err);
			toast.error("Failed to place call. Please try again.");
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
				<h2 className="text-xl font-semibold mb-4 text-center">Place Calls</h2>

				{/* Prompt Selection */}
				<div className="mb-4">
					<label className="flex items-center space-x-2">
						<input
							type="checkbox"
							checked={useDefault}
							onChange={(e) => setUseDefault(e.target.checked)}
							className="h-4 w-4 text-indigo-600"
						/>
						<span className="text-sm text-gray-700">Use default instruction</span>
					</label>
				</div>

				{/* Default Instruction */}
				{useDefault && (
					<div className="mb-4">
						<label className="block text-sm font-medium mb-1">Instruction</label>
						<textarea
							value={instruction}
							onChange={(e) => setInstruction(e.target.value)}
							placeholder="Default AI conversation instruction"
							className="w-full border text-sm text-gray-900 border-gray-300 bg-gray-50 rounded-md px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>
				)}

				{/* Greeting + Custom */}
				{!useDefault && (
					<>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">Greeting Prompt</label>
							<textarea
								value={custom_greet_instruction}
								onChange={(e) => setGreetingPrompt(e.target.value)}
								placeholder="e.g., Hello! This is an AI call..."
								className="w-full border text-sm text-gray-900 border-gray-300 bg-gray-50 rounded-md px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">Custom Prompt</label>
							<textarea
								value={custom_instruction}
								onChange={(e) => setCustomPrompt(e.target.value)}
								placeholder="e.g., Confirm the candidate’s availability..."
								className="w-full border text-sm text-gray-900 border-gray-300 bg-gray-50 rounded-md px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>
					</>
				)}

				{/* Actions */}
				<div className="flex justify-end space-x-2">
					<button
						onClick={onClose}
						className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className="px-4 py-2 text-sm rounded-md bg-green-600 hover:bg-green-700 text-white"
					>
						Confirm & Schedule Calls
					</button>
				</div>
			</div>
		</div>
	);
};

// ================== Transcript Modal ==================
const TranscriptModal = ({ candidate, onClose }) => (
	<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
		<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
			<h3 className="text-xl font-bold mb-4">Transcript</h3>
			<div className="text-gray-700 whitespace-pre-wrap">
				{(candidate?.transcription ?? []).length === 0 ? (
					<p>No transcription available.</p>
				) : (
					(candidate?.transcription ?? []).map((t, idx) => (
						<p key={idx}>
							<strong>{t.role === "assistant" ? "AI" : "Candidate"}:</strong> {t.content}
						</p>
					))
				)}
			</div>


			<div className="mt-4 flex justify-end">
				<button
					onClick={onClose}
					className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
				>
					Close
				</button>
			</div>
		</div>
	</div>
);

const ShowInstructionsModal = ({ candidate, onClose }) => (
	<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
		<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
			<h3 className="text-xl font-bold mb-4">Instructions</h3>
			<div className="text-gray-700 whitespace-pre-wrap">
				{candidate.instruction || "—"}
			</div>

			<h3 className="text-xl font-bold mt-6 mb-2">Greeting Prompt</h3>
			<div className="text-gray-700 whitespace-pre-wrap">
				{candidate.custom_greet_instruction || "—"}
			</div>

			<h3 className="text-xl font-bold mt-6 mb-2">Custom Prompt</h3>
			<div className="text-gray-700 whitespace-pre-wrap">
				{candidate.custom_instruction || "—"}
			</div>

			<div className="mt-6 flex justify-end">
				<button
					onClick={onClose}
					className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
				>
					Close
				</button>
			</div>
		</div>
	</div>
);


// ================== Add Candidate Modal ==================

const AddCandidateModal = ({ isOpen, onClose, setShowAddCandidateModal, fetchUsers, folders }) => {
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [selectedFolder, setSelectedFolder] = useState(""); // currently selected folder
	const [newFolder, setNewFolder] = useState(""); // input for new folder
	const [useDefault, setUseDefault] = useState(true);
	const [instruction, setInstruction] = useState("");
	const [custom_greet_instruction, setGreetingPrompt] = useState("");
	const [custom_instruction, setCustomPrompt] = useState("");

	if (!isOpen) return null;

	const onConfirm = async () => {
		if (!name || !phone) {
			toast.error("Name and Phone are required");
			return;
		}

		if (!selectedFolder) {
			toast.error("Please select a folder or enter a new one");
			return;
		}

		const folderToSend = selectedFolder === "__new_folder__" ? newFolder : selectedFolder;

		if (!useDefault && (!custom_greet_instruction.trim() || !custom_instruction.trim())) {
			toast.error("Greeting and Custom Prompt are required when not using default");
			return;
		}

		try {
			const result = await axios.post(URL + "/create-user", {
				name,
				phone,
				folder_name: folderToSend,
				use_default: useDefault,
				instruction: instruction,
				custom_greet_instruction: custom_greet_instruction,
				custom_instruction: custom_instruction,
			});

			if (result.status === 201) {
				await fetchUsers();
				toast.success("User added successfully");
			} else {
				toast.error("Unable to create the user");
			}

			setShowAddCandidateModal(false);
		} catch (err) {
			console.error("Error creating user:", err);
			toast.error("Error creating user");
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
				<h2 className="text-xl font-semibold mb-4 text-center">Add Candidate</h2>

				{/* Name */}
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">Name</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>
				</div>

				{/* Phone */}
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">Phone</label>
					<PhoneInput
						defaultCountry="in"
						value={phone}
						onChange={setPhone}
						inputStyle={{ width: "100%" }}
					/>
				</div>

				{/* Folder */}
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">Folder</label>
					<select
						value={selectedFolder}
						onChange={(e) => setSelectedFolder(e.target.value)}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					>
						<option value="">-- Select Folder --</option>
						{folders.map((f) => (
							<option key={f} value={f}>{f}</option>
						))}
						<option value="__new_folder__">Add new folder...</option>
					</select>
				</div>

				{/* New Folder Input */}
				{selectedFolder === "__new_folder__" && (
					<div className="mb-4">
						<label className="block text-sm font-medium mb-1">New Folder Name</label>
						<input
							type="text"
							value={newFolder}
							onChange={(e) => setNewFolder(e.target.value)}
							className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>
				)}

				{/* Prompt Selection */}
				<div className="mb-4">
					<label className="flex items-center space-x-2">
						<input
							type="checkbox"
							checked={useDefault}
							onChange={(e) => setUseDefault(e.target.checked)}
							className="h-4 w-4 text-indigo-600"
						/>
						<span className="text-sm text-gray-700">Use default instruction</span>
					</label>
				</div>

				{useDefault && (
					<div className="mb-4">
						<label className="block text-sm font-medium mb-1">Instruction</label>
						<textarea
							value={instruction}
							onChange={(e) => setInstruction(e.target.value)}
							className="w-full border text-sm text-gray-900 border-gray-300 bg-gray-50 rounded-md px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>
				)}

				{!useDefault && (
					<>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">Greeting Prompt</label>
							<textarea
								value={custom_greet_instruction}
								onChange={(e) => setGreetingPrompt(e.target.value)}
								className="w-full border text-sm text-gray-900 border-gray-300 bg-gray-50 rounded-md px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">Custom Prompt</label>
							<textarea
								value={custom_instruction}
								onChange={(e) => setCustomPrompt(e.target.value)}
								className="w-full border text-sm text-gray-900 border-gray-300 bg-gray-50 rounded-md px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>
					</>
				)}

				<div className="flex justify-end gap-2">
					<button
						onClick={onClose}
						className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className="px-4 py-2 text-sm rounded-md bg-green-600 hover:bg-green-700 text-white"
					>
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
};


// ================== Update Prompt Modal ==================
const UpdatePromptModal = ({ candidate, onClose, fetchUsers }) => {
	const [useDefault, setUseDefault] = useState(candidate.use_default);
	const [instruction, setInstruction] = useState(candidate.instruction || "");
	const [custom_greet_instruction, setGreetingPrompt] = useState(candidate.custom_greet_instruction || "");
	const [custom_instruction, setCustomPrompt] = useState(candidate.custom_instruction || "");

	const handleSave = async () => {
		try {
			// ✅ Validation
			if (!useDefault) {
				if (!custom_greet_instruction.trim() || !custom_instruction.trim()) {
					toast.error("Greeting Prompt and Custom Prompt are required when not using default!");
					return;
				}
			}

			const result = await axios.post(`${URL}/update-instructions/${candidate.id}`, {
				use_default: useDefault,
				instruction: instruction,
				custom_greet_instruction: custom_greet_instruction,
				custom_instruction: custom_instruction,
			});


			if (result.status === 200) {
				await fetchUsers();
				toast.success(`Prompt updated`);
			}
			else {
				toast.error("Unable to update the prompt");
			}
			onClose();
		} catch (err) {
			console.error("Error updating prompt:", err);
			toast.error("Failed to update prompt");
		}
	};


	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
				<h3 className="text-xl font-bold mb-4">Update Prompt</h3>

				{/* Default Prompt Toggle */}
				<div className="mb-4">
					<label className="block text-sm font-medium mb-2">Use Default Prompt?</label>
					<div className="flex gap-4">
						<label className="flex items-center gap-2">
							<input
								type="radio"
								checked={useDefault}
								onChange={() => setUseDefault(true)}
							/>
							Yes
						</label>
						<label className="flex items-center gap-2">
							<input
								type="radio"
								checked={!useDefault}
								onChange={() => setUseDefault(false)}
							/>
							No
						</label>
					</div>
				</div>

				{/* Show fields conditionally */}
				{useDefault ? (
					<div className="mb-4">
						<label className="block text-sm font-medium mb-1">Instruction</label>
						<textarea
							value={instruction}
							onChange={(e) => setInstruction(e.target.value)}
							className="w-full border text-sm text-gray-900 border-gray-300 bg-gray-50 rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>
				) : (
					<>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">Greeting Prompt</label>
							<input
								type="text"
								value={custom_greet_instruction}
								onChange={(e) => setGreetingPrompt(e.target.value)}
								className="w-full border text-sm text-gray-900 border-gray-300 bg-gray-50 rounded-md px-3 py-2"
							/>
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">Custom Prompt</label>
							<textarea
								value={custom_instruction}
								onChange={(e) => setCustomPrompt(e.target.value)}
								className="w-full border text-sm text-gray-900 border-gray-300 bg-gray-50 rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>
					</>
				)}

				<div className="flex justify-end gap-2">
					<button
						onClick={onClose}
						className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						className="px-4 py-2 text-sm rounded-md bg-green-600 hover:bg-green-700 text-white"
					>
						Update
					</button>
				</div>
			</div>
		</div>
	);
};



const UploadModal = ({ onClose, fetchUsers }) => {
	const [file, setFile] = useState(null);

	// 📥 Handle file selection
	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		if (selectedFile) {
			setFile(selectedFile);
		}
		// 🔑 Reset input so selecting the same file again works
		e.target.value = "";
	};

	// 🗑️ Remove selected file
	const handleRemoveFile = () => {
		setFile(null);
	};

	// 📤 Handle file upload
	const handleUpload = async () => {
		if (!file) {
			toast.error("Please select a file before uploading!");
			return;
		}

		try {
			const formData = new FormData();
			formData.append("file", file);

			const result = await axios.post(`${URL}/import-users`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			if (result.status === 200) {
				await fetchUsers();
				toast.success("File uploaded successfully!");
				onClose();
			} else {
				toast.error("Unable to upload file");
			}
		} catch (err) {
			console.error("Error uploading file:", err);
			toast.error("Failed to upload file");
		}
	};

	// 📄 Handle sample file download
	const handleDownloadSample = () => {
		const sampleData = [
			["name", "phone", "folder_name", "custom_instruction", "custom_greet_instruction"],
			[
				"Rahul",
				"+918126578265",
				"Python",
				"You are an HR assistant. Ask about work experience and skills.",
				"Hi John! Let's start your interview."
			],
			[
				"Ram",
				"+918126578265",
				"Python",
				"You are a recruiter. Ask candidate about previous projects.",
				"Hi Jane! Good to meet you."
			],
			[
				"Rohan",
				"+918126578265",
				"Python",
				"You are a professional assistant. Collect candidate's job preferences.",
				"Hello Robert! Let's get started."
			]
		];

		const csvContent = sampleData.map((row) => row.join(",")).join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.style.display = "none";
		link.href = url;
		link.download = "sample_users.csv";
		document.body.appendChild(link);
		link.click();

		window.URL.revokeObjectURL(url);
		document.body.removeChild(link);
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
				<h3 className="text-xl font-bold mb-4">Upload Users</h3>

				{/* Instructions */}
				<div className="mb-4 text-sm text-gray-700">
					<p className="font-medium mb-1">Please follow these guidelines:</p>
					<ul className="list-disc list-inside space-y-1">
						<li>All fields <strong>name, phone, folder_name, custom_instruction, custom_greet_instruction</strong> are mandatory.</li>
						<li>Phone numbers must include their <strong>country code</strong>, e.g., +91, +1, etc.</li>
						<li>Use CSV or XLSX file format only.</li>
						<li>Ensure custom instructions do not contain line breaks or extra commas for CSV files.</li>
					</ul>
				</div>

				{/* File Input */}
				<div className="mb-4">
					<label htmlFor="file-upload" className="block text-sm font-medium mb-2">
						Select File
					</label>

					<label
						htmlFor="file-upload"
						className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200"
					>
						<svg
							className="w-8 h-8 text-gray-400 mb-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M7 16V4m0 0L3 8m4-4l4 4m6 8h-4a4 4 0 010-8h1m4 4h-4"
							/>
						</svg>
						<span className="text-gray-600 text-sm font-medium">
							Click to upload or drag and drop
						</span>
						<span className="text-xs text-gray-400 mt-1">
							CSV or XLSX files only
						</span>
						<input
							id="file-upload"
							type="file"
							accept=".csv,.xlsx"
							onChange={handleFileChange}
							className="hidden"
						/>
					</label>

					{/* Show selected file */}
					{file && (
						<div className="mt-2 flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2">
							<p className="text-sm text-gray-700 truncate">{file.name}</p>
							<button
								onClick={handleRemoveFile}
								className="text-gray-500 hover:text-red-500"
								aria-label="Remove file"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="w-4 h-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
								>
									<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
					)}
				</div>

				{/* Download Sample Button */}
				<div className="flex justify-center mb-4">
					<button
						onClick={handleDownloadSample}
						className="px-3 py-2 text-sm rounded-md bg-blue-500 hover:bg-blue-600 text-white"
					>
						Download Sample File
					</button>
				</div>

				{/* Action Buttons */}
				<div className="flex justify-end gap-2">
					<button
						onClick={onClose}
						className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
					>
						Cancel
					</button>
					<button
						onClick={handleUpload}
						className="px-4 py-2 text-sm rounded-md bg-green-600 hover:bg-green-700 text-white"
					>
						Upload
					</button>
				</div>
			</div>
		</div>
	);
};





const DeleteUserModal = ({ candidate, onClose, fetchUsers }) => {

	const handleDelete = async () => {
		try {

			const result = await axios.delete(`${URL}/delete-user/${candidate.id}`);

			if (result.status === 200) {
				await fetchUsers();
				toast.success(`User Deleted`);
			}
			else {
				toast.error("Unable to delete the user");
			}
			onClose();
		} catch (err) {
			console.error("Error deleting user:", err);
			toast.error("Failed to deleting user");
		}
	};


	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
				<h3 className="text-xl font-bold mb-4">Delete User</h3>
				<p className="mb-4">Are you sure you want to delete the user <strong>{candidate?.name}</strong>? This action cannot be undone.</p>

				<div className="flex justify-end gap-2">
					<button
						onClick={onClose}
						className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
					>
						Cancel
					</button>
					<button
						onClick={handleDelete}
						className="px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white"
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default Users;
