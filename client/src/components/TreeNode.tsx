// import React, { useEffect, useState } from "react";
// import { ChevronRight, ChevronDown, Edit, Plus, Trash2 } from "lucide-react";

// export interface TreeNodeData {
//   id: string;
//   name: string;
//   children?: TreeNodeData[];
// }

// interface TreeNodeProps {
//   node: TreeNodeData;
//   onEdit: (node: TreeNodeData) => void;
//   onAdd: (parent: TreeNodeData) => void;
//   onDelete: (node: TreeNodeData) => void;
//   level?: number;
//   autoExpandNodeId?: string | null;
//   clearAutoExpandNodeId?: () => void;
// }

// export const TreeNode: React.FC<TreeNodeProps> = ({
//   node,
//   onEdit,
//   onAdd,
//   onDelete,
//   level = 0,
//   autoExpandNodeId,
//   clearAutoExpandNodeId,
// }) => {
//   const [expanded, setExpanded] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);

//   // Auto-expand effect - check if this node should be expanded
//   useEffect(() => {
//     if (autoExpandNodeId && node.children) {
//       // Check if the autoExpandNodeId is one of this node's children
//       const shouldExpand = node.children.some(child => child.id === autoExpandNodeId);
//       if (shouldExpand) {
//         setExpanded(true);
//         // Clear the auto-expand after a short delay to ensure it's processed
//         setTimeout(() => {
//           clearAutoExpandNodeId?.();
//         }, 100);
//       }
//     }
//   }, [autoExpandNodeId, node.children, clearAutoExpandNodeId]);

//   const hasChildren = node.children && node.children.length > 0;

//   return (
//     <div>
//       <div
//         className="flex items-center border-2 border-gray-200 rounded-xl px-2 py-1 mb-1 bg-white shadow-sm"
//         style={{ marginLeft: `${level * 20}px` }}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         {/* Expand/Collapse Button - always show if has children */}
//         {hasChildren && (
//           <button
//             onClick={() => setExpanded((prev) => !prev)}
//             className="flex items-center justify-center w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700"
//           >
//             {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//           </button>
//         )}

//         {/* Node Name */}
//         <span className="flex-1 ml-2 text-sm text-gray-800 select-none">
//           {node.name}
//         </span>

//         {/* Action Buttons - only show on hover */}
//         {isHovered && (
//           <>
//             <button
//               onClick={() => onEdit(node)}
//               className="flex items-center justify-center w-6 h-6 ml-1 cursor-pointer text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
//               title="Edit"
//             >
//               <Edit size={14} />
//             </button>
//             <button
//               onClick={() => onAdd(node)}
//               className="flex items-center justify-center w-6 h-6 ml-1 cursor-pointer text-green-500 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
//               title="Add child"
//             >
//               <Plus size={14} />
//             </button>
//             <button
//               onClick={() => onDelete(node)}
//               className="flex items-center justify-center w-6 h-6 ml-1 cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
//               title="Delete"
//             >
//               <Trash2 size={14} />
//             </button>
//           </>
//         )}
//       </div>

//       {/* Children */}
//       {expanded && hasChildren && (
//         <div>
//           {node.children!.map((child) => (
//             <TreeNode
//               key={child.id}
//               node={child}
//               onEdit={onEdit}
//               onAdd={onAdd}
//               onDelete={onDelete}
//               level={level + 1}
//               autoExpandNodeId={autoExpandNodeId}
//               clearAutoExpandNodeId={clearAutoExpandNodeId}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// import React, { useEffect, useState, useRef } from "react";
// import { ChevronRight, ChevronDown, Edit, Plus, Trash2, Check, X } from "lucide-react";

// export interface TreeNodeData {
//   id: string;
//   name: string;
//   children?: TreeNodeData[];
// }

// interface TreeNodeProps {
//   node: TreeNodeData;
//   onEdit: (node: TreeNodeData, newName?: string) => void;
//   onAdd: (parent: TreeNodeData) => void;
//   onDelete: (node: TreeNodeData) => void;
//   level?: number;
//   autoExpandNodeId?: string | null;
//   clearAutoExpandNodeId?: () => void;
//   isEditing?: boolean;
//   onCancelEdit?: () => void;
// }

