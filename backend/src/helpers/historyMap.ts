import UserDB from "@db/user";
import { QuizAttempts } from "@schemas/history";

export class HistoryMap {
  private static instance: HistoryMap;
  private static map: Map<string, any>;

  private constructor() {
    HistoryMap.map = new Map();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new HistoryMap();
    }
    return this.instance;
  }

  private static generateRandomId() {
    const id = Math.random().toString(36).slice(2, 8);
    return id;
  }

  //add user session
  //store user game data in the session
  public static addUserSession(username, timestamp) {
    const sessionId = username;
    this.map.set(sessionId, {
      timestamp,
      score: 0,
      sessionQuizHistory: [],
      attemptedQuestions: 0,
    });
  }

  public static getUserSession(username) {
    if (this.map.has(username)) return this.map.get(username);
    return null;
  }

  public static storeGameData(data, username) {
    if (!this.map.has(username)) {
      this.addUserSession(username, Date.now());
    }

    const prevData = this.map.get(username);
    const newData = {
      ...prevData,
      score: (prevData.score || 0) + 1,
      sessionQuizHistory: [
        ...(prevData.sessionQuizHistory || []),
        data.currentSessionQuiz,
      ],
      attemptedQuestions: (prevData.attemptedQuestions || 0) + 1,
    };
    this.map.set(username, newData);
  }

  public static async storeUserAttempts(username) {
    if (this.map.has(username)) {
      const userData = await UserDB.getUserByUsername(username);
      const attemptsData = this.map.get(username);
      console.log("storing history data");
      const quizAttempt = await QuizAttempts.create({
        user: userData._id,
        session: attemptsData.timestamp,
        score: attemptsData?.score || 0,
        attemptedQuestions: attemptsData?.attemptedQuestions || 0,
        sessionQuizHistory: attemptsData?.sessionQuizHistory || [],
      });
      await quizAttempt.save();
      return quizAttempt;
    }
    return null;
  }

  public static async getUserHistory(userId) {
    try {
      const userAttempts = await QuizAttempts.find({ user: userId }).sort({
        createdAt: -1,
      });
      return userAttempts;
    } catch (error) {
      console.error("Error fetching user history:", error);
      return [];
    }
  }
}
