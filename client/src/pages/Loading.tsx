import { motion } from "framer-motion";

function Loading() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-background">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-16 h-16 border-4 border-secondary border-t-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <p className="mt-4 text-lg font-medium text-dark">Loading...</p>
      </motion.div>
    </div>
  );
}

export default Loading;
