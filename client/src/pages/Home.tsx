import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="w-full h-screen bg-background overflow-hidden p-4">
      <div className="w-full h-full relative">
        <video
          autoPlay
          muted
          loop
          className="w-full object-cover h-full rounded-xl"
          src="/home.mp4"
        />
        <div className="w-full fixed top-0 left-0 h-full flex flex-col p-4 backdrop-brightness-75 justify-between items-start">
          <div className="w-full flex justify-start items-center p-4">
            <img
              src="/logo.png"
              alt="logo"
              className="w-8 h-8 brightness-0 invert  object-contain"
            />
            <h1 className="text-2xl text-background font-semibold ml-2">
              Globetotter
            </h1>
          </div>
          <div className="md:w-2/3 px-6 py-10 flex flex-col justify-start items-start gap-10">
            <h1 className="text-background text-2xl md:text-5xl w-full md:w-4/5 font-semibold">
              Visit the world from your home, with Globetotter
            </h1>
            <Link
              to="/signin"
              className="w-1/2 rounded-lg bg-background p-2 text-dark shadow-2xl border-[1px] border-dark flex justify-center items-center hover:bg-zinc-200 cursor-pointer gap-2"
            >
              <h1 className="text-lg"> Get started</h1>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
