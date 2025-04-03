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
    this.map.set(sessionId, { timestamp });
  }

  public static getUserSession(username) {
    if (this.map.has(username)) return username;
  }

  public static storeGameData(data, username) {
    const prevData = this.map.get(username);
    console.log(this.map);
    const newData = {
      score: (prevData.score || 0) + 1,
      sessionQuizHistory: [
        ...prevData.sessionQuizHistory,
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
        score: attemptsData?.score,
        attemptedQuestions: attemptsData?.attemptedQuestions,
        sessionQuizHistory: attemptsData?.sessionQuizHistory,
      });
      await quizAttempt.save();
    }
  }
}
