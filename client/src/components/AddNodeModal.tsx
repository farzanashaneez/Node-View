import React, { useState } from "react";

interface AddNodeModalProps {
  parentId: string;
  onClose: () => void;
  onSubmit: (data: { parentId: string; name: string }) => void;
}

export const AddNodeModal: React.FC<AddNodeModalProps> = ({ 
  parentId, 
  onClose, 
  onSubmit 
}) => {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit({ parentId, name: name.trim() });
      setName(""); // Clear the input after submission
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-80 shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Add New Node</h2>
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter node name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyPress}
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};