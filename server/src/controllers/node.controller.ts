import { Request, Response } from "express";
import { NodeModel } from "../models/node.model";
import { v4 as uuidv4 } from "uuid";

// Create a node (can be root or child)
export const createNode = async (req: Request, res: Response) => {
  try {
    const { parentId, name } = req.body;
    const id = uuidv4();

    let path: string;
    if (parentId) {
      const parent = await NodeModel.findOne({ id: parentId });
      if (!parent) return res.status(404).json({ message: "Parent not found" });
      path = `${parent.path}/${id}`;
    } else {
      path = `/${id}`;
    }

    const newNode = new NodeModel({
      id,
      parentId: parentId || null,
      haveChild: parentId? true : false, 
      name,
      path,
    });
    await newNode.save();

    res.status(201).json(newNode);
  } catch (error) {
    res.status(500).json({ message: "Error creating node", error });
  }
};

// Edit node name
export const updateNode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updated = await NodeModel.findOneAndUpdate(
      { id },
      { name },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Node not found" });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating node", error });
  }
};

// Delete node and its children
export const deleteNode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const node = await NodeModel.findOne({ id });
    if (!node) return res.status(404).json({ message: "Node not found" });

    await NodeModel.deleteMany({ path: { $regex: `^${node.path}` } });

    await NodeModel.updateOne({parentId: node.parentId}, {haveChild: false});

    res.json({ message: "Node and its children deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting node", error });
  }
};

// Get all nodes as flat list (optional)
export const getAllNodes = async (_req: Request, res: Response) => {
  try {
    const nodes = await NodeModel.find();
    res.json(nodes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching nodes", error });
  }
};

// get all nodes in tree structure
export const getFullTree = async (_req: Request, res: Response) => {
  try {
    const roots = await NodeModel.aggregate([
      {
        $match: { parentId: null } // Root nodes only
      },
      {
        $graphLookup: {
          from: "nodes", // collection name (lowercase, plural by default)
          startWith: "$id",
          connectFromField: "id",
          connectToField: "parentId",
          as: "descendants"
        }
      }
    ]);

    res.json(roots);
  } catch (error) {
    res.status(500).json({ message: "Error using graphLookup", error });
  }
};

export const getChildrenByParentId = async (req: Request, res: Response) => {
  try {
    const { parentId } = req.params;

    if (!parentId) {
      return res.status(400).json({ message: 'Parent ID is required' });
    }

    const children = await NodeModel.find({ parentId }).lean();

    res.status(200).json({ parentId, children });
  } catch (error) {
    console.error('Error fetching child nodes:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


