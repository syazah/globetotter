import React, { useState, useEffect } from "react";
import axios from "../../utils/axios.config";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import confetti from "canvas-confetti";

interface Clue {
  randomClue: string[];
  clueId: string;
  options: string[];
}

interface AnswerResponse {
  success: boolean;
  correct: boolean;
  infos: {
    country: string;
    city: string;
    fun_fact: string[];
  };
  message: string;
}

const Game: React.FC = () => {
  const [clue, setClue] = useState<Clue | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerResult, setAnswerResult] = useState<AnswerResponse | null>(null);
  const [answering, setAnswering] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  // Fetch clues when component mounts
  useEffect(() => {
    fetchNewClue();
  }, []);

  // Function to fetch a new clue
  const fetchNewClue = async (forceDelete: boolean = false) => {
    setLoading(true);
    setError(null);
    setSelectedOption(null);
    setAnswerResult(null);
    setShowFeedback(false);

    try {
      const response = await axios.get(
        `/api/game/play${forceDelete ? "?forceDelete=true" : ""}`
      );
      if (response.data.success) {
        if (response.data.completedQuiz) {
          setClue(null);
          setError("You've completed all available clues!");
          return;
        }
        setClue(response.data.data);
      } else {
        setError("Failed to load clue");
      }
    } catch (err) {
      setError("Error connecting to the server. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle selecting an option
  const handleOptionSelect = (option: string) => {
    if (answerResult || answering) return; // Prevent selecting while processing
    setSelectedOption(option);
  };

  // Function to submit an answer
  const submitAnswer = async () => {
    if (!clue || !selectedOption || answering) return;

    setAnswering(true);

    try {
      const [city, country] = selectedOption.split(", ");

      const response = await axios.post("/api/game/play", {
        clueId: clue.clueId,
        city,
        country,
        score,
      });

      setAnswerResult(response.data);

      if (response.data.correct) {
        // Correct answer
        setScore((prev) => prev + 1);
        launchConfetti();
      } else {
        // Incorrect answer
        setIncorrectAnswers((prev) => prev + 1);
        showCryingEmojis();
      }

      setShowFeedback(true);
    } catch (err) {
      setError("Error submitting answer. Please try again.");
      console.error(err);
    } finally {
      setAnswering(false);
    }
  };

  // Function to launch confetti for correct answers
  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const showCryingEmojis = () => {
    const emojiCount = 20;
    const emojis = ["😢", "😭", "😿", "💧"];

    const existingEmojis = document.querySelectorAll(".crying-emoji");
    existingEmojis.forEach((emoji) => emoji.remove());

    for (let i = 0; i < emojiCount; i++) {
      // Create a new emoji element
      const emoji = document.createElement("div");
      emoji.className = "crying-emoji";
      emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];

      // Set random position and animation
      const leftPos = Math.random() * 80 + 10; // 10% to 90% horizontal
      emoji.style.cssText = `
        position: fixed;
        left: ${leftPos}%;
        top: -20px;
        font-size: ${Math.random() * 16 + 20}px;
        opacity: 1;
        z-index: 50;
        pointer-events: none;
        animation: fall-emoji 3s ease-in forwards;
      `;

      // Add to DOM
      document.body.appendChild(emoji);

      // Remove after animation completes
      setTimeout(() => {
        emoji.remove();
      }, 3000);
    }
  };

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      @keyframes fall-emoji {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        50% {
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(${
            Math.random() > 0.5 ? "720" : "-720"
          }deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(styleElement);

    // Clean up function
    return () => {
      document.head.removeChild(styleElement);
      const emojis = document.querySelectorAll(".crying-emoji");
      emojis.forEach((emoji) => emoji.remove());
    };
  }, []);

  // Handle next question
  const handleNextQuestion = () => {
    fetchNewClue();
  };

  if (loading) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-background"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg max-w-md mx-auto mt-4 text-center overflow-hidden">
        <h2 className="text-lg font-bold text-red-600 mb-2">Error</h2>
        <p className="text-red-700">{error}</p>
        <button
          onClick={() =>
            fetchNewClue(error.includes("completed all available"))
          }
          className="mt-3 px-4 py-1.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
        >
          {error.includes("completed all available")
            ? "Restart Game"
            : "Try Again"}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-lg mx-auto my-3 overflow-y-hidden">
      {/* Score Display */}
      <div className="flex justify-between mb-4">
        <div className="bg-primary/10 py-1.5 px-3 rounded-lg">
          <p className="text-primary font-bold text-sm sm:text-base">
            Score: {score}
          </p>
        </div>
        <div className="bg-red-50 py-1.5 px-3 rounded-lg">
          <p className="text-red-500 font-bold text-sm sm:text-base">
            Incorrect: {incorrectAnswers}
          </p>
        </div>
      </div>

      {/* Clue Display */}
      {!showFeedback && clue && (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2 flex items-center">
            <span className="text-2xl mr-2">🌎</span> Guess the Destination
          </h2>
          <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-primary">
            {clue.randomClue.map((hint, index) => (
              <p
                key={index}
                className="mb-1.5 text-gray-800 text-sm sm:text-base"
              >
                {index + 1}. {hint}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Options */}
      {!showFeedback && clue && (
        <div className="mb-4">
          <h3 className="text-md font-semibold mb-2">
            Select the correct destination:
          </h3>
          <div className="space-y-2">
            {clue.options.map((option, index) => {
              // Capitalize option for display
              const displayOption = option
                .split(", ")
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                .join(", ");

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full text-left py-2 px-3 rounded-lg border transition-colors text-sm sm:text-base cursor-pointer ${
                    selectedOption === option
                      ? "bg-primary text-white border-primary"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {displayOption}
                </button>
              );
            })}
          </div>

          <button
            onClick={submitAnswer}
            disabled={!selectedOption || answering}
            className={`mt-4 w-full py-2 rounded-lg font-medium text-sm sm:text-base transition-colors cursor-pointer ${
              selectedOption && !answering
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {answering ? "Submitting..." : "Submit Answer"}
          </button>
        </div>
      )}

      {/* Feedback Display */}
      {showFeedback && answerResult && (
        <div className="text-center">
          {answerResult.correct ? (
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <div className="flex justify-center mb-2">
                <FaCheckCircle className="text-green-500 text-3xl" />
              </div>
              <h3 className="text-lg font-bold text-green-700 mb-1">
                Correct!
              </h3>
              <p className="text-gray-700 text-sm">
                {answerResult.infos.city}, {answerResult.infos.country} is the
                right answer.
              </p>
            </div>
          ) : (
            <div className="bg-red-50 p-4 rounded-lg mb-4">
              <div className="flex justify-center mb-2">
                <FaTimesCircle className="text-red-500 text-3xl" />
              </div>
              <h3 className="text-lg font-bold text-red-700 mb-1">
                Incorrect!
              </h3>
              <p className="text-gray-700 text-sm">
                The correct answer is {answerResult.infos.city},{" "}
                {answerResult.infos.country}.
              </p>
            </div>
          )}

          {/* Fun Fact */}
          <div className="bg-yellow-50 p-4 rounded-lg mb-4 border border-yellow-200">
            <h3 className="text-md font-bold mb-1 flex items-center justify-center">
              <span className="text-lg mr-1.5">💡</span> Fun Fact
            </h3>
            <p className="text-gray-700 text-sm">
              {answerResult.infos.fun_fact && answerResult.infos.fun_fact[0]}
            </p>
          </div>

          <button
            onClick={handleNextQuestion}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
          >
            Next Destination
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
