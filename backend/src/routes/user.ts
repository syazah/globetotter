import {
  handleCheckUsername,
  handleLoginUser,
  handleRegisterUser,
  handleValidateUser,
} from "@controllers/user";
import { Router } from "express";

const router = Router();

router.route("/username/:username").get(handleCheckUsername);
router.route("/signin").post(handleLoginUser);
router.route("/signup").post(handleRegisterUser);
router.route("/validate").get(handleValidateUser);

export default router;
