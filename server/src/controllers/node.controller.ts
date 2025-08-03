import { Request, Response } from "express";
import { NodeModel } from "../models/node.model";
import { v4 as uuidv4 } from "uuid";

// Create a node (can be root or child)
export const createNode = async (req: Request, res: Response) => {
  try {
    const { parentId, name } = req.body;
    const id = uuidv4();

    let path: string;
    let ancestors: string[] = [];

    if (parentId) {
      const parent = await NodeModel.findOne({ id: parentId });
      if (!parent) return res.status(404).json({ message: "Parent not found" });

      path = `${parent.path}/${id}`;
      ancestors = [...(parent.ancestors || []), parent.id];

      // Mark parent as having children
      await NodeModel.updateOne({ id: parentId }, { haveChild: true });
    } else {
      path = `/${id}`;
    }

    const newNode = new NodeModel({
      id,
      parentId: parentId || null,
      name,
      path,
      haveChild: false,
      ancestors,
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

    if (node.parentId) {
      const siblingCount = await NodeModel.countDocuments({ parentId: node.parentId });
      if (siblingCount === 0) {
        await NodeModel.updateOne({ id: node.parentId }, { haveChild: false });
      }
    }

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

// get all roots
export const getRoots = async (_req: Request, res: Response) => {
  try {
    const roots = await NodeModel.find({ parentId: null },{_id:0,id:1,name:1,path:1,parentId:1}).lean();
    const rootIds = roots.map(root => root.id);

    const children = await NodeModel.find(
      { parentId: { $in: rootIds } },
      {_id:0,id:1,name:1,path:1,parentId:1}
    ).lean();
    
    const rootsWithChildren = roots.map(root => ({
      ...root,
      children: children.filter(child => child.parentId === root.id),
    }));  
    res.json(rootsWithChildren);
  } catch (error) {
    res.status(500).json({ message: "Error fetching root nodes", error });
  }
};


export const getChildrenByParentId = async (req: Request, res: Response) => {
  try {
    const { parentId } = req.params;

    if (!parentId) {
      return res.status(400).json({ message: 'Parent ID is required' });
    }

    const children = await NodeModel.find(
      { parentId },
      { _id: 0, id: 1, name: 1, path: 1, parentId: 1 }
    ).lean();

    const childIds = children.map(child => child.id);

    const grandchildren = await NodeModel.find(
      { parentId: { $in: childIds } },
      { _id: 0, id: 1, name: 1, path: 1, parentId: 1 }
    ).lean();

    const childrenWithGrandchildren = children.map(child => ({
      ...child,
      children: grandchildren.filter(gc => gc.parentId === child.id),
    }));

    res.status(200).json(childrenWithGrandchildren);
  } catch (error) {
    console.error('Error fetching child nodes:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};



