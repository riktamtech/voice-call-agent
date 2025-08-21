import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineFileText } from "react-icons/ai";
import { FiPhone } from "react-icons/fi";
import { RiQuestionAnswerLine } from "react-icons/ri";
import { AiOutlineUserAdd, AiOutlineSchedule, AiOutlinePhone } from "react-icons/ai";

import { toast } from "react-toastify";
const URL = import.meta.env.VITE_API_URL;
const Users = () => {
	const [loading, setLoading] = useState(false);

	const [showImmediateModal, setShowImmediateModal] = useState(false);
	const [showScheduleModal, setShowScheduleModal] = useState(false);
	const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
	const [selectedIds, setSelectedIds] = useState([]);

	const [transcriptModal, setTranscriptModal] = useState(null);
	const [instructionsModal, setInstructionsModal] = useState(null);
	const [candidates, setCandidates] = useState([]);

	const [newCandidateName, setNewCandidateName] = useState("");
	const [newCandidatePhone, setNewCandidatePhone] = useState("");
	const [newCandidateInstruction, setCandidateInstruction] = useState("");

	// Fetch candidates
	const fetchUsers = async () => {
		try {
			let route = URL + "/users";
			const res = await axios.get(route);
			const users = res.data.map((u) => ({
				id: u.user_id,
				name: u.name,
				phone: u.phone,
				instruction: u.instruction,
				transcription: u.transcription,
				call_status: u.call_status,
			}));
			setCandidates(users);
		} catch (error) {
			console.error("Error fetching users:", error);
		}
	};
	useEffect(() => {
		fetchUsers();
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

	const handleAddCandidate = async () => {
		try {
			if (!newCandidateName || !newCandidatePhone) {
				toast.error("Name and phone are required!");
				return;
			}

			if (newCandidatePhone.length !== 10) {
				toast.error("Enter 10 digit valid phone number");
				return;
			}

			const data = {
				name: newCandidateName,
				phone: newCandidatePhone,
				instruction: newCandidateInstruction,
			};

			setLoading(true);
			const route = URL + "/create-user";
			const result = await axios.post(route, data);

			if (result.status === 201) {
				// ✅ Only close modal if success
				await fetchUsers();
				toast.success(`User Added`);

				setShowAddCandidateModal(false);
				setNewCandidateName("");
				setNewCandidatePhone("");
				setCandidateInstruction("");
			} else {
				toast.error("Unable to create the user");
			}
		} catch (error) {
			console.error("Error creating user:", error);
			toast.error("Unable to create the user");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="container mx-auto p-4 sm:p-6 lg:p-8">
				<header className="mb-8 flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">
							AI Candidate Screening via Voice Call
						</h1>
						<p className="text-gray-600 mt-1">
							Select candidates, provide conversation instructions, and view call transcripts.
						</p>
					</div>
					<div className="flex space-x-2">
						{/* Add Candidate */}
						<button
							onClick={() => setShowAddCandidateModal(true)}
							className="flex items-center gap-2 text-white bg-purple-600 hover:bg-purple-700 font-medium rounded-lg text-sm px-5 py-2.5"
						>
							<AiOutlineUserAdd size={18} />
							Add Candidate
						</button>

						{/* Schedule Calls */}
						<button
							onClick={() => setShowScheduleModal(true)}
							className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5"
						>
							<AiOutlineSchedule size={18} />
							Schedule Calls
						</button>

						{/* Place Immediate Calls */}
						<button
							onClick={() => setShowImmediateModal(true)}
							className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5"
						>
							<AiOutlinePhone size={18} />
							Place Immediate Calls
						</button>
					</div>
				</header>

				{/* Candidate Table */}
				<div className="bg-white p-6 rounded-xl shadow-md">
					<h2 className="text-xl font-semibold mb-4">Candidates</h2>
					<div className="overflow-x-auto">
						<table className="w-full text-sm text-left text-gray-500">
							<thead className="text-xs text-gray-700 uppercase bg-gray-50">
								<tr>
									<th className="p-4">Select</th>
									<th className="px-6 py-3">Candidate's Name</th>
									<th className="px-6 py-3">Phone Number</th>
									<th className="px-6 py-3">Call Status</th>
									<th className="px-6 py-3">Actions</th>
								</tr>
							</thead>
							<tbody>
								{candidates.map((c) => (
									<tr key={c.id} className="bg-white border-b hover:bg-gray-50">
										<td className="w-4 p-4">
											<input
												type="checkbox"
												checked={selectedIds.includes(c.id)}
												onChange={() => handleCheckboxChange(c.id)}
												className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
											/>
										</td>
										<td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
										<td className="px-6 py-4">{c.phone}</td>
										<td className="px-6 py-4">
											<span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
												{c.call_status}
											</span>
										</td>
										<td className="px-6 py-4 flex gap-2">
											<button
												className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 shadow-md"
												onClick={() => openTranscript(c)}
											>
												<AiOutlineFileText size={20} />
											</button>

											<button
												className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
												onClick={() => call(c)}
												disabled={loading}
											>
												<FiPhone size={20} />
											</button>

											<button
												className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 shadow-md"
												onClick={() => openInstructions(c)}
											>
												<RiQuestionAnswerLine size={20} />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* ================== Modals ================== */}
			{showAddCandidateModal && (
				<AddCandidateModal
					isOpen={showAddCandidateModal}
					onClose={() => setShowAddCandidateModal(false)}
					newCandidateName={newCandidateName}
					setNewCandidateName={setNewCandidateName}
					newCandidatePhone={newCandidatePhone}
					setNewCandidatePhone={setNewCandidatePhone}
					newCandidateInstruction={newCandidateInstruction}
					setCandidateInstruction={setCandidateInstruction}
					handleAddCandidate={handleAddCandidate}
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
		</>
	);
};

// ================== Schedule Modal ==================
const ScheduleModal = ({ isOpen, onClose, selectedIds, setShowScheduleModal }) => {
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");
	const [instruction, setInstruction] = useState("");

	if (!isOpen) return null;

	const onConfirm = async () => {
		if (selectedIds.length == 0) {
			toast.error("Select at least one candidate");
			return;
		}
		if (!date || !time) {
			toast.error("Date and Time are required");
			return;
		}
		try {
			const schedule_time = new Date(`${date}T${time}:00`).toISOString();
			await axios.post(URL + "/start-batch-call", {
				user_ids: selectedIds,
				instruction,
				schedule_time,
			});
			toast.success("Batch call initiated!");
			setDate("");
			setTime("");
			setInstruction("");
			setShowScheduleModal(false);
		} catch (err) {
			console.error("Error placing call:", err);
			toast.error("Failed to place call. Please try again.");
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
				<h2 className="text-xl font-semibold mb-4 text-center">Schedule Screening Calls</h2>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">Date</label>
					<input
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">Time</label>
					<input
						type="time"
						value={time}
						onChange={(e) => setTime(e.target.value)}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">AI Conversation Instructions</label>
					<textarea
						value={instruction}
						onChange={(e) => setInstruction(e.target.value)}
						placeholder="e.g., 'Confirm interest...'"
						className="w-full border text-sm text-gray-900 border-gray-300 bg-gray-50 rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>
				</div>
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
	const [instruction, setInstruction] = useState("");
	if (!isOpen) return null;

	const onConfirm = async () => {
		if (selectedIds.length == 0) {
			toast.error("Select at least one candidate");
			return;
		}
		try {
			await axios.post(URL + "/start-batch-call", { user_ids: selectedIds, instruction });
			toast.success("Batch call initiated!");
			setInstruction("");
			setShowImmediateModal(false);
		} catch (err) {
			console.error("Error placing call:", err);
			toast.error("Failed to place call. Please try again.");
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
				<h2 className="text-xl font-semibold mb-4 text-center">AI Conversation Instructions</h2>
				<textarea
					value={instruction}
					onChange={(e) => setInstruction(e.target.value)}
					className="w-full h-32 border text-sm text-gray-900 border-gray-300 bg-gray-50 rounded-md p-2 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="e.g., 'Confirm interest...'"
				/>
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
						Confirm & Place Calls Now
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
				{candidate.transcription.length === 0 ? (
					<p>No transcription available.</p>
				) : (
					candidate.transcription.map((t, idx) => (
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
			<div className="text-gray-700 whitespace-pre-wrap">{candidate.instruction}</div>
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

// ================== Add Candidate Modal ==================
const AddCandidateModal = ({
	isOpen,
	onClose,
	newCandidateName,
	setNewCandidateName,
	newCandidatePhone,
	setNewCandidatePhone,
	newCandidateInstruction,
	setCandidateInstruction,
	handleAddCandidate,
}) => {
	if (!isOpen) return null;
	return (
		<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
			<div className="mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
				<h3 className="text-lg font-medium text-gray-900 mb-4">Add New Candidate</h3>
				<input
					type="text"
					placeholder="Name"
					value={newCandidateName}
					onChange={(e) => setNewCandidateName(e.target.value)}
					className="block w-full p-2 mb-3 border rounded"
				/>
				<div className="flex items-center border rounded-lg overflow-hidden mb-3 w-full">
					<span className="px-3 py-2 bg-gray-100 text-gray-700 border-r text-sm">+91</span>
					<input
						type="text"
						placeholder="Phone Number"
						value={newCandidatePhone}
						onChange={(e) => setNewCandidatePhone(e.target.value)}
						className="flex-1 px-3 py-2 focus:outline-none text-sm"
					/>
				</div>
				<h4 className="font-medium mb-2">AI Conversation Instructions</h4>
				<textarea
					value={newCandidateInstruction}
					onChange={(e) => setCandidateInstruction(e.target.value)}
					rows="8"
					className="block p-2.5 mt-2 mb-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
					placeholder="e.g., 'Confirm interest in the role...'"
				></textarea>
				<div className="flex justify-end gap-2">
					<button
						onClick={onClose}
						className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
					>
						Cancel
					</button>
					<button
						onClick={handleAddCandidate}
						className="px-4 py-2 text-sm rounded-md bg-green-600 hover:bg-green-700 text-white"
					>
						Add Candidate
					</button>
				</div>
			</div>
		</div>
	);
};

export default Users;
