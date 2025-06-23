import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import downloadIcon from '../assets/Vendor/download.png';

const DownloadContent = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const tableContainerRef = useRef(null);
  const baseUrl = 'https://admin.urbantyohar.com';

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const token = localStorage.getItem('vendor_token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const config = {
          method: 'post',
          url: 'https://admin.urbantyohar.com/api/all-video',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        };
       
        const response = await axios.request(config);
        setDownloads(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDownloads();
  }, []);

  const handleScroll = () => {
    if (tableContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current;
      const maxScroll = scrollHeight - clientHeight;
      if (maxScroll === 0) {
        setScrollProgress(0);
        return;
      }
      const percentage = (scrollTop / maxScroll) * 100;
      setScrollProgress(Math.min(Math.max(percentage, 0), 100));
    }
  };

  if (loading) return <div className="p-6 font-poppins flex justify-center items-center"><div className="text-xl">Loading...</div></div>;
  if (error) return <div className="p-6 font-poppins flex justify-center items-center"><div className="text-xl text-red-500">Error: {error}</div></div>;

  return (
    <div className="p-6 font-poppins relative">
      <h1 className="text-xl font-semibold mb-2">Downloads</h1>
      <div className="p-5 flex justify-center relative">
        <div className="max-w-4xl w-full bg-white p-5 border-4 border-purple-600 rounded-lg shadow-lg relative">
          <h1 className="text-2xl font-semibold mb-4 text-center">My Download</h1>
          <div className="relative pr-6">
            <div 
              ref={tableContainerRef}
              onScroll={handleScroll}
              className="overflow-y-auto max-h-[400px] pr-4"
            >
              <table className="w-full border-collapse border border-gray-300 font-normal">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-3 font-light">SL No.</th>
                    <th className="border border-gray-300 p-3 font-light">Video Style</th>
                    <th className="border border-gray-300 p-3 font-light">Product Code</th>
                    <th className="border border-gray-300 p-3 font-light">Order Date</th>
                    <th className="border border-gray-300 p-3 font-light">Delivery Date</th>
                    <th className="border border-gray-300 p-3 font-light">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {downloads.length > 0 ? (
                    downloads.map((item, index) => (
                      <tr key={item.id} className="text-center hover:bg-gray-50">
                        <td className="border border-gray-300 p-3 text-red-500">{index + 1}</td>
                        <td className="border border-gray-300 p-3 text-red-500">{item.video_type}</td>
                        <td className="border border-gray-300 p-3 text-red-500">{item.product_code}</td>
                        <td className="border border-gray-300 p-3 text-red-500">
                          {new Date(item.order_date).toLocaleDateString()}
                        </td>
                        <td className="border border-gray-300 p-3 text-red-500">
                          {new Date(item.delivery_date).toLocaleDateString()}
                        </td>
                        <td className="border border-gray-300 p-3">
                          <a href={`${baseUrl}/${item.video}`} download>
                            <img 
                              src={downloadIcon} 
                              alt="Download" 
                              className="w-32 h-9.5 mx-auto cursor-pointer transition-transform hover:scale-105" 
                            />
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-3 text-center text-gray-500">
                        No downloads available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="absolute right-0 top-0 bottom-0 w-6">
              <div className="relative w-0.5 h-full bg-[#5050FF]">
                <div 
                  className="absolute left-[-7px] w-4 h-4 bg-[#5050FF] rounded-full transition-all duration-200"
                  style={{ top: `${scrollProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadContent;