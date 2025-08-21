import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineFileText } from "react-icons/ai";
import { FiPhone } from "react-icons/fi";
import { RiQuestionAnswerLine } from "react-icons/ri";



const Users = () => {
  const [showImmediateModal, setShowImmediateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [conversationInstructions, setConversationInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [transcriptModal, setTranscriptModal] = useState(null); // candidate object for transcript
  const [candidates, setCandidates] = useState([]);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);

  // New candidate form state
  const [newCandidateName, setNewCandidateName] = useState("");
  const [newCandidatePhone, setNewCandidatePhone] = useState("");
  const [newCandidateQuestions, setNewCandidateQuestions] = useState([""]); // array of strings

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://0.0.0.0:3000/api/users");
        const users = res.data.map((u) => ({
          id: u.user_id,
          name: u.name,
          phone: u.destination_number,
          selected: false,
          transcript: "",
          callStatus: false,
          questions: [], // initialize questions
        }));
        setCandidates(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleCheckboxChange = (id) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  };

  const placeCallsNow = async () => {
    const selectedCandidates = candidates.filter((c) => c.selected);

    if (selectedCandidates.length === 0) {
      alert("Please select at least one candidate!");
      return;
    }
    if (!conversationInstructions.trim()) {
      alert("Please provide conversation instructions!");
      return;
    }

    try {
      setLoading(true);

      await Promise.all(
        selectedCandidates.map((c) =>
          axios.post("http://0.0.0.0:3000/api/start-call", {
            user_id: c.id,
          })
        )
      );

      alert("Calls placed successfully!");

      setCandidates((prev) =>
        prev.map((c) =>
          c.selected
            ? { ...c, callStatus: true, transcript: "Transcript will appear here..." }
            : c
        )
      );

      setShowImmediateModal(false);
      setConversationInstructions(""); // reset
    } catch (error) {
      console.error("Error placing calls:", error);
      alert("Failed to place calls. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const placeSingleCall = async (candidate) => {
    try {
      setLoading(true);
      await axios.post("http://0.0.0.0:3000/api/start-call", {
        user_id: candidate.id,
      });

      alert(`Call placed successfully to ${candidate.name}!`);

      setCandidates((prev) =>
        prev.map((c) =>
          c.id === candidate.id
            ? { ...c, callStatus: true, transcript: "Transcript will appear here..." }
            : c
        )
      );
    } catch (error) {
      console.error("Error placing call:", error);
      alert("Failed to place call. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openTranscript = (candidate) => {
    setTranscriptModal(candidate);
  };

  const handleAddQuestionChange = (index, value) => {
    const updatedQuestions = [...newCandidateQuestions];
    updatedQuestions[index] = value;
    setNewCandidateQuestions(updatedQuestions);
  };

  const addQuestionField = () => {
    setNewCandidateQuestions([...newCandidateQuestions, ""]);
  };

  const removeQuestionField = (index) => {
    setNewCandidateQuestions(newCandidateQuestions.filter((_, i) => i !== index));
  };

  const handleAddCandidate = () => {
    if (!newCandidateName || !newCandidatePhone) {
      alert("Name and phone are required!");
      return;
    }

    const newCandidate = {
      id: Date.now(), // simple unique id
      name: newCandidateName,
      phone: newCandidatePhone,
      selected: false,
      transcript: "",
      callStatus: false,
      questions: newCandidateQuestions.filter((q) => q.trim() !== ""),
    };

    setCandidates((prev) => [...prev, newCandidate]);
    setShowAddCandidateModal(false);
    setNewCandidateName("");
    setNewCandidatePhone("");
    setNewCandidateQuestions([""]);
  };

  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              AI Candidate Screening @Zinterview.ai
            </h1>
            <p className="text-gray-600 mt-1">
              Select candidates, provide conversation instructions, and view call transcripts.
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowAddCandidateModal(true)}
              className="text-white bg-purple-600 hover:bg-purple-700 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Add Candidate
            </button>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Schedule Calls
            </button>
            <button
              onClick={() => setShowImmediateModal(true)}
              className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5"
            >
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
                        checked={c.selected}
                        onChange={() => handleCheckboxChange(c.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                    <td className="px-6 py-4">{c.phone}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {c.callStatus ? "Called" : "Not Called"}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                     <button
              className="flex items-center gap-1 font-medium text-blue-600 hover:underline"
              onClick={() => openTranscript(c)}
            >
              <AiOutlineFileText />
            </button>

            <button
              className="flex items-center gap-1 font-medium text-green-600 hover:underline"
              onClick={() => placeSingleCall(c)}
              disabled={loading}
            >
              <FiPhone />
            </button>

            <button
              className="flex items-center gap-1 font-medium text-purple-600 hover:underline"
              onClick={() => openTranscript(c)} // or a separate function for questions
            >
              <RiQuestionAnswerLine />
            </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Candidate Modal */}
      {showAddCandidateModal && (
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
            <input
              type="text"
              placeholder="Phone Number"
              value={newCandidatePhone}
              onChange={(e) => setNewCandidatePhone(e.target.value)}
              className="block w-full p-2 mb-3 border rounded"
            />

            <h4 className="font-medium mb-2">Questions:</h4>
            {newCandidateQuestions.map((q, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={q}
                  onChange={(e) => handleAddQuestionChange(i, e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder={`Question ${i + 1}`}
                />
                <button
                  onClick={() => removeQuestionField(i)}
                  className="bg-red-500 text-white px-2 rounded hover:bg-red-600"
                >
                  X
                </button>
              </div>
            ))}
            <button
              onClick={addQuestionField}
              className="mb-3 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Question
            </button>

            <div className="flex justify-end gap-2">
              <button
                onClick={handleAddCandidate}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddCandidateModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transcript / Questions Modal */}
      {transcriptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">
              {transcriptModal.callStatus ? "Transcript" : "Questions"}: {transcriptModal.name}
            </h3>
            <div className="text-gray-700 whitespace-pre-wrap">
              {transcriptModal.callStatus
                ? transcriptModal.transcript || "Transcript not available yet."
                : transcriptModal.questions.length > 0
                ? transcriptModal.questions.map((q, i) => (
                    <p key={i}>
                      {i + 1}. {q}
                    </p>
                  ))
                : "No questions added."}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setTranscriptModal(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
