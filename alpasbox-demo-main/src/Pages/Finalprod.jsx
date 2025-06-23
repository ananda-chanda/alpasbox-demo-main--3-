import React, { useState } from 'react';

const ContactDeliveryForm = () => {
  const [formSection, setFormSection] = useState(1);
  return (
    <div className="min-h-screen mt-10 bg-gradient-to-br from-purple-100 via-blue-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Form Card with decorative elements */}
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-purple-100 rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-100 rounded-full translate-x-16 translate-y-16"></div>
          
          {/* Progress Steps */}
          <div className="relative pt-6">
            <div className="flex justify-center items-center gap-4 mb-8">
              <div 
                className={`h-10 w-10 rounded-full flex items-center justify-center text-lg font-semibold border-2 transition-all duration-300 
                ${formSection >= 1 ? 'border-purple-500 bg-purple-500 text-white' : 'border-gray-300 text-gray-400'}`}
              >
                1
              </div>
              <div className={`h-1 w-16 transition-all duration-300 ${formSection === 2 ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
              <div 
                className={`h-10 w-10 rounded-full flex items-center justify-center text-lg font-semibold border-2 transition-all duration-300
                ${formSection === 2 ? 'border-purple-500 bg-purple-500 text-white' : 'border-gray-300 text-gray-400'}`}
              >
                2
              </div>
            </div>
          </div>

          <div className="relative p-8 sm:p-10">
            {/* Contact Section */}
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Contact Details
                </h2>
                <a href="#" className="text-purple-600 hover:text-purple-800 text-sm font-medium px-4 py-2 rounded-lg hover:bg-purple-50 transition-all duration-200">
                  Log in
                </a>
              </div>
              
              <div className="space-y-6">
                <div className="group relative">
                  <input
                    type="text"
                    placeholder="Email or mobile phone number"
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 group-hover:bg-white"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg className="h-6 w-6 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
                
                <label className="flex items-center gap-3 group cursor-pointer p-2 hover:bg-purple-50 rounded-lg transition-colors duration-200">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="peer h-6 w-6 appearance-none rounded-md border-2 border-purple-200 checked:border-purple-500 checked:bg-purple-500 transition-all duration-200"
                    />
                    <svg
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                    Email me with news and offers
                  </span>
                </label>
              </div>
            </div>

            {/* Delivery Section */}
            <div className="mt-12 space-y-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Delivery Information
              </h2>
              
              <div className="space-y-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Country/Region</label>
                  <div className="relative group">
                    <select className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 appearance-none group-hover:bg-white">
                      <option>India</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="group">
                    <input
                      type="text"
                      placeholder="First name"
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 group-hover:bg-white"
                    />
                  </div>
                  <div className="group">
                    <input
                      type="text"
                      placeholder="Last name"
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 group-hover:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="group relative">
                    <input
                      type="text"
                      placeholder="Address"
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 group-hover:bg-white"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <svg className="h-6 w-6 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>

                  <div className="group">
                    <input
                      type="text"
                      placeholder="Apartment, suite, etc. (optional)"
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 group-hover:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="group">
                      <input
                        type="text"
                        placeholder="City"
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 group-hover:bg-white"
                      />
                    </div>
                    <div className="group relative">
                      <select className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 appearance-none group-hover:bg-white">
                        <option>Odisha</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <div className="group">
                      <input
                        type="text"
                        placeholder="PIN code"
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 group-hover:bg-white"
                      />
                    </div>
                  </div>

                  <div className="group relative">
                    <input
                      type="tel"
                      placeholder="Phone"
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 group-hover:bg-white"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <svg className="h-6 w-6 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="mt-10">
              <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg">
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDeliveryForm;