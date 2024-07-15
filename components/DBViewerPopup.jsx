import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import RealTimeDBViewer from "./RealTimeDBViewer";

export const DBViewerPopup = ({ isOpen, onClose, dbConfig }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed lg:top-0 left-0 lg:right-4 right-0 top-12 lg:w-3/4 w-full max-w-2xl  lg:h-3/4 bg-[#2D2D2D] rounded-lg shadow-lg overflow-hidden z-50 flex flex-col"
        >
          <div className="flex justify-between items-center p-4 bg-[#323232]">
            <h2 className="text-[#E0E0E0] text-lg">Database Viewer</h2>
            <Button onClick={onClose} variant="ghost" size="sm">
              &times;
            </Button>
          </div>
          <div className="flex-grow p-4 overflow-hidden">
            <div className="overflow-x-auto">
              <RealTimeDBViewer dbConfig={dbConfig} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
