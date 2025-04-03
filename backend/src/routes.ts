import { Router } from "express";
import gameRoutes from "@routes/game";
import adminRoutes from "@routes/admin";
import userRoutes from "@routes/user";
import { getUserAuth } from "@middlewares/userAuth";
const router = Router();

router.use("/admin", adminRoutes);

//                              GAME
router.use("/game", getUserAuth, gameRoutes);
//                              USER
router.use("/user", userRoutes);
//                              HEALTH CHECK
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is up and running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
