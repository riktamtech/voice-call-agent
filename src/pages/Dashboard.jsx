import { motion } from "framer-motion";
import { FaRegSmile } from "react-icons/fa";

export default function Dashboard() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100 shadow-md p-6 rounded-2xl mb-6">
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col gap-2 text-center md:text-left"
      >
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FaRegSmile className="text-blue-500" />
          Zcruit.ai
        </h1>
        <p className="text-gray-600 text-sm md:text-base max-w-md">
          Your AI-powered recruiter dashboard — manage candidates, schedule calls, 
          and track interviews effortlessly.
        </p>
      </motion.div>

      {/* Right Section: Animated Bird */}
      <motion.img
        src="/logo.png"
        alt="Flying Bird"
        className="h-24 w-24 object-contain mt-4 md:mt-0"
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 12,
          delay: 0.3,
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      />
    </div>
  );
}
