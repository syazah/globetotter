/*
History
user -> referencing
quiz attempts,
Data and time timestamp
scores,
performance metrics
*/

/*
in user schema we can reference to the quiz schema
*/

import mongoose, { Schema } from "mongoose";

const QuizAttemptsSchema = new mongoose.Schema(
  {
    session: {
      type: String, // can store start time and end time for each session here
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    score: {
      type: Number,
      default: 0,
    },
    attemptedQuestions: {
      type: Number,
      default: 0,
    },
    sessionQuizHistory: {
      type: [Object],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const QuizAttempts = mongoose.model("QuizAttempt", QuizAttemptsSchema);
