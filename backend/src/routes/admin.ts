import { handleAddInfo } from "@controllers/admin";
import { Router } from "express";

const router = Router();
router.route("/info").post(handleAddInfo);

export default router;
