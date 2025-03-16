import { useState } from "react";
import Instructions from "../components/Play/Instructions";
import Topbar from "../components/Play/Topbar";
import Game from "../components/Play/Game";

function Play() {
  const [playGame, setPlayGame] = useState(false);
  return (
    <div className="w-full h-screen bg-primary flex flex-col justify-start items-start overflow-hidden">
      <Topbar />
      {playGame ? <Game /> : <Instructions setPlayGame={setPlayGame} />}
    </div>
  );
}

export default Play;
