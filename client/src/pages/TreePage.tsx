import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

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

  const [confirmOpen, setConfirmOpen] = useState(false);
const [nodeToDelete, setNodeToDelete] = useState<TreeNodeData | null>(null);


  const [loading, setLoading] = useState(true);
  useEffect(() => {
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
  const [severity, setSeverity] = useState<"success" | "error">("success");

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

  
  const handleDelete = (node: TreeNodeData) => {
    setNodeToDelete(node);
    setConfirmOpen(true);
  };
  const confirmDeleteNode = async () => {
    if (!nodeToDelete) return;
  
    try {
      await deleteNode(nodeToDelete.id);
      console.log("Node deleted successfully");
  
      const updated = deleteNodeById(treeData, nodeToDelete.id);
      setTreeData(updated);
      setMessage("Node deleted successfully");
      setSeverity("success");
    } catch (error) {
      console.error("Error deleting node:", error);
      setMessage("Error deleting node");
      setSeverity("error");
    } finally {
      setOpen(true);
      setConfirmOpen(false);
      setNodeToDelete(null);
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
        <div className="min-w-32 max-w-screen-md px-4 py-4" style={{ padding: "1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
           
            <button
              onClick={handleAddRootClick}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded shadow transition duration-200"
            >
              <span className="text-lg font-bold">+</span> Add Root Node
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
     <Dialog
  open={confirmOpen}
  onClose={() => setConfirmOpen(false)}
  aria-labelledby="confirm-delete-dialog-title"
  aria-describedby="confirm-delete-dialog-description"
  fullWidth
  maxWidth="xs"
>
  <DialogTitle id="confirm-delete-dialog-title" sx={{ fontWeight: 'bold',textAlign:'center' }}>
    Confirm Deletion
  </DialogTitle>

  <DialogContent dividers>
    <Typography id="confirm-delete-dialog-description" sx={{ fontSize: '1rem', color: 'text.secondary' }}>
      Are you sure you want to delete <strong>{nodeToDelete?.name}</strong> and all its child nodes? This action cannot be undone.
    </Typography>
  </DialogContent>

  <DialogActions sx={{ px: 3, p: 2 }}>
    <Button
      onClick={() => setConfirmOpen(false)}
      variant="text"
      color="primary"
    >
      Cancel
    </Button>
    <Button
      onClick={confirmDeleteNode}
      variant="text"
      color="error"
    >
      Delete
    </Button>
  </DialogActions>
</Dialog>


    </>
  );
};

export default TreePage;
