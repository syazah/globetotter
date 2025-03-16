import { useAuthContext } from "../../context/AuthContext";
import { BsShare } from "react-icons/bs";
import { FiRefreshCw } from "react-icons/fi"; // Add this import
import { useState } from "react";
import InviteModal from "./InviteModal"; // Import the modal

function Topbar({ currentScore = 0, currentClue = "" }) {
  const { user, logout, validateAndLoadUser } = useAuthContext();
  const [showLogout, setShowLogout] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleProfileClick = () => {
    setShowLogout(!showLogout);
  };

  const handleLogout = () => {
    logout();
    setShowLogout(false);
  };

  const handleShareClick = () => {
    setShowInviteModal(true);
  };

  const handleCloseModal = () => {
    setShowInviteModal(false);
  };

  const handleRefreshScore = async () => {
    setIsRefreshing(true);
    await validateAndLoadUser();
    setIsRefreshing(false);
  };

  return (
    <>
      <div className="w-full p-2 flex justify-between items-start">
        <div className="flex items-center justify-start">
          <img
            src="/logo.png"
            alt="logo"
            className="w-6 h-6 md:w-8 md:h-8 brightness-0 invert object-contain"
          />
          <h1 className="text-xl md:text-2xl text-background font-semibold ml-2">
            Globetotter
          </h1>
        </div>
        <div className="flex justify-start items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white">Score: {user?.score || 0}</span>
            <FiRefreshCw
              className={`text-base md:text-xl text-white cursor-pointer hover:text-gray-200 transition-all ${
                isRefreshing ? "animate-spin" : ""
              }`}
              onClick={handleRefreshScore}
            />
          </div>
          <BsShare
            className="text-xl md:text-2xl text-white cursor-pointer hover:text-gray-200 transition-colors"
            onClick={handleShareClick} // Add click handler
          />
          <div className="relative">
            <div
              className="w-8 h-8 cursor-pointer rounded-full bg-background flex justify-center items-center text-2xl"
              onClick={handleProfileClick}
            >
              {user?.username.split("")[0].toUpperCase()}
            </div>
            {showLogout && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10">
                <button
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-md"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <InviteModal
        isOpen={showInviteModal}
        onClose={handleCloseModal}
        score={currentScore}
        currentClue={currentClue}
      />
    </>
  );
}

export default Topbar;
