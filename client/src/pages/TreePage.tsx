import React, { useEffect, useState } from "react";
import { TreeNode } from "../components/TreeNode";
import type { TreeNodeData } from "../components/TreeNode";
import { createNode, getRoots, updateNode, deleteNode } from "../api/treeAPI";
import { AddNodeModal } from "../components/AddNodeModal";

export const TreePage: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeNodeData[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [autoExpandNodeId, setAutoExpandNodeId] = useState<string | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const res = await getRoots();
        setTreeData(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching tree:", error);
      }
    };
    fetchTree();
  }, []);

  const handleEdit = async (node: TreeNodeData, newName?: string) => {
    if (newName !== undefined) {
      // Save the edit (API call)
      try {
        await updateNode(node.id, { name: newName });
        console.log("Node updated successfully");

        // Update local state
        updateNodeById(treeData, node.id, (n) => (n.name = newName));
        setTreeData([...treeData]);
        setEditingNodeId(null);
      } catch (error) {
        console.error("Error updating node:", error);
        // Optionally show an error message to the user
      }
    } else {
      // Start editing mode
      setEditingNodeId(node.id);
    }
  };

  const handleCancelEdit = () => {
    setEditingNodeId(null);
  };

  const handleDelete = async (node: TreeNodeData) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${node.name}" and all its children?`
    );

    if (!confirmDelete) return;

    try {
      // Make API call to delete node
      await deleteNode(node.id);
      console.log("Node deleted successfully");

      // Update local state
      const updated = deleteNodeById(treeData, node.id);
      setTreeData(updated);
    } catch (error) {
      console.error("Error deleting node:", error);
      // Optionally show an error message to the user
    }
  };

  // Helper: Update by ID (recursive function)
  const updateNodeById = (
    nodes: TreeNodeData[],
    id: string,
    updateFn: (node: TreeNodeData) => void
  ): boolean => {
    for (const node of nodes) {
      if (node.id === id) {
        updateFn(node);
        return true;
      }
      if (node.children && updateNodeById(node.children, id, updateFn)) {
        return true;
      }
    }
    return false;
  };

  // Helper: Delete by ID (recursive function)
  const deleteNodeById = (
    nodes: TreeNodeData[],
    id: string
  ): TreeNodeData[] => {
    return nodes
      .filter((node) => node.id !== id)
      .map((node) => ({
        ...node,
        children: node.children ? deleteNodeById(node.children, id) : undefined,
      }));
  };

  const handleAddClick = (parent: TreeNodeData) => {
    console.log(parent.id, "parentId clicked");
    setSelectedParentId(parent.id);
    setShowModal(true);
  };

  const handleModalSubmit = async ({
    parentId,
    name,
  }: {
    parentId: string;
    name: string;
  }) => {
    try {
      // Make server request to create node
      const newNode = await createNode({ parentId, name });
      const id = newNode.data.id;
      console.log("New Node Created:", newNode.data, id);

      // Update the local tree
      updateNodeById(treeData, parentId, (n) => {
        n.children = n.children || [];
        n.children.push({ ...newNode.data, children: [] });
      });

      // Create new tree data and set auto-expand
      const newTreeData = [...treeData];
      setTreeData(newTreeData);

      // Set the newly created node to be auto-expanded
      setAutoExpandNodeId(id);
    } catch (error) {
      console.error("Error adding node:", error);
    } finally {
      setShowModal(false);
      setSelectedParentId(null);
    }
  };


  return (
    <div style={{ padding: "1rem" }}>
      <h2>Tree Structure</h2>
      {treeData.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          onEdit={handleEdit}
          onAdd={handleAddClick}
          onDelete={handleDelete}
          autoExpandNodeId={autoExpandNodeId}
          clearAutoExpandNodeId={() => setAutoExpandNodeId(null)}
          editingNodeId={editingNodeId} // Pass the editing node ID
          onCancelEdit={handleCancelEdit}
        />
      ))}
      {showModal && selectedParentId && (
        <AddNodeModal
          parentId={selectedParentId}
          onClose={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};
