// PostCard.js
"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiImage, FiChevronDown, FiChevronUp } from "react-icons/fi";
import CommentForm from "../comment/CommentForm";
import CommentList from "../comment/CommentList";
import InteractionButtons from "../like/InteractionButtons";
import { formatText } from "@/utility/textFormatter";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "@/redux/auth/authSlice";
import { deletePost } from "@/redux/posts/postsSlice";
import { useRouter } from "next/navigation";
import { PollSection, PostHeader, EditPostModal } from "./post_card";
import { patternStyles } from "@/constants";
import Image from "next/image";
import ImageModal from "@/components/common/Image/ImageModel";
import { Pointer } from "lucide-react";

const PostCard = ({ post }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  const dispatch = useDispatch();
  const router = useRouter();

  const { isLoggedIn, userDetails } = useSelector((state) => state.auth);

  // Animate card on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUserDetails());
    }
  }, [isLoggedIn, dispatch]);

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleDeletePost = () => {
    // Animate out before deleting
    setIsVisible(false);
    setTimeout(() => {
      dispatch(deletePost(post._id));
    }, 300);
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };
  const handleImageClick = (imgUrl) => {
    setModalImage(imgUrl);
    setModalOpen(true);
  };
  // Format content with hashtags
  const formatContentWithHashtags = (content) => {
    if (!content) return "";

    return content.replace(
      /#(\w+)/g,
      '<span class="text-indigo-600 font-medium cursor-pointer hover:underline" data-hashtag="$1">#$1</span>'
    );
  };

  // Handle hashtag click
  const handleHashtagClick = (e) => {
    if (e.target.hasAttribute("data-hashtag")) {
      const hashtag = e.target.getAttribute("data-hashtag");
      router.push(`/hashtags?hashtag=${hashtag}`);
    }
  };

  // Check if content has more than 10 lines
  const hasLongContent = () => {
    if (!post.content) return false;
    return post.content.split("\n").length > 10;
  };

  // Get truncated content (first 7 lines)
  const getTruncatedContent = () => {
    if (!post.content) return "";
    const lines = post.content.split("\n");
    return lines.slice(0, 7).join("\n");
  };

  // Card variants for animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate={isVisible ? "visible" : "exit"}
      exit="exit"
      variants={cardVariants}
      className={`${
        post.backgroundColor || "bg-white"
      } rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all`}
      style={
        post.backgroundColor?.includes("pattern-")
          ? patternStyles[
              post.backgroundColor
                .split(" ")
                .find((cls) => cls.startsWith("pattern-"))
            ]
          : {}
      }
    >
      <div className="p-5">
        <PostHeader
          post={post}
          userDetails={userDetails}
          isEditing={false}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeletePost}
        />

        {/* Post content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4 text-gray-800 leading-relaxed"
        >
          {hasLongContent() && !showFullContent ? (
            <>
              <div
                onClick={handleHashtagClick}
                className="prose prose-indigo max-w-none"
                dangerouslySetInnerHTML={{
                  __html: formatText(
                    formatContentWithHashtags(getTruncatedContent())
                  ),
                }}
              ></div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFullContent(true)}
                className="mt-2 flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                <span>Show more</span>
                <FiChevronDown className="w-4 h-4" />
              </motion.button>
            </>
          ) : hasLongContent() && showFullContent ? (
            <>
              <div
                onClick={handleHashtagClick}
                className="prose prose-indigo max-w-none"
                dangerouslySetInnerHTML={{
                  __html: formatText(formatContentWithHashtags(post.content)),
                }}
              ></div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFullContent(false)}
                className="mt-2 flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                <span>Show less</span>
                <FiChevronUp className="w-4 h-4" />
              </motion.button>
            </>
          ) : (
            <div
              onClick={handleHashtagClick}
              className="prose prose-indigo max-w-none"
              dangerouslySetInnerHTML={{
                __html: formatText(formatContentWithHashtags(post.content)),
              }}
            ></div>
          )}
        </motion.div>

        {Array.isArray(post.image) && post.image.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {post.image.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="relative rounded-lg overflow-hidden group"
              >
                <img
                  src={img}
                  alt={`Post Image ${index + 1}`}
                  className="w-full rounded-lg object-cover max-h-[24rem] transform transition-transform duration-500 group-hover:scale-105"
                 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute z-50 bottom-3 right-3 bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                  <FiImage className="w-4 h-4"   onClick={() => handleImageClick(img)}/>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {modalOpen && typeof window !== "undefined" && (
          <ImageModal
            imageUrl={modalImage}
            onClose={() => setModalOpen(false)}
          />
        )}

        {/* Poll display */}
        {post.poll && (
          <PollSection
            post={post}
            isLoggedIn={isLoggedIn}
            userDetails={userDetails}
          />
        )}

        {/* Interaction buttons */}
        <InteractionButtons
          post={post}
          userDetails={userDetails}
          showComments={showComments}
          onToggleComments={handleToggleComments}
        />
      </div>

      {/* Comments section with animation */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100 bg-gray-50 overflow-hidden"
          >
            <div className="p-5">
              <CommentForm postId={post._id} />
              <CommentList postId={post._id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Post Modal */}
      <EditPostModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        post={post}
      />
    </motion.div>
  );
};

export default PostCard;
