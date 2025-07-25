import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle } from 'lucide-react';
import one from '../assets/process/1.png';
import Two from '../assets/process/2.png';
import Three from '../assets/process/3.png';
import Four from '../assets/process/4.png';
import Five from '../assets/process/5.png';
import Six from '../assets/process/6.png';
import Seven from '../assets/process/7.png';
import Banner from '../assets/process/process-banner.jpg';

import vendortik from '../assets/blog/vendor-tik.png';

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

  const steps = [
    "You enquire about a digital invite, caricature video, printed card, or wedding stationery (we're available on WhatsApp, call, or through the app).",
    "A dedicated representative from Urban Tyohar will attend to your query and listen to your event story, preferences, and theme ideas.",
    "Based on your inputs, we prepare a mood board — this includes color palettes, religious or cultural themes, references, and latest trends.",
    "We'll also show you samples and previous works similar to what you're looking for, helping you visualise your invite.",
    "Once you shortlist your favourite styles, we proceed with a token payment to begin the customisation process.",
    "On confirmation (typically after 70% advance for print/video orders), we begin designing your final invitation.",
    "For printed invites, we offer doorstep delivery of physical samples in select cities. Our pan-India doorstep service is available at no extra cost (minimal travel charges may apply for remote locations).",
    "Our expert design team then works on finalizing your digital video, handmade caricature, or custom printed card based on your exact needs.",
    "You get the first preview, suggest edits, and approve the final version.",
    "Your final invite is delivered via WhatsApp (for digital) or courier (for printed), anywhere in India or internationally.",
  ];

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

  const stepImages = [one, Two, Three, Four, Five, Six, Seven];

  return (
    <div className="min-h-screen bg-white font-poppins">
      {/* Header Section */}
      <div 
        className="relative md:bg-cover bg-contain  bg-center text-white py-20 px-6 text-center overflow-hidden md:h-[450px] h-[200px]"
        style={{ backgroundImage: `url(${Banner})` }}
      >
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          {/* <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">WANNA KNOW</h1>
            <h2 className="text-3xl md:text-4xl font-semibold mb-2">APPROACH BEHIND OUR CREATIVE</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-green-400">INVITATION VIDEO OR</h3>
            <h3 className="text-3xl md:text-4xl font-bold text-green-400">PRINTABLE CARD</h3>
          </div> */}
        </div>
      </div>

      <div className="max-w-full mx-auto px-0 md:px-36">
        <div className="max-w-8xl px-6 py-4 text-center font-semibold text-3xl text-align-center">
          <h2 className="font-poppins">Simple, Personalised & Superfast <br /> Just Like Your Celebration Deserves</h2>
        </div>
        <div className="mt-6 text-lg text-gray-700 max-w-8xl font-normal text-start px-6">
          <p className="font-poppins">At Urban Tyohar, we believe every invitation is more than just a message — it's the beginning of a memory. And to make it truly special, we follow a creative yet simple process that puts you and your story at the centre of everything.</p>
          <p className="font-poppins">Whether you're choosing a handmade caricature invite, a digital video for WhatsApp, or a premium printed card, our process is designed to keep things quick, clear, and collaborative.</p>
        </div>
      </div>
      
      {/* Process Steps in rows of two */}
      <div className="max-w-7xl mx-auto px-6 py-16 bg-white">
        <div className="text-center mb-8 font-semibold text-3xl">
          <h2 className="font-poppins">How Urban Tyohar Works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Step 1 */}
          <div className="flex flex-col">
            <div className="relative mb-6">
              <div className="relative overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={one}
                    alt="Step 1: Share Your Requirement"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              {/* <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                1
              </div> */}
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight mb-4 font-poppins">
              Step 1: Share Your Requirement
            </h3>
            <p className="text-gray-600 text-base leading-relaxed font-poppins">
              Start by telling us what you're looking for — digital invite, caricature, printed card, wedding stationery, or baby/kids themes. Even if you're not fully sure, no worries. Just share your thoughts, event details, or a few reference ideas, and we'll take it from there.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col">
            <div className="relative mb-6">
              <div className="relative overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={Two}
                    alt="Step 2: Tell Us Your Story"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              {/* <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                2
              </div> */}
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight mb-4 font-poppins">
              Step 2: Tell Us Your Story
            </h3>
            <p className="text-gray-600 text-base leading-relaxed font-poppins">
              We love to hear your celebration's story, especially for caricature invites and custom video creation. Whether it's a wedding journey, your kids' milestones, or a baby shower theme, your story helps us create invites that feel personal and memorable.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col">
            <div className="relative mb-6">
              <div className="relative overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={Three}
                    alt="Step 3: Choose Your Design"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              {/* <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                3
              </div> */}
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight mb-4 font-poppins">
              Step 3: Choose Your Design
            </h3>
            <p className="text-gray-600 text-base leading-relaxed font-poppins">
              Browse through our collection of designs and select one that matches your vision. Whether you're looking for something traditional, modern, playful, or elegant, we have options to suit every style and occasion.
            </p>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col">
            <div className="relative mb-6">
              <div className="relative overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={Four}
                    alt="Step 4: Personalize Your Invitation"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              {/* <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                4
              </div> */}
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight mb-4 font-poppins">
              Step 4: Personalize Your Invitation
            </h3>
            <p className="text-gray-600 text-base leading-relaxed font-poppins">
              Provide all the important details like names, dates, venue information, RSVP details, and any special messages you'd like to include. Our designers will create a personalized mockup incorporating all your information.
            </p>
          </div>

          {/* Step 5 */}
          <div className="flex flex-col">
            <div className="relative mb-6">
              <div className="relative overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={Five}
                    alt="Step 5: Review and Feedback"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              {/* <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                5
              </div> */}
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight mb-4 font-poppins">
              Step 5: Review and Feedback
            </h3>
            <p className="text-gray-600 text-base leading-relaxed font-poppins">
              We'll send you a draft version of your invitation for review. Take your time to check all details and provide any feedback or changes you'd like to make. We offer up to two rounds of revisions to ensure your complete satisfaction.
            </p>
          </div>

          {/* Step 6 */}
          <div className="flex flex-col">
            <div className="relative mb-6">
              <div className="relative overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={Six}
                    alt="Step 6: Finalization and Delivery"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              {/* <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                6
              </div> */}
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight mb-4 font-poppins">
              Step 6: Finalization and Delivery
            </h3>
            <p className="text-gray-600 text-base leading-relaxed font-poppins">
              Once you approve the design, we'll prepare the final files. For digital invitations, we'll send you ready-to-share formats. For printed items, we'll ensure high-quality production and arrange for swift delivery to your address.
            </p>
          </div>

          {/* Step 7 */}
          <div className="flex flex-col md:col-span-2 max-w-lg mx-auto">
            <div className="relative mb-6">
              <div className="relative overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={Seven}
                    alt="Step 7: Share and Celebrate!"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              {/* <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                7
              </div> */}
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight mb-4 font-poppins">
              Step 7: Share and Celebrate!
            </h3>
            <p className="text-gray-600 text-base leading-relaxed font-poppins">
              It's time to share your beautiful invitation with your guests! Whether through WhatsApp, email, social media, or traditional mail, your invitation will make a fantastic impression and set the perfect tone for your upcoming celebration.
            </p>
          </div>
        </div>
      </div>

      {/* Process Steps - Videos */}
      <div className="max-w-6xl mx-auto px-6 py-4 bg-white">
        <div className="text-center mb-12 font-semibold text-3xl font-poppins">
          <h2>How Urban Tyohar Works</h2>
        </div>
        
        <div className="space-y-16">
          {sections.map((section, index) => {
            const videoId = getVideoId(section.video_link);
            
            return (
              <div key={section.id} className="flex flex-col items-center">
                {/* Video Side */}
                <div className="w-full max-w-3xl">
                  <div className="relative">
                    {videoId ? (
                      <div className="aspect-video">
                        <iframe
                          className="w-full h-full rounded-lg"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title={section.title || `Video ${index + 1}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl ">
        <h2 className="text-3xl font-semibold text-center mb-6">STEPS IN A NUTSHELL</h2>
        <ul className="space-y-4">
          {steps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <img 
                src={vendortik} 
                alt="tick" 
                className="w-5 h-5 mt-1" 
              />
              <p className="text-gray-800">{step}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Process;