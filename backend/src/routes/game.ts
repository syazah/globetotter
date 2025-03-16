import { handleGetAnswer, handleGetClue, handleGetCountries } from "@controllers/game";
import { Router } from "express";

const router = Router();

router.route("/countries").get(handleGetCountries);
router.route("/play").get(handleGetClue).post(handleGetAnswer);

export default router;
