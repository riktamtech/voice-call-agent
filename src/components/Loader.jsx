import { motion, AnimatePresence } from "framer-motion";

const Loader = ({ loading }) => {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -100,
            transition: { duration: 0.8, ease: "easeInOut" },
          }}
        >
          {/* Loader Image */}
          <motion.img
            src="/logo.png"
            alt="Loading..."
            className="w-100 h-16 drop-shadow-lg"
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: [0, -10, 0], opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
