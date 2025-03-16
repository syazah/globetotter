import UserDB from "@db/user";
import { User } from "@schemas/user";
import { StatusCodes } from "http-status-codes";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const handleCheckUsername = async (req: any, res: any) => {
  try {
    const username = req.params.username;
    const existingUser = await UserDB.getUserByUsername(username);
    if (existingUser) {
      return res.status(StatusCodes.OK).json({ success: true });
    }
    return res.status(StatusCodes.OK).json({ success: false });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const handleRegisterUser = async (req: any, res: any) => {
  try {
    const { username, password } = req.body;
    const existingUser = await UserDB.getUserByUsername(username);
    if (existingUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, error: "Username already exists" });
    }
    const hashedPassword = await bcryptjs.hash(password, 12);
    const newUser = {
      username,
      password: hashedPassword,
    };
    const user = await UserDB.createUser(newUser);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "24h",
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        score: user.maxScore,
      },
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error.message });
  }
};

export const handleLoginUser = async (req: any, res: any) => {
  try {
    const { username, password } = req.body;
    const user = await UserDB.getUserByUsername(username);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, error: "User not found" });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "24h",
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        score: user.maxScore,
      },
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error.message });
  }
};

export const handleValidateUser = async (req: any, res: any) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, error: "Unauthorized" });
    }
    const { id } = jwt.verify(token, process.env.JWT_SECRET as string);

    if (!id) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, error: "Unauthorized" });
    }

    const user = await UserDB.getUserById(id);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, error: "User not found" });
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        score: user.maxScore,
      },
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error.message });
  }
};
