import { User } from "@schemas/user";

export default class UserDB {
  public static async getUserByUsername(username: string) {
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return existingUser;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  public static async createUser(newUser: {
    username: string;
    password: string;
  }) {
    try {
      const user = new User(newUser);
      await user.save();
      return user;
    } catch (error) {
      return null;
    }
  }

  public static async getUserById(id: string) {
    try {
      const user = await User.findById(id);
      return user;
    } catch (error) {
      return null;
    }
  }

  public static async updateUserScore(id: string, score: number) {
    try {
      const user = await User.findById(id);
      if (!user) {
        return null;
      }
      const maxScore = Math.max(user.maxScore, score + 1);
      user.maxScore = maxScore;
      await user.save();
      return user;
    } catch (error) {
      return null;
    }
  }
}
