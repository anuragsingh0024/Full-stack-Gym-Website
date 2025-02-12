import React, { useState } from "react";
import gallery1 from "../../assets/gallery1.jpg";
import gallery2 from "../../assets/gallery2.jpg";
import gallery3 from "../../assets/gallery3.jpg";
import gallery4 from "../../assets/gallery4.jpg";
import gallery5 from "../../assets/gallery5.jpg";
import gallery6 from "../../assets/gallery6.jpg";
import Footer from "../components/common/Footer";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Random gym-related image URLs

  const images = [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6];

  return (
    <div className="w-11/12 mx-auto py-10 my-10">
      <h1 className="text-4xl font-bold text-textColor text-center mb-10">
        Our Mini <span className="text-caribbeangreen-400">World</span>
      </h1>
      {/* Grid of Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            {/* Image */}
            <img
              src={image}
              alt={`Gallery Image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white font-bold text-lg">View Full Image</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50"
          onClick={() => setSelectedImage(null)} // Close modal on click
        >
          <div className="relative w-full flex justify-center">
            <button
              className="absolute top-2 right-2 text-white text-2xl bg-red-600 hover:bg-red-700 rounded-full w-10 h-10 flex items-center justify-center"
              onClick={() => setSelectedImage(null)} // Close button
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt="Full view"
              className=" w-[40%] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
