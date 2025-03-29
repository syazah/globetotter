import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <img
            src="/logo.png"
            alt="Globetotter Logo"
            className="w-24 h-24 mx-auto brightness-0 invert"
          />
          <h1 className="text-6xl font-bold text-white">404</h1>
          <h2 className="text-2xl font-semibold text-white">Page Not Found</h2>
          <p className="text-gray-300">
            Oops! Looks like you've wandered into uncharted territory.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/signin"
            className="block w-full rounded-lg bg-primary p-3 text-white font-medium hover:bg-primary/90 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/"
            className="block w-full rounded-lg border border-white p-3 text-white font-medium hover:bg-white/10 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
