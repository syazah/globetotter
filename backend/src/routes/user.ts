import {
  handleCheckUsername,
  handleLoginUser,
  handleRegisterUser,
  handleValidateUser,
  handleGetUserHistory,
} from "@controllers/user";
import { Router } from "express";
import { getUserAuth } from "@middlewares/userAuth";

const router = Router();

router.route("/username/:username").get(handleCheckUsername);
router.route("/signin").post(handleLoginUser);
router.route("/signup").post(handleRegisterUser);
router.route("/validate").get(handleValidateUser);
router.route("/history").get(getUserAuth, handleGetUserHistory);

export default router;
