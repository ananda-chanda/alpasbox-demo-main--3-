import React, { useEffect, useState } from "react";
import axios from "axios";

const Process = () => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("https://admin.urbantyohar.com/api/how-to-use");
        if (response.data.status === 200) {
          setSections(response.data.data);
        } else {
          console.error("Failed to fetch data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getVideoId = (url) => {
    try {
      // Handle youtu.be links
      if (url.includes('youtu.be')) {
        const id = url.split('youtu.be/')[1];
        return id.split('?')[0];
      }
      
      // Handle youtube.com links
      if (url.includes('youtube.com')) {
        const searchParams = new URLSearchParams(new URL(url).search);
        return searchParams.get('v');
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting video ID:', error);
      return null;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 mt-16">
      {sections.map((section) => {
        const videoId = getVideoId(section.video_link);
        
        return (
          <div key={section.id} className="space-y-4">
            <h2 className="text-center text-xl font-poppins font-semibold">
              {section.title}
            </h2>
            <div className="border-4 border-red-500 rounded-lg overflow-hidden">
              {videoId ? (
                <iframe
                  className="w-full h-96"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={section.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-96 flex items-center justify-center text-red-500">
                  Invalid YouTube URL
                </div>
              )}
            </div>
            <hr className="w-full border-t-2 border-red-500" />
          </div>
        );
      })}
    </div>
  );
};

export default Process;