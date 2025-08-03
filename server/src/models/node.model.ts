import mongoose, { Schema, model } from "mongoose";

export interface Node {
  id: string;
  parentId: string | null;
  path: string;
  ancestors: string[]; 
  name: string;
  haveChild: boolean;
}
export interface NodeDto extends Node {
  children: NodeDto[];
}
const nodeSchema = new Schema<Node>({
  id: { type: String, required: true, unique: true },
  parentId: { type: String, default: null, ref: "Node" },
  path: { type: String, required: true },
  ancestors: [{ type: String,ref: "Node" , index: true }], 
  name: { type: String, required: true },
  haveChild: { type: Boolean, default: false },
});

export const NodeModel = model<Node>("Node", nodeSchema);
