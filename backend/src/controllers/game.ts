import jwt from "jsonwebtoken";
import GameDB from "@db/game";
import { NotFound } from "@errors/allErrors";
import { StatusCodes } from "http-status-codes";
import GameHashmap from "@helpers/gameMap";
import UserDB from "@db/user";
const gameMap = GameHashmap.getInstance();
export const handleGetCountries = async (req: any, res: any) => {
  try {
    const countries = await GameDB.getCountries();
    if (!countries) {
      throw new NotFound("Countries not found");
    }
    return res.status(StatusCodes.OK).json({ success: true, data: countries });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error.message });
  }
};

export const handleGetCities = async (req: any, res: any) => {
  try {
    const { country } = req.params;
    const cities = await GameDB.getCities(country);
    if (!cities) {
      throw new NotFound("Cities not found");
    }
    return res.status(StatusCodes.OK).json({ success: true, data: cities });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error.message });
  }
};

export const handleGetClue = async (req: any, res: any) => {
  try {
    const user = req.user;
    const forceDelete = req.query.forceDelete;
    if (forceDelete) {
      await gameMap.deletePlayed(user._id);
    }
    const userID = user._id;

    const infos = await GameDB.getInfo();

    if (!infos) {
      throw new NotFound("Clues not found");
    }
    const completedClues = (await gameMap.getPlayed(userID)) || [];
    const filteredInfos = infos.filter(
      (info) => !completedClues.includes(info._id.toString())
    );
    if (filteredInfos.length === 0 && completedClues.length > 0) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "No more clues",
        data: [],
        completedQuiz: true,
      });
    } else if (filteredInfos.length === 0) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "No clues found",
        data: [],
        completedQuiz: false,
      });
    }

    const clues = gameMap.getRandomClue(filteredInfos);
    return res.status(StatusCodes.OK).json({ success: true, data: clues });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error.message });
  }
};

export const handleGetAnswer = async (req: any, res: any) => {
  try {
    const answer = req.body;

    const infos = await GameDB.getInfoById(answer.clueId);

    const user = req.user;

    if (!infos) {
      throw new NotFound("Clue not found");
    }
    await UserDB.updateUserScore(user._id, answer.score);
    await gameMap.setPlayed(user._id, answer.clueId);
    if (infos.city === answer.city) {
      return res.status(StatusCodes.OK).json({
        success: true,
        correct: true,
        infos,
        message: "Correct Answer",
      });
    } else if (infos.city !== answer.city) {
      return res
        .status(StatusCodes.OK)
        .json({ success: true, correct: false, infos, message: "Wrong City" });
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error.message });
  }
};
