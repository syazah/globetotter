import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Loading from "./pages/Loading";
import AuthContextProvider from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

const Home = lazy(() => import("./pages/Home"));
const Auth = lazy(() => import("./pages/Auth"));
const Play = lazy(() => import("./pages/Play"));
const Welcome = lazy(() => import("./pages/Welcome"));

function App() {
  return (
    <Suspense
      fallback={
        <div>
          <Loading />
        </div>
      }
    >
      <ToastProvider>
        <AuthContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<Auth />} />
              <Route path="/play" element={<Play />} />
              <Route path="/welcome/:token" element={<Welcome />} />
            </Routes>
          </BrowserRouter>
        </AuthContextProvider>
      </ToastProvider>
    </Suspense>
  );
}

export default App;
