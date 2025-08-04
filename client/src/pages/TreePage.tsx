import React, { useEffect, useState } from "react";
import type { TreeNodeData } from "../components/TreeNode";
import { createNode, getRoots, updateNode, deleteNode } from "../api/treeAPI";
import { AddNodeModal } from "../components/AddNodeModal";
import { Suspense, lazy } from "react";
import LoadingFallback from "../components/LoadingFallback";
import CustomSnackbar from "../components/CustomSnackBar";
const TreeNode = lazy(() => import("../components/TreeNode"));

const TreePage: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeNodeData[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [autoExpandNodeId, setAutoExpandNodeId] = useState<string | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [isAddingRoot, setIsAddingRoot] = useState(false);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setIsAddindddgRoot();
    const fetchTree = async () => {
      try {
        const res = await getRoots();
        setTreeData(res.data);
        setLoading(false);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching tree:", error);
      }
    };
    fetchTree();
  }, []);

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity,setSeverity] = useState<"success" | "error">("success");

  const handleClose = () => {
    setOpen(false);
  };
  // Handle edit, add, and delete operations

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
      setMessage("Node deleted successfully");
      setOpen(true);

    } catch (error) {
      console.error("Error deleting node:", error);
      setMessage("Error deleting node");
      setOpen(true);
      setSeverity("error");
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
    setIsAddingRoot(false);
    setShowModal(true);
  };

  const handleAddRootClick = () => {
    console.log("Adding root node");
    setSelectedParentId(null);
    setIsAddingRoot(true);
    setShowModal(true);
  };

  const handleModalSubmit = async ({
    parentId,
    name,
  }: {
    parentId: string | null;
    name: string;
  }) => {
    try {
      // Make server request to create node
      const newNode = await createNode({ parentId, name });
      const id = newNode.data.id;
      console.log("New Node Created:", newNode.data, id);

      if (parentId) {
        // Adding child node
        updateNodeById(treeData, parentId, (n) => {
          n.children = n.children || [];
          n.children.push({ ...newNode.data, children: [] });
        });
        
        // Set the newly created node to be auto-expanded
        setAutoExpandNodeId(id);
      } else {
        // Adding root node
        setTreeData([...treeData, { ...newNode.data, children: [] }]);
      }

      setMessage("Node added successfully");
      setOpen(true);
    } catch (error) {
      setMessage("Error adding node");
      setOpen(true);
      setSeverity("error");
    } finally {
      setShowModal(false);
      setSelectedParentId(null);
      setIsAddingRoot(false);
    }
  };

  if (loading) return <LoadingFallback />;

  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <div style={{ padding: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2>Tree Structure</h2>
            <button 
              onClick={handleAddRootClick}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Add Root Node
            </button>
          </div>

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
          {showModal && (
            <AddNodeModal
              parentId={isAddingRoot ? null : selectedParentId}
              onClose={() => {
                setShowModal(false);
                setIsAddingRoot(false);
              }}
              onSubmit={handleModalSubmit}
            />
          )}
        </div>
      </Suspense>
      <CustomSnackbar
        open={open}
        onClose={handleClose}
        message={message}
        severity={severity}
      />
    </>
  );
};

export default TreePage;