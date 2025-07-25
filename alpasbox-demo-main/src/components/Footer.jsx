import React, { useEffect, useState } from 'react';
import axios from 'axios';
// Importing assets
import Utlogo from '../assets/Navbar/Logo.png';
import PlayStore from '../assets/footer/Play-Store.png';
// import AppStore from '../assets/footer/App-Stor.png';
import Phonepay from '../assets/footer/Razorpay.png';
import Youtube from '../assets/footer/YouTube.png';
import Facebook from '../assets/footer/Facebook.png';
import Instagram from '../assets/footer/Instagram.png';
import Printest from '../assets/footer/Printest.png';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [informationLinks, setInformationLinks] = useState([]);
  const socialMediaLinks = [
    { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/urbantyohar' },
    { name: 'YouTube', icon: Youtube, url: 'https://www.youtube.com/@urbantyohar' },
    { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/urbantyohar/' },
    { name: 'Pinterest', icon: Printest, url: 'https://in.pinterest.com/urbantyohar/' },
  ];

  const userAreaLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'FAQs', path: '/Faq' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms & Conditions', path: '/terms-con' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Refund & Policy', path: '/refund' },
    { name: 'Process', path: '/process' },
    { name: 'Blogs', path: '/blog' },
    // {name:'Landing Page', path:'/landing'},
    { name: 'Custom Page', path: '/custom-page' },
     { name: 'Package', path: '/package' },
    { name: 'For Vendor', path: '/vendor-plan' },
  ];

  useEffect(() => {
    // Fetching quick links data using axios
    const fetchQuickLinks = async () => {
      try {
        const response = await axios.post('https://admin.urbantyohar.com/api/quick-links');
        if (response.data.status === 200) {
          const fetchedLinks = response.data.data;
          setInformationLinks(fetchedLinks);
        }
      } catch (error) {
        console.error('Error fetching quick links:', error);
      }
    };
    fetchQuickLinks();
  }, []);

  return (
    <footer className="bg-[#F4F3FF] text-black pt-4 border-t-4 border-yellow-500">
      <div className="container mx-auto px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info Column */}
          <div>
            <img
              src={Utlogo}
              alt="Urban Tyohar logo"
              className="mb-4 h-24 w-48 object-contain"
            />
            <p className="mb-4 leading-relaxed font-poppins font-Light">
              <strong className="text-black font-poppins font-semibold">UrbanTyohar</strong>, powered by{' '}
              <strong className="text-black font-poppins font-semibold">AR CREATIVE SOLUTIONS</strong> is a professional Designing Agency strives to
              provide the most Creative digital invitation services by replicating the traditional paper based invite videos & cards.
            </p>
            <p>
              <a href="#" className="text-[#4A00FF] hover:underline">
                Read More
              </a>
            </p>
            <p className="font-poppins font-Regular">Follow Us</p>
            <div className="flex space-x-4 mt-4">
              {socialMediaLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  aria-label={link.name}
                  target="_blank" // Open in a new tab
                  rel="noopener noreferrer" // Improve security
                  className="hover:opacity-80 transition duration-300"
                >
                  <img src={link.icon} alt={link.name} className="h-10 w-10" />
                </a>
              ))}
            </div>

            <div>
              <p className="text-xs mt-2 font-poppins font-Regular">
                Made with <span className="text-red-500">❤</span> in India
              </p>
            </div>
          </div>

          {/* Information Column */}
          <div>
            <h3 className="text-black mb-4 border-b-2 border-[#4A00FF] pb-4 w-[65%] font-poppins font-semibold">
              QUICK LINKS
            </h3>
            <ul className="space-y-2">
              {informationLinks.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.link}
                    rel="noopener noreferrer"
                    className="font-poppins font-Regular hover:text-[#4A00FF] transition duration-300"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* User Area Column */}
          <div>
            <h3 className="font-poppins font-semibold text-black mb-4 border-b-2 border-[#4A00FF] pb-4 w-[65%]">
              USER AREA
            </h3>
            <ul className="space-y-2">
              {userAreaLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="font-poppins font-Regular hover:text-[#4A00FF] transition duration-300"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info Column */}
          <div>
            <h3 className="font-poppins font-semibold text-black mb-4 border-b-2 border-[#4A00FF] pb-4 w-[65%]">
              CONTACT INFO
            </h3>
            <p className="mb-4 flex items-center">
              <i className="fas fa-envelope mr-2 text-[#4A00FF] font-poppins font-Regular"></i> support@urbantyohar.com
            </p>
            <p className="mb-2 flex items-center">
              <i className="font-poppins font-Regular fas fa-phone-alt mr-2 text-[#4A00FF]"></i> +91-9891715977
            </p>

            <h3 className="font-poppins font-semibold text-black mb-4">Urban Tyohar On App</h3>
            <a
              href="https://play.google.com/store/apps/details?id=com.urban.tyohar"
              className="inline-block mb-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={PlayStore}
                alt="Play Store"
                className="w-50 h-14 hover:opacity-80 transition"
              />
            </a>

            {/* <div>
              <a
                href="#"
                className="inline-block mb-4"
                onClick={(e) => {
                  e.preventDefault(); // Prevents default behavior of the anchor tag
                  alert('This feature is currently unavailable on AppStore. Stay tuned for updates!');
                }}
              >
                <img
                  src={AppStore}
                  alt="App Store"
                  className="w-50 h-14 hover:opacity-80 transition"
                />
              </a>
            </div> */}

            <h3 className="font-poppins font-semibold text-black mb-4">Pay Secure By Razorpay</h3>
            <div className="flex space-x-4">
              <a >
                <img
                  src={Phonepay}
                  alt="PhonePe"
                  className="w-42 h-12 hover:opacity-80 transition"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        {/* <div className="bg-[#4A00FF] w-full mt-10 border-black py-4 text-white font-poppins font-regular flex justify-center items-center text-center">
          &copy; {new Date().getFullYear()} All rights reserved by (AR Creative Solutions) URBAN TYOHAR
        </div> */}
      </div>
      <div className="bg-[#4A00FF] w-full mt-10 border-black py-4 text-white font-poppins font-regular flex justify-center items-center text-center">
          &copy; {new Date().getFullYear()} All rights reserved by (AR Creative Solutions) URBAN TYOHAR
        </div>
    </footer>
  );
};

export default Footer;