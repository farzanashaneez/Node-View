// TreePage.tsx
import React, { useEffect, useState } from "react";
import { TreeNode } from "../components/TreeNode";
import type { TreeNodeData } from "../components/TreeNode";
import { createNode, getRoots } from "../api/treeAPI";
import { AddNodeModal } from "../components/AddNodeModal";


export const TreePage: React.FC = () => {
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
  const [treeData, setTreeData] = useState<TreeNodeData[]>([]);
  
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [autoExpandNodeId, setAutoExpandNodeId] = useState<string | null>(null);


  const handleEdit = (node: TreeNodeData) => {
    const newName = prompt("Edit node name:", node.name);
    if (newName) {
      updateNodeById(treeData, node.id, (n) => (n.name = newName));
      setTreeData([...treeData]);
    }
  };

  // const handleAdd = (parent: TreeNodeData) => {
  //   const name = prompt("Enter new node name:");
  //   if (name) {
  //     const newChild: TreeNodeData = { id: `${parent.id}.1`, name, children: [] };
  //     updateNodeById(treeData, parent.id, (n) => {
  //       n.children = n.children || [];
  //       n.children.push(newChild);
  //     });
  //     setTreeData([...treeData]);
  //   }
  // };

  const handleDelete = (node: TreeNodeData) => {
    const updated = deleteNodeById(treeData, node.id);
    setTreeData(updated);
  };

  // Helper: Update by ID
  const updateNodeById = (
    nodes: TreeNodeData[],
    id: string,
    updateFn: (node: TreeNodeData) => void
  ) => {
    for (const node of nodes) {
      if (node.id === id) {
        updateFn(node);
        return;
      }
      if (node.children) updateNodeById(node.children, id, updateFn);
    }
  };

  // Helper: Delete by ID
  const deleteNodeById = (
    nodes: TreeNodeData[],
    id: string
  ): TreeNodeData[] => {
    return nodes
      .filter((node) => node.id !== id)
      .map((node) => ({
        ...node,
        children: node.children ? deleteNodeById(node.children, id) : [],
      }));
  };

 
  const handleAddClick = (parentId: string) => {
    console.log(parentId, "parentId"+ "clicked");
    setSelectedParentId(parentId);
    setShowModal(true);
  };
  const handleModalSubmit = async ({ parentId, name }) => {
    try {
      // Make server request to create node
      const newNode = await createNode({ parentId, name });
      const id = newNode.data.id;

      console.log("New Node Created:", newNode.data,id);
  
      // Update the local tree
      updateNodeById(treeData, parentId, (n) => {
        n.children = n.children || [];
        n.children.push({ ...newNode.data, children: [] });
      });
      
      setTreeData([...treeData]);
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
          onAdd={(node)=>handleAddClick(node.id)}
          onDelete={handleDelete}
          autoExpandNodeId={autoExpandNodeId}
  clearAutoExpandNodeId={() => setAutoExpandNodeId(null)}
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
