import React, { useState } from "react";
import axios from "axios";

const Users = () => {
  const [showImmediateModal, setShowImmediateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [conversationInstructions, setConversationInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [transcriptModal, setTranscriptModal] = useState(null); // candidate object for transcript

  const candidatesData = [
    {
      id: 1,
      name: "Shreshth Bansal",
      phone: "+918126478265",
      selected: false,
      transcript: "",
      callStatus: false,
    },
    {
      id: 2,
      name: "Garv Bansal",
      phone: "+918439133006",
      selected: false,
      transcript: "",
      callStatus: false,
    },
  ];

  const [candidates, setCandidates] = useState(candidatesData);

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
          axios.post("https://voice-call-api.zinterview.ai/api/start-call", {
            destination_number: c.phone,
            instructions: conversationInstructions, // ✅ send instructions
          })
        )
      );

      alert("Calls placed successfully!");

      // Update callStatus
      setCandidates((prev) =>
        prev.map((c) =>
          c.selected ? { ...c, callStatus: true, transcript: "Transcript will appear here..." } : c
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

  const openTranscript = (candidate) => {
    // here you’d fetch transcript from API if available
    // axios.get(`/api/transcript/${candidate.id}`)...
    setTranscriptModal(candidate);
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
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Selected</th>
                  <th className="px-6 py-3">Call Status</th>
                  <th className="px-6 py-3">Action</th>
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
                    <td className="px-6 py-4">{c.selected ? "Yes" : "No"}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {c.callStatus ? "Called" : "Not Called"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="font-medium text-blue-600 hover:underline"
                        disabled={!c.callStatus}
                        onClick={() => openTranscript(c)}
                      >
                        View Transcript
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Immediate Call Modal */}
      {showImmediateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">AI Conversation Instructions</h3>
              <div className="mt-2 px-7 py-3">
                <textarea
                  rows="6"
                  value={conversationInstructions}
                  onChange={(e) => setConversationInstructions(e.target.value)}
                  className="block p-2.5 w-full text-sm border rounded-lg"
                  placeholder="e.g., 'Confirm they are still interested in the Software Engineer role...'"
                ></textarea>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={placeCallsNow}
                  disabled={loading}
                  className={`px-4 py-2 text-white rounded-md w-full ${
                    loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Placing Calls..." : "Confirm & Place Calls Now"}
                </button>
                <button
                  onClick={() => setShowImmediateModal(false)}
                  className="mt-3 px-4 py-2 bg-gray-200 text-gray-800 rounded-md w-full hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transcript Modal */}
      {transcriptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">
              Transcript: {transcriptModal.name}
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {transcriptModal.transcript || "Transcript not available yet."}
            </p>
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
