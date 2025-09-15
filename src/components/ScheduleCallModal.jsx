// components/ScheduleCallModal.jsx
import React, { useState } from "react";

const ScheduleCallModal = ({ onClose, onSchedule, count }) => {
  const [scheduleDate, setScheduleDate] = useState("");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4 text-gray-900">
          Schedule Calls
        </h2>
        <p className="mb-4 text-gray-700">
          Select date & time for <b>{count}</b> user(s):
        </p>
        <input
          type="datetime-local"
          value={scheduleDate}
          onChange={(e) => setScheduleDate(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-3 py-2 mb-6"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onSchedule(scheduleDate)}
            disabled={!scheduleDate}
            className={`px-4 py-2 rounded-xl text-white ${
              scheduleDate
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCallModal;