// export const TreeNode: React.FC<TreeNodeProps> = ({
//   node,
//   onEdit,
//   onAdd,
//   onDelete,
//   level = 0,
//   autoExpandNodeId,
//   clearAutoExpandNodeId,
//   isEditing = false,
//   onCancelEdit,
// }) => {
//   const [expanded, setExpanded] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [editValue, setEditValue] = useState(node.name);
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Auto-expand effect - check if this node should be expanded
//   useEffect(() => {
//     if (autoExpandNodeId && node.children) {
//       // Check if the autoExpandNodeId is one of this node's children
//       const shouldExpand = node.children.some(child => child.id === autoExpandNodeId);
//       if (shouldExpand) {
//         setExpanded(true);
//         // Clear the auto-expand after a short delay to ensure it's processed
//         setTimeout(() => {
//           clearAutoExpandNodeId?.();
//         }, 100);
//       }
//     }
//   }, [autoExpandNodeId, node.children, clearAutoExpandNodeId]);

//   // Focus input when editing starts
//   useEffect(() => {
//     if (isEditing && inputRef.current) {
//       inputRef.current.focus();
//       inputRef.current.select();
//     }
//   }, [isEditing]);

//   // Reset edit value when node name changes
//   useEffect(() => {
//     setEditValue(node.name);
//   }, [node.name]);

//   const hasChildren = node.children && node.children.length > 0;

//   const handleSaveEdit = () => {
//     if (editValue.trim() && editValue.trim() !== node.name) {
//       onEdit(node, editValue.trim());
//     } else {
//       onCancelEdit?.();
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditValue(node.name);
//     onCancelEdit?.();
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       handleSaveEdit();
//     } else if (e.key === 'Escape') {
//       handleCancelEdit();
//     }
//   };

//   return (
//     <div>
//       <div
//         className="flex items-center border-2 border-gray-200 rounded-xl px-2 py-1 mb-1 bg-white shadow-sm"
//         style={{ marginLeft: `${level * 20}px` }}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         {/* Expand/Collapse Button - always show if has children */}
//         {hasChildren && (
//           <button
//             onClick={() => setExpanded((prev) => !prev)}
//             className="flex items-center justify-center w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700"
//           >
//             {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//           </button>
//         )}

//         {/* Node Name or Edit Input */}
//         {isEditing ? (
//           <input
//             ref={inputRef}
//             type="text"
//             value={editValue}
//             onChange={(e) => setEditValue(e.target.value)}
//             onKeyDown={handleKeyPress}
//             onBlur={handleSaveEdit}
//             className="flex-1 ml-2 text-sm text-gray-800 border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         ) : (
//           <span className="flex-1 ml-2 text-sm text-gray-800 select-none">
//             {node.name}
//           </span>
//         )}

//         {/* Action Buttons */}
//         {isEditing ? (
//           /* Edit mode buttons */
//           <div className="flex items-center ml-2">
//             <button
//               onClick={handleSaveEdit}
//               className="flex items-center justify-center w-6 h-6 ml-1 cursor-pointer text-green-500 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
//               title="Save"
//             >
//               <Check size={14} />
//             </button>
//             <button
//               onClick={handleCancelEdit}
//               className="flex items-center justify-center w-6 h-6 ml-1 cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
//               title="Cancel"
//             >
//               <X size={14} />
//             </button>
//           </div>
//         ) : (
//           /* Normal mode buttons - only show on hover */
//           isHovered && (
//             <>
//               <button
//                 onClick={() => onEdit(node)}
//                 className="flex items-center justify-center w-6 h-6 ml-1 cursor-pointer text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
//                 title="Edit"
//               >
//                 <Edit size={14} />
//               </button>
//               <button
//                 onClick={() => onAdd(node)}
//                 className="flex items-center justify-center w-6 h-6 ml-1 cursor-pointer text-green-500 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
//                 title="Add child"
//               >
//                 <Plus size={14} />
//               </button>
//               <button
//                 onClick={() => onDelete(node)}
//                 className="flex items-center justify-center w-6 h-6 ml-1 cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
//                 title="Delete"
//               >
//                 <Trash2 size={14} />
//               </button>
//             </>
//           )
//         )}
//       </div>

//       {/* Children */}
//       {expanded && hasChildren && (
//         <div>
//           {node.children!.map((child) => (
//             <TreeNode
//               key={child.id}
//               node={child}
//               onEdit={onEdit}
//               onAdd={onAdd}
//               onDelete={onDelete}
//               level={level + 1}
//               autoExpandNodeId={autoExpandNodeId}
//               clearAutoExpandNodeId={clearAutoExpandNodeId}
//               isEditing={false} // Only one node can be edited at a time
//               onCancelEdit={onCancelEdit}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

