import Image from 'next/image';
import React, { useEffect } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const PostFormImagePreview = ({ image, setImage }) => {
  if (!image || image.length === 0) return null;

  useEffect(() => {
    return () => {
      image.forEach(file => URL.revokeObjectURL(file.previewUrl));
    };
  }, [image]);

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {image.map((file, index) => {
        const imageUrl = file.previewUrl || URL.createObjectURL(file);
        file.previewUrl = imageUrl;

        return (
          <div
            key={file.name || index}
            className="relative rounded-lg overflow-hidden border border-gray-200"
          >
            <Image
              src={imageUrl}
              width={200}
              height={200}
              alt={`Preview ${index + 1}`}
              className="w-32 h-32 object-cover"
            />
            <button
              type="button"
              onClick={() => {
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
