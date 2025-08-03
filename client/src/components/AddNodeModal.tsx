// AddNodeModal.tsx
import React, { useState } from "react";

export const AddNodeModal = ({ parentId, onClose, onSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit({ parentId, name });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-80 shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Add New Node</h2>
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
          placeholder="Enter node name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-500 text-white"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
