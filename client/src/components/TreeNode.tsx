import React, { useEffect, useState } from "react";
import { ChevronRight, ChevronDown, Edit, Plus, Trash2 } from "lucide-react";

export interface TreeNodeData {
  id: string;
  name: string;
  children?: TreeNodeData[];
}

interface TreeNodeProps {
  node: TreeNodeData;
  onEdit: (node: TreeNodeData) => void;
  onAdd: (parent: TreeNodeData) => void;
  onDelete: (node: TreeNodeData) => void;
  level?: number;
  autoExpandNodeId?: string;
  clearAutoExpandNodeId?: () => void;
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  onEdit,
  onAdd,
  onDelete,
  level = 0,
  autoExpandNodeId,
  clearAutoExpandNodeId,
}) => {
 

useEffect(() => {
  if (autoExpandNodeId === node.id) {
    setExpanded(true);
    clearAutoExpandNodeId?.(); // clear after expanding once
  }
}, [autoExpandNodeId]);


  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className="flex items-center border-2 border-gray-200  rounded-xl px-2 py-1 mb-1 bg-white shadow-sm"
        style={{ marginLeft: `${level * 20}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
       
        {isHovered && hasChildren && (
          
           <button
          onClick={() => setExpanded((prev) => !prev)}
          className="flex items-center justify-center w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700"
        >
          {hasChildren ? (
            expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
          ) : null}
        </button>
          
        )}

        {/* Node Name */}
        <span className="flex-1 ml-2 text-sm text-gray-800 select-none">
          {node.name}
        </span>
            {isHovered && 
             <button
             onClick={() => onEdit(node)}
             className="flex items-center justify-center w-6 h-6 ml-1 cursor-pointer text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
             title="Edit"
           >
             <Edit size={14} />
           </button>
            }
        {/* Add and Delete Buttons */}
        {isHovered && (
          <>
            <button
              onClick={() => onAdd(node)}
              className="flex items-center justify-center w-6 h-6 ml-1 cursor-pointer text-green-500 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
              title="Add child"
            >
              <Plus size={14} />
            </button>
            <button
              onClick={() => onDelete(node)}
              className="flex items-center justify-center w-6 h-6 ml-1 cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </>
        )}
      </div>

      {/* Children */}
      {expanded && hasChildren  &&
      (<div>
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
            />
          ))}
        </div> )}
    </div>
  );
};
