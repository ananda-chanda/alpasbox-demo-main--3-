import React, { useEffect, useState } from "react";
import axios from "axios";
import hdvideo from "../assets/Vendor/videoicon.png";
import vendortik from '../assets/blog/vendor-tik.png';

const Videocoin = () => {
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("vendor_token");
        const config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://admin.urbantyohar.com/api/video-coin",
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
          },
        };
        const response = await axios.request(config);
        setVideoData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!videoData) return <p>No data available</p>;

  return (
    <div className="font-sans bg-white p-5">
      <div className="container max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{videoData.plan_name || 'Pro Startup Plan'}</h1>
        
        <Section
          quantity={videoData.basic_qnty || 0}
          delivered={videoData.basic_video || 0}
          type="basic"
          isNotValid={false}
        />

        <Section
          quantity={videoData.caricature_qnty || 0}
          delivered={videoData.caricature_video || 0}
          type="caricature"
          isNotValid={videoData.caricature_qnty === 0}
        />

        <Section
          quantity={videoData.customize_qnty || 0}
          delivered={videoData.customize_video || 0}
          type="customize"
          isNotValid={videoData.customize_qnty === 0}
        />
      </div>
    </div>
  );
};

const Section = ({ quantity = 0, delivered = 0, type, isNotValid }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 7;
  
  const displayQuantity = isNotValid ? 5 : quantity;
  const remainingVideos = Math.max(0, quantity - delivered);

  const allVideos = Array(displayQuantity).fill(null).map((_, index) => {
    if (isNotValid) return "Not Valid";
    return index < delivered ? "Deliver" : "Available";
  });

  const totalPages = Math.ceil(displayQuantity / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const endIndex = startIndex + videosPerPage;
  const visibleVideos = allVideos.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-6 border-b-2 border-yellow-400">
      <div className="flex items-center">
        <div className="flex items-center space-x-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 text-purple-400 ${
              currentPage > 1 ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            onClick={() => currentPage > 1 && setCurrentPage(p => p - 1)}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>

          <div className="flex space-x-8">
            {visibleVideos.map((status, index) => (
              <CarouselItem
                key={startIndex + index}
                status={status}
              />
            ))}
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 text-purple-400 ${
              currentPage < totalPages ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            onClick={() => currentPage < totalPages && setCurrentPage(p => p + 1)}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-4 md:mt-0 md:text-right">
        {isNotValid ? (
          `${type} invitation video not valid in this plan`
        ) : (
          `${remainingVideos} ${type} invitation video remaining`
        )}
      </p>
    </div>
  );
};

const CarouselItem = ({ status }) => {
  const statusColors = {
    Deliver: "bg-orange-500",
    Available: "bg-green-500",
    "Not Valid": "bg-gray-500",
  };

  return (
    <div className="text-center">
      <img
        src={hdvideo}
        alt="Video icon"
        className={`w-19 h-24 object-cover rounded-lg ${
          status === "Deliver" || status === "Not Valid" ? "opacity-50 grayscale" : ""
        }`}
      />
      <p className={`text-white text-[10px] px-0 py-1 rounded mt-2 ${statusColors[status]}`}>
        {status}
      </p>
    </div>
  );
};

export default Videocoin;