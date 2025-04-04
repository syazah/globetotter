import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Loading from "./pages/Loading";
import { useAuthContext } from "./context/AuthContext";
import NotFound from "./pages/NotFound";

const Home = lazy(() => import("./pages/Home"));
const Auth = lazy(() => import("./pages/Auth"));
const Play = lazy(() => import("./pages/Play"));
const Welcome = lazy(() => import("./pages/Welcome"));

function App() {
  const { user } = useAuthContext();

  return (
    <Suspense
      fallback={
        <div>
          <Loading />
        </div>
      }
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Auth />} />

          <Route path="/play" element={user ? <Play /> : <NotFound />} />
          <Route path="/welcome/:token" element={<Welcome />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
