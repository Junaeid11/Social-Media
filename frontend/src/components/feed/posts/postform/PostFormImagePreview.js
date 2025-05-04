import React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const PostFormImagePreview = ({ previewImage, image, setPreviewImage, setImage }) => {
  if (!image || image.length === 0) return null;  // Return null if no images are selected

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {image.map((file, index) => {
        const imageUrl = previewImage ? previewImage : URL.createObjectURL(file);

        return (
          <div key={index} className="relative rounded-lg overflow-hidden border border-gray-200">
            <img
              src={imageUrl}
              alt={`Preview ${index + 1}`}
              className="w-32 h-32 object-cover"
            />
            <button
              type="button"
              onClick={() => {
                // Remove the image from the preview list
                const updatedImages = image.filter((_, i) => i !== index);
                setImage(updatedImages);
              }}
              className="absolute top-2 right-2 bg-gray-800 bg-opacity-60 text-white rounded-full p-1 hover:bg-opacity-80 transition duration-200"
            >
              <AiOutlineCloseCircle className="w-5 h-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default PostFormImagePreview;
