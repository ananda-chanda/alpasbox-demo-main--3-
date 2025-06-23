import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Faq = () => {
  // State to handle the visibility of answers
  const [activeAnswer, setActiveAnswer] = useState(null);
  // State to store FAQ data from API
  const [faqData, setFaqData] = useState([]);
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch FAQ data from API
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const response = await axios.post('https://admin.urbantyohar.com/api/faq');
        
        // Verify API response format and parse the JSON string from 'faq' field
        if (response.data.status === 200 && response.data.data?.faq) {
          const parsedFaqs = JSON.parse(response.data.data.faq);
          setFaqData(parsedFaqs);
        } else {
          throw new Error('Invalid data format received from API');
        }
      } catch (err) {
        console.error('Error fetching FAQ data:', err);
        setError('Failed to load FAQs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggleAnswer = (id) => {
    // Toggle the answer visibility
    if (activeAnswer === id) {
      setActiveAnswer(null);
    } else {
      setActiveAnswer(id);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="bg-white py-2 px-4 mt-20">
        <div className="max-w-7xl mx-auto bg-white rounded-md">
          <div className=" bg-[#4A00FF] text-white text-3xl py-4 px-0 rounded-t-md text-center sm:text-2xl">
            Frequently Asked Questions
          </div>
          <div className="text-center py-10">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Loading FAQs...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-white py-2 px-4 mt-20">
        <div className="max-w-7xl mx-auto bg-white rounded-md">
          <div className="bg-[#4A00FF] text-white text-3xl py-4 px-0 rounded-t-md text-center sm:text-2xl">
            Frequently Asked Questions
          </div>
          <div className="text-center py-10 text-red-500">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-2 px-4 mt-20">
      <div className="max-w-7xl mx-auto bg-white rounded-md">
        {/* Heading */}
        <div className="bg-[#4A00FF] text-white text-3xl py-4 px-0 rounded-t-md text-center sm:text-2xl">
          Frequently Asked Questions
        </div>

        {/* Dynamically render FAQ items from API data */}
        {faqData.map((faq, index) => (
          <div key={index} className="border-b">
            <button
              onClick={() => toggleAnswer(`answer${index}`)}
              className="w-full text-left px-6 py-5 text-lg font-poppins font-semibold  text-gray-600 hover:bg-gray-100 focus:outline-none flex justify-between items-center"
            >
              {faq.question}
              <span className="text-xl lg:text-2xl">{activeAnswer === `answer${index}` ? '-' : '+'}</span>
            </button>
            {activeAnswer === `answer${index}` && (
              <div className="px-4 py-3">
                <p className=" font-poppins text-gray-700 text-sm lg:text-lg">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Show a message if no FAQs are available */}
        {faqData.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p>No FAQs available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Faq;