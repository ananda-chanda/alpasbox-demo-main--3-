import React from "react";
import star from "../assets/all_icon/5-Star.png"; 
import review from '../assets/all_icon/Review-01.png';

const CustomerReviews = () => {
  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <img src={star} alt="5-Star Icon" className="w-50 h-16" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-5xl font-bold text-gray-900 mb-6">
            Customer Satisfaction
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our community of{" "}
            <span className="font-bold text-blue-600">1 Lakh+</span> satisfied
            customers and experience excellence.
          </p>
        </div>

        {/* Centered Review Image Section */}
        <div className="flex justify-center items-center mb-16">
          <div className="relative group max-w-md">
            <img 
              src={review} 
              alt="Google Review" 
              className="w-full object-contain cursor-pointer hover:opacity-90 transition-opacity rounded-xl shadow-lg" 
              onClick={() => window.open('https://www.google.com/search?q=urban+tyohar+invitation+maker&sca_esv=87b41ab4477c98ab&authuser=0&biw=1920&bih=955&sxsrf=AE3TifMeTrleUEM4V_yTJx0LPt6Of_6rQA%3A1749214427608&ei=2-RCaITUIbnB4-EPpougGQ&oq=UrbanTyohar+&gs_lp=Egxnd3Mtd2l6LXNlcnAiDFVyYmFuVHlvaGFyICoCCAIyBxAjGLACGCcyBxAjGLACGCcyBxAjGLACGCcyBhAAGA0YHjILEAAYgAQYhgMYigUyCxAAGIAEGIYDGIoFMgsQABiABBiGAxiKBTILEAAYgAQYhgMYigUyCBAAGIAEGKIEMggQABiABBiiBEikEVCkAVikAXABeACQAQCYAdMBoAHTAaoBAzItMbgBAcgBAPgBAZgCAqAC5AHCAgoQABiABBiwAxgKwgILEAAYgAQYsAMYogTCAggQABiwAxjvBZgDAIgGAZAGBpIHBTEuMC4xoAefCrIHAzItMbgH3gHCBwMyLTLIBws&sclient=gws-wiz-serp#lrd=0x3a19a70a544d34fd:0x612407a36b433105,1,,,,', '_blank')}
            />
            <div className="absolute -bottom-10 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-lg text-gray-600">
              Click to view our Google Reviews
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Trusted by businesses worldwide. Our customer satisfaction speaks
            for itself through authentic reviews and testimonials.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews;