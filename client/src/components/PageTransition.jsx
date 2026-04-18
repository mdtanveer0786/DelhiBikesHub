import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
      transition={{ 
        type: "spring", 
        stiffness: 280, 
        damping: 24,
        mass: 0.8
      }}
      className="w-full h-full origin-top"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
