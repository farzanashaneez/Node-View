import { Schema, model } from "mongoose";
import { NodeDto } from "./node.model";
export interface Tree {
  root: string;
  name: string;
}

export interface TreeDto extends Omit<Tree, "root"> {
  root: NodeDto;
}

const treeSchema = new Schema<Tree>({
  root: { type: String, required: true, unique: true, ref: "Node" },
  name: { type: String, required: true },
});

export const TreeModel = model<Tree>("Tree", treeSchema);
