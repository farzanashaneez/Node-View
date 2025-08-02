import { Router } from "express";
import {
  createNode,
  updateNode,
  deleteNode,
  getAllNodes,
getFullTree,
  getChildrenByParentId
} from "../controllers/node.controller";

const router = Router();

router.get("/", getFullTree); 
router.post("/", createNode);
router.put("/:id", updateNode);
router.delete("/:id", deleteNode);
router.get("/flat-nodes", getAllNodes); 
router.get("/children/:parentId", getChildrenByParentId);

export default router;
