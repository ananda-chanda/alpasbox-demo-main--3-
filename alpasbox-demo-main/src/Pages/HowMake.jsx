import React from "react";
import Process from "../assets/how_make/video_process.png";

const HowMake = () => {
  return (
    <div className="bg-white flex flex-col items-center justify-center h-auto py-2">
      <div className="text-center mb-2">
        <h1 className="bg-[#4A00FF] text-white text-lg md:text-2xl font-bold py-2 px-6 rounded">
          Process to Make an Invitation
        </h1>
      </div>
      <div className="flex items-center justify-center">
        <img
          src={Process}
          alt="How to Make Process"
          className="w-full max-w-6xl h-auto object-contain" // Increased max-width for larger image
        />
      </div>
    </div>
  );
};

export default HowMake;
