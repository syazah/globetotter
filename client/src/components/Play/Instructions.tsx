function Instructions({
  setPlayGame,
}: {
  setPlayGame: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-xl md:max-w-3xl mx-auto max-h-[500px] overflow-y-scroll my-8 border border-gray-200">
      <div className="flex items-center justify-center mb-6">
        <span className="text-4xl mr-3">🧩</span>
        <h1 className="text-3xl font-bold text-primary">How To Play</h1>
      </div>

      <div className="space-y-6">
        {/* Game Introduction */}
        <div>
          <p className="text-lg text-gray-700 mb-4">
            Welcome to{" "}
            <span className="font-bold text-primary">Globetrotter</span>! Test
            your geography knowledge by guessing destinations from cryptic
            clues. Travel the world without leaving your seat!
          </p>
        </div>

        {/* Game Rules */}
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center">
            <span className="text-2xl mr-2">📜</span> Game Rules
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              You'll be presented with{" "}
              <span className="font-semibold">1-2 clues</span> about a mystery
              destination
            </li>
            <li>Choose from multiple possible answers</li>
            <li>Earn points for each correct answer</li>
            <li>Track your score as you play through different destinations</li>
            <li>Challenge friends to beat your high score</li>
          </ul>
        </div>

        {/* How Scoring Works */}
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center">
            <span className="text-2xl mr-2">🎯</span> Scoring
          </h2>
          <div className="bg-primary/10 p-4 rounded-lg">
            <p className="text-gray-700">
              <span className="font-bold">🎉 Correct Answer:</span> +1 point and
              unlock a fun fact about the destination!
            </p>
            <p className="text-gray-700 mt-2">
              <span className="font-bold">😢 Incorrect Answer:</span> No points,
              but you'll still learn something interesting!
            </p>
          </div>
        </div>

        {/* Challenge Friends */}
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center">
            <span className="text-2xl mr-2">👥</span> Challenge Friends
          </h2>
          <p className="text-gray-700 mb-2">
            Think you're a geography expert? Challenge your friends to beat your
            score!
          </p>
          <ol className="list-decimal pl-6 space-y-1 text-gray-700">
            <li>Enter your username</li>
            <li>Click "Challenge a Friend"</li>
            <li>Share your unique link with friends</li>
            <li>Compare scores and see who's the ultimate Globetrotter!</li>
          </ol>
        </div>

        {/* Tips */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h2 className="text-xl font-bold mb-2 flex items-center">
            <span className="text-2xl mr-2">💡</span> Pro Tips
          </h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>
              Pay attention to language and cultural references in the clues
            </li>
            <li>Geography knowledge helps, but thinking creatively is key</li>
            <li>
              The more you play, the better you'll get at spotting patterns
            </li>
          </ul>
        </div>

        {/* Call to Action */}
        <div className="text-center pt-4">
          <button
            onClick={() => setPlayGame(true)}
            className="bg-primary cursor-pointer hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold transition-colors"
          >
            Start Playing
          </button>
        </div>
      </div>
    </div>
  );
}

export default Instructions;