import React, { useEffect, useState, useRef } from "react";
import { ChevronRight, ChevronDown, Edit, Plus, Trash2, Check, X } from "lucide-react";

export interface TreeNodeData {
  id: string;
  name: string;
  children?: TreeNodeData[];
}

interface TreeNodeProps {
  node: TreeNodeData;
  onEdit: (node: TreeNodeData, newName?: string) => void;
  onAdd: (parent: TreeNodeData) => void;
  onDelete: (node: TreeNodeData) => void;
  level?: number;
  autoExpandNodeId?: string | null;
  clearAutoExpandNodeId?: () => void;
  editingNodeId?: string | null; // Changed from isEditing boolean to editingNodeId string
  onCancelEdit?: () => void;
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  onEdit,
  onAdd,
  onDelete,
  level = 0,
  autoExpandNodeId,
  clearAutoExpandNodeId,
  editingNodeId = null, // Changed parameter name
  onCancelEdit,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [editValue, setEditValue] = useState(node.name);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if this specific node is being edited
  const isEditing = editingNodeId === node.id;

  // Auto-expand effect - check if this node should be expanded
  useEffect(() => {
    if (autoExpandNodeId && node.children) {
      // Check if the autoExpandNodeId is one of this node's children (recursive check)
      const findNodeInChildren = (children: TreeNodeData[]): boolean => {
        return children.some(child => {
          if (child.id === autoExpandNodeId) return true;
          if (child.children) return findNodeInChildren(child.children);
          return false;
        });
      };

      const shouldExpand = findNodeInChildren(node.children);
      if (shouldExpand) {
        setExpanded(true);
        // Clear the auto-expand after a short delay to ensure it's processed
        setTimeout(() => {
          clearAutoExpandNodeId?.();
        }, 100);
      }
    }
  }, [autoExpandNodeId, node.children, clearAutoExpandNodeId]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Reset edit value when node name changes
  useEffect(() => {
    setEditValue(node.name);
  }, [node.name]);

  // More robust check for children
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;

  const handleSaveEdit = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== node.name) {
      onEdit(node, trimmedValue);
    } else {
      onCancelEdit?.();
    }
  };

  const handleCancelEdit = () => {
    setEditValue(node.name);
    onCancelEdit?.();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(node);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd(node);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(node);
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  return (
    <div>
      <div
        className="flex items-center border-2 border-gray-200 rounded-xl px-2 py-1 mb-1 bg-white shadow-sm"
        style={{ marginLeft: `${level * 20}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Expand/Collapse Button - show if has children or placeholder space */}
        <div className="w-5 h-5 flex items-center justify-center">
          {hasChildren ? (
            <button
              onClick={handleExpandClick}
              className="flex items-center justify-center w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700"
            >
              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            // Empty space to maintain alignment
            <div className="w-5 h-5" />
          )}
        </div>

        {/* Node Name or Edit Input */}
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleSaveEdit}
            className="flex-1 ml-2 text-sm text-gray-800 border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="flex-1 ml-2 text-sm text-gray-800 select-none">
            {node.name}
          </span>
        )}

        {/* Action Buttons */}
        {isEditing ? (
          /* Edit mode buttons */
          <div className="flex items-center ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSaveEdit();
              }}
              className="flex items-center justify-center w-6 h-6 ml-1 cursor-pointer text-green-500 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
              title="Save"
            >
              <Check size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCancelEdit();
              }}
              className="flex items-center justify-center w-6 h-6 ml-1 cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              title="Cancel"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          /* Normal mode buttons - only show on hover */
          isHovered && (
            <div className="flex items-center ml-2">
              <button
                onClick={handleEditClick}
                className="flex items-center justify-center w-6 h-6 ml-1 cursor-pointer text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                title="Edit"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={handleAddClick}
                className="flex items-center justify-center w-6 h-6 ml-1 cursor-pointer text-green-500 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                title="Add child"
              >
                <Plus size={14} />
              </button>
              <button
                onClick={handleDeleteClick}
                className="flex items-center justify-center w-6 h-6 ml-1 cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )
        )}
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              onEdit={onEdit}
              onAdd={onAdd}
              onDelete={onDelete}
              level={level + 1}
              autoExpandNodeId={autoExpandNodeId}
              clearAutoExpandNodeId={clearAutoExpandNodeId}
              editingNodeId={editingNodeId} // Pass down the editing node ID
              onCancelEdit={onCancelEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};