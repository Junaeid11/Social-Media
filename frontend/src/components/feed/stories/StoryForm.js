"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { createStory } from "@/redux/story/storySlice";
import Link from "next/link";
import {
  FiX,
  FiSave,
  FiImage,
  FiFeather,
  FiCheck,
  FiAlertCircle,
  FiArrowLeft,
  FiLink,
} from "react-icons/fi";
import Image from "next/image";
import {
  AiOutlineCamera,
  AiOutlineCloseCircle,
  AiOutlineUpload,
} from "react-icons/ai";

const StoryForm = ({ isOpen, onClose, storyToast }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [showImageInput, setShowImageInput] = useState(true);
  const [charCount, setCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessIndicator, setShowSuccessIndicator] = useState(false);
  const [image, setImage] = useState([]); // was "" -> now an array
  const [previewImage, setPreviewImage] = useState(""); // new
  const [imageFiles, setImageFiles] = useState({ image: null }); // new

  const { isLoading, error } = useSelector((state) => state.story);
  const { userDetails } = useSelector((state) => state.auth);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setContent("");
      setImage("");
      setShowImageInput(true);
      setCharCount(0);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const postData = {
      content,
      image: previewImage || "", // fallback if no preview
    };
    const formData = new FormData();
    formData.append("data", JSON.stringify(postData));

    if (imageFiles.image) {
      formData.append("image", imageFiles.image);
    }
    console.log(formData);
    const resultAction = await dispatch(createStory(formData));

    if (createStory.fulfilled.match(resultAction)) {
      setShowSuccessIndicator(true);
      setTimeout(() => {
        setShowSuccessIndicator(false);
        onClose();
      }, 1200);
      storyToast("success");
    } else {
      storyToast("error");
      setIsSubmitting(false);
    }
  }

  const handleContentChange = (e) => {
    const text = e.target.value;
    if (text.length <= 100) {
      setContent(text);
      setCharCount(text.length);
    }
  };

  const handleClearImage = () => {
    setImage("");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl p-7 w-full max-w-[42rem] shadow-2xl mx-4 border border-gray-100"
        >
          <div className="flex justify-between items-center mb-7">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Image
                  width={200}
                  height={200}
                  className="w-16 h-16 object-cover rounded-full shadow-lg ring-3 ring-indigo-100"
                  src={userDetails?.profilePicture || "/default-avatar.png"}
                  alt={userDetails?.fullName}
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="absolute bottom-0 right-0 w-5 h-5 bg-green-400 rounded-full border-2 border-white"
                ></motion.div>
              </motion.div>
              <div>
                <motion.h3
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="font-bold text-2xl text-gray-900"
                >
                  Create Story
                </motion.h3>
                <motion.p
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-gray-500"
                >
                  Share a moment with your friends
                </motion.p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors bg-white/80 p-2 rounded-full shadow-sm"
            >
              <FiX className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FiFeather className="text-indigo-500" />
                  Your Story
                </label>
                <span
                  className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                    charCount > 90
                      ? "bg-red-100 text-red-600"
                      : charCount > 70
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {charCount}/100
                </span>
              </div>
              <motion.div
                whileHover={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                className="relative"
              >
                <motion.textarea
                  initial={{ height: "150px" }}
                  animate={{ height: content.length > 80 ? "180px" : "150px" }}
                  value={content}
                  onChange={handleContentChange}
                  rows={3}
                  className="w-full p-5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-gray-700 shadow-sm"
                  placeholder="Write your story here..."
                />
                {charCount >= 100 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-3 bottom-3 text-red-500 flex items-center gap-1 text-sm bg-white/90 px-2 py-1 rounded-lg"
                  >
                    <FiAlertCircle />
                    <span>Character limit reached</span>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FiImage className="text-indigo-500" />
                  Story Image
                </label>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowImageInput(!showImageInput)}
                  className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-indigo-50 transition-all"
                >
                  {showImageInput ? <FiX size={14} /> : <FiImage size={14} />}
                  <span>{showImageInput ? "Remove Image" : "Add Image"}</span>
                </motion.button>
              </div>

              <AnimatePresence>
                {showImageInput && (
                  <div
                    className="mt-4 p-4 bg-white rounded-lg shadow-md border border-gray-200 transition-all duration-300"
                    style={{
                      animation: "slideIn 0.3s ease-out forwards",
                    }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold text-gray-800 flex items-center gap-2">
                        <AiOutlineCamera className="text-indigo-500 w-5 h-5" />
                        Add a photo
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowImageInput(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100"
                        aria-label="Close image input"
                      >
                        <AiOutlineCloseCircle className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-indigo-400 rounded-lg p-6 bg-gray-50 transition-colors duration-200">
                      <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="imageUploadInput"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setImage([file]); // wrap in array for reuse below
                              setImageFiles({ image: file });
                              setPreviewImage(URL.createObjectURL(file));
                            }
                          }}
                        />

                        <label
                          htmlFor="imageUploadInput"
                          className="cursor-pointer w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-3"
                        >
                          <AiOutlineUpload className="w-7 h-7 text-indigo-500" />
                        </label>
                      </div>
                    </div>

                    <style jsx>{`
                      @keyframes slideIn {
                        from {
                          opacity: 0;
                          transform: translateY(-10px);
                        }
                        to {
                          opacity: 1;
                          transform: translateY(0);
                        }
                      }
                    `}</style>
                  </div>
                )}
                {previewImage && (
                  <div className="mt-3 relative rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      width={200}
                      height={200}
                      src={previewImage}
                      alt="Selected"
                      className="w-32 h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage([]);
                        setImageFiles({ image: null });
                        setPreviewImage("");
                      }}
                      className="absolute top-2 right-2 bg-gray-800 bg-opacity-60 text-white rounded-full p-1 hover:bg-opacity-80 transition duration-200"
                    >
                      <AiOutlineCloseCircle className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm"
            >
              <FiAlertCircle />
              <span>{error}</span>
            </motion.div>
          )}

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end gap-3 mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: "#f3f4f6" }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium transition-colors flex items-center gap-2 shadow-sm"
            >
              <FiX className="w-4 h-4" />
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: "#4338ca" }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={isSubmitting || content.trim() === ""}
              className={`px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-md relative overflow-hidden ${
                isSubmitting || content.trim() === "" ? "opacity-70" : ""
              }`}
            >
              {showSuccessIndicator ? (
                <>
                  <FiCheck className="w-4 h-4" />
                  Posted!
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  {isSubmitting ? "Posting..." : "Post Story"}
                </>
              )}
              {isSubmitting && (
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1 }}
                  className="absolute bottom-0 left-0 h-1 bg-white/30"
                />
              )}
            </motion.button>
          </motion.div>

          {/* Back Home Link */}
          <Link href="/">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute top-4 left-4 md:right-4 md:left-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-full shadow-sm hover:shadow transition duration-200 flex items-center text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiArrowLeft className="mr-1.5" />
              Back Home
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StoryForm;
