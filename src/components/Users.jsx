import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineFileText } from "react-icons/ai";
import { FiPhone } from "react-icons/fi";
import { RiQuestionAnswerLine } from "react-icons/ri";
import { AiOutlineUserAdd, AiOutlineSchedule, AiOutlinePhone, AiOutlineEdit } from "react-icons/ai";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { toast } from "react-toastify";
const URL = import.meta.env.VITE_API_URL;
const Users = () => {
	const [loading, setLoading] = useState(false);

	const [showImmediateModal, setShowImmediateModal] = useState(false);
	const [showScheduleModal, setShowScheduleModal] = useState(false);
	const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
	const [selectedIds, setSelectedIds] = useState([]);
	const [promptModal, setPromptModal] = useState(null);

	const [transcriptModal, setTranscriptModal] = useState(null);
	const [instructionsModal, setInstructionsModal] = useState(null);
	const [candidates, setCandidates] = useState([]);


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
				schedule_time: u.schedule_time,
				use_default: u.use_default,
				custom_instruction: u.custom_instruction,
				custom_greet_instruction: u.custom_greet_instruction,
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


	useEffect(() => {
		fetchUsers(); // initial load

		const interval = setInterval(() => {
			fetchUsers();
		}, 10000); // every 10 sec

		return () => clearInterval(interval); // cleanup
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
									<th className="px-6 py-3 text-center">Name</th>
									<th className="px-6 py-3 text-center">Phone Number</th>
									<th className="px-6 py-3 text-center">Call Status</th>
									<th className="px-6 py-3 text-center">Scheduled At</th>
									<th className="px-6 py-3 text-center">Actions</th>
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
										<td className="px-6 py-4 font-medium text-gray-900 text-center">{c.name}</td>
										<td className="px-6 py-4 text-center">{c.phone}</td>
										<td className="px-6 py-4 text-center">
											<span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
												{c.call_status}
											</span>
										</td>
										<td className="px-6 py-4 text-center">
											<span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
												{c.schedule_time ? new Date(c.schedule_time).toLocaleString() : "Not Scheduled"}
											</span>
										</td>
										<td className="px-6 py-4 flex gap-2 justify-center">
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

											<button
												className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 shadow-md"
												onClick={() => setPromptModal(c)}
											>
												<AiOutlineEdit size={20} />
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
					setShowAddCandidateModal={setShowAddCandidateModal}
					onClose={() => setShowAddCandidateModal(false)}
					fetchUsers={fetchUsers}
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
		</>
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
				<h2 className="text-xl font-semibold mb-4 text-center">Schedule Screening Calls</h2>

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
				<h2 className="text-xl font-semibold mb-4 text-center">Schedule Screening Calls</h2>

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

const AddCandidateModal = ({ isOpen, onClose, setShowAddCandidateModal, fetchUsers }) => {
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
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

		// if (phone.length !== 10) {
		// 	toast.error("Enter 10 digit valid phone number");
		// 	return;
		// }


		if (!useDefault && (!custom_greet_instruction.trim() || !custom_instruction.trim())) {
			toast.error("Greeting and Custom Prompt are required when not using default");
			return;
		}

		try {
			const result = await axios.post(URL + "/create-user", {
				name,
				phone,
				use_default: useDefault,
				instruction: instruction,
				custom_greet_instruction: custom_greet_instruction,
				custom_instruction: custom_instruction,
			});
			if (result.status === 201) {
				await fetchUsers();
				toast.success(`User Added`);
			}
			else {
				toast.error("Unable to create the user");
			}
			setShowAddCandidateModal(false);
		} catch (err) {
			console.error("Error creating users:", err);
			toast.error("Error creating users");
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
				<h2 className="text-xl font-semibold mb-4 text-center">Add Candiadtes</h2>

				{/* Date */}
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">Name</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>
				</div>

				{/* Time */}
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">Phone</label>
					<PhoneInput
						defaultCountry="in"
						value={phone}
						onChange={(val) => setPhone(val)}
						className=""
						inputStyle={{ width: "100%" }}
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
						Save
					</button>
				</div>
			</div>
		</div>
	);
};

export default Users;
