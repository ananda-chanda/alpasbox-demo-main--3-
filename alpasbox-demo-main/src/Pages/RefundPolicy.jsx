import React, { useEffect, useState } from "react";
import axios from "axios";
import Lottie from "react-lottie";
import animationdata from "../assets/footer/Cancelation & Refund Policy.json";

const RefundPolicy = () => {
  const [policy, setPolicy] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await axios.post("https://admin.urbantyohar.com/api/refund-policy");
        if (response.data.status === 200) {
          setPolicy(response.data.data[0]?.refund_policy || "No policy available");
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationdata,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const highlightStrongText = (html) => {
    return html.replace(/<strong>(.*?)<\/strong>/g, (match, p1) => {
      return `<strong class="text-indigo-600">${p1}</strong>`;
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 ">
        <Lottie 
          options={defaultOptions} 
          height={window.innerWidth < 640 ? 200 : 300} 
          width={window.innerWidth < 640 ? 200 : 300} 
        />
        <div className="animate-pulse text-center w-full max-w-md">
          <div className="h-4 bg-gray-200 rounded-full w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded-full w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <Lottie 
          options={defaultOptions} 
          height={window.innerWidth < 640 ? 200 : 300} 
          width={window.innerWidth < 640 ? 200 : 300} 
        />
        <p className="text-red-500 text-center mt-4">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col items-center px-4 sm:px-6 md:px-12 py-8 md:py-12 mt-8">
      <div className="mb-4 md:mb-6">
        <Lottie 
          options={defaultOptions} 
          height={window.innerWidth < 640 ? 200 : 300} 
          width={window.innerWidth < 640 ? 200 : 300} 
        />
      </div>
      
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6 text-center">
        Refund Policy
      </h1>
      
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div
          className="text-gray-800 text-base md:text-lg leading-relaxed md:leading-loose space-y-3 md:space-y-4"
          dangerouslySetInnerHTML={{
            __html: highlightStrongText(policy),
          }}
        />
      </div>
    </div>
  );
};

export default RefundPolicy;