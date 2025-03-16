import jwt from "jsonwebtoken";
import UserDB from "@db/user";
import { StatusCodes } from "http-status-codes";

export const getUserAuth = async (req: any, res: any, next: any) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "No token provided" });
    }
    const { id } = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!id) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "Unauthorized" });
    }
    const user = await UserDB.getUserById(id);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "User Auth Not Found" });
  }
};
