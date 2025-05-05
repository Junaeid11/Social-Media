// components/common/Image/ImageModal.js
"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modal = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

const ImageModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
        variants={backdrop}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div
          variants={modal}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="relative"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={imageUrl}
            alt="Modal Preview"
            className="max-w-[40vw] max-h-[40vh] rounded-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white bg-black/50 p-2 rounded-full hover:bg-black"
          >
            ✕
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageModal;
