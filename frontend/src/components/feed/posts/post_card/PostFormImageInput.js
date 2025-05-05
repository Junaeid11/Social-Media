import React from "react";
import {
  AiOutlineCloseCircle,
  AiOutlineLink,
  AiOutlineUpload,
  AiOutlineCamera,
} from "react-icons/ai";

const PostFormImageInput = ({
  showImageInput,
  setShowImageInput,
  image,
  setImage,
}) => {
  if (!showImageInput) return null;

  return (
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
            multiple
            accept="image/*"
            className="hidden"
            id="imageUploadInput"
            onChange={(e) => {
              const selectedFiles = Array.from(e.target.files);
              
              setImage(selectedFiles); 
              if (selectedFiles.length > 0) {
                const firstImageURL = URL.createObjectURL(selectedFiles[0]);
                setPreviewImage(firstImageURL);
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
  );
};

export default PostFormImageInput;
