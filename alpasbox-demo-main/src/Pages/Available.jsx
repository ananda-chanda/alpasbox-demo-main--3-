import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function BrandShowcase() {
  const [brands, setBrands] = useState([]);
  const [title, setTitle] = useState(''); // State for the title
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    // Fetch data from the API
    axios.post('https://admin.urbantyohar.com/api/market-place')
      .then((response) => {
        const apiData = response.data.data[0];
        const marketPlaces = JSON.parse(apiData.market_place).map((brand) => ({
          ...brand,
          name: brand.name.replace(/\\/g, '/'), // Decode the image path
        }));
        setBrands(marketPlaces);
        setTitle(apiData.title); // Set the title from the API response
      })
      .catch((error) => {
        console.error('Error fetching marketplace data:', error);
      });
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current && contentRef.current) {
        const contentWidth = contentRef.current.offsetWidth;
        containerRef.current.style.setProperty('--marquee-width', `${contentWidth}px`);
      }
    });
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="max-w-full py-0 px-0 overflow-hidden bg-white rounded-md md:py-0 border-r-2 border-l-2 border-gray-200 ">
      <div className='bg-[#4A00FF] '>
        <h2 className="text-2xl md:text-2xl font-bold text-center mb-4 md:mb-10 text-white">
          {title} {/* Display the dynamic title */}
        </h2>
      </div>

      <div
        ref={containerRef}
        className="relative w-full overflow-hidden"
        style={{
          '--marquee-duration': '10s',
        }}
      >
        {/* Create two identical sets of logos for seamless looping */}
        <div className="flex marquee-container">
      <div
  ref={contentRef}
  className="flex items-center space-x-6 md:space-x-10 animate-marquee whitespace-nowrap"
>
  {brands.map((brand, index) => (
    <div
      key={index}
      className="inline-flex flex-shrink-0 items-center justify-center px-2 md:px-4"
    >
      <a
        href={`https://${brand.link}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center"
      >
        <img
          src={`https://admin.urbantyohar.com/${brand.name}`}
          alt={`Brand ${index}`}
          className="h-8 md:h-16 object-contain" // Adjusted height for mobile and desktop
        />
      </a>
    </div>
  ))}
</div>

{/* Duplicate content for seamless looping */}
<div
  className="flex items-center space-x-16 md:space-x-10 animate-marquee whitespace-nowrap"
  aria-hidden="true"
>
  {brands.map((brand, index) => (
    <div
      key={`duplicate-${index}`}
      className="inline-flex flex-shrink-0 items-center justify-center px-2 md:px-4"
    >
      <a
        href={`https://${brand.link}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center"
      >
        <img
          src={`https://admin.urbantyohar.com/${brand.name}`}
          alt={`Brand ${index}`}
          className="h-8 md:h-16 object-contain" // Adjusted height for mobile and desktop
        />
      </a>
    </div>
  ))}
</div>

          {/* Duplicate content for seamless looping */}
          <div
            className="flex items-center space-x-16 animate-marquee whitespace-nowrap"
            aria-hidden="true"
          >
            {brands.map((brand, index) => (
              <div
                key={`duplicate-${index}`}
                className="inline-flex flex-shrink-0 items-center justify-center px-4"
              >
                <a
                  href={`https://${brand.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  <img
                    src={`https://admin.urbantyohar.com/${brand.name}`}
                    alt={`Brand ${index}`}
                    className="h-16 md:h-20 object-contain"
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0); /* Start fully visible */
          }
          100% {
            transform: translateX(-30%); /* Move out of view */
          }
        }

        .marquee-container {
          width: fit-content;
        }

        .animate-marquee {
          animation: marquee var(--marquee-duration) linear infinite;
        }
        .marquee-container:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}