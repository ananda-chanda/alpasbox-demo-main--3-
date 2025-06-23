import React, { useState, useEffect } from "react";
import { IoMdPerson } from "react-icons/io";
import { HiOutlineMenuAlt3, HiOutlineX, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Logo from "../assets/Navbar/Logo.png";
import axios from "axios";
import Utlogo from '../assets/Navbar/Utlogo.png';
import VendorLogo from '../assets/Navbar/vendor_logo.png';
import Ut from '../assets/Hero/Logo-UT.png'


const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // State for API data
  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategories] = useState({});
  const [subCategories, setSubCategories] = useState({});
  const [specialSubCategories3, setSpecialSubCategories3] = useState([]); // State for maincat_id=3
  const [specialSubCategories4, setSpecialSubCategories4] = useState([]); // State for maincat_id=4 (we'll still fetch but not use directly)
  const [searchQuery, setSearchQuery] = useState(""); 

  useEffect(() => {
    const userToken = localStorage.getItem("user_token");
    const vendorToken = localStorage.getItem("vendor_token");
    setIsLoggedIn(!!userToken || !!vendorToken);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Function to fetch and store all data
  const fetchAndStoreAllData = async () => {
    try {
      // Fetch main categories
      const mainCatResponse = await axios.post('https://admin.urbantyohar.com/api/main-category');
      const mainCats = mainCatResponse.data.data || [];
      
      // Fetch categories and subcategories
      const categoriesData = {};
      const subCategoriesData = {};
      let specialSubCategoriesData3 = [];
      let specialSubCategoriesData4 = [];

      for (const mainCat of mainCats) {
        const catResponse = await axios.post(`https://admin.urbantyohar.com/api/all-category?maincat_id=${mainCat.id}`);
        const cats = catResponse.data.data || [];
        categoriesData[mainCat.id] = cats;

        for (const category of cats) {
          const subCatResponse = await axios.post(`https://admin.urbantyohar.com/api/subcategory?category_id=${category.id}`);
          subCategoriesData[category.id] = subCatResponse.data.data || [];
        }

        // Fetch special subcategories for maincat_id=3 and maincat_id=4
        if (mainCat.id === 3) {
          const specialSubCatResponse = await axios.post(`https://admin.urbantyohar.com/api/main-subcategory?maincat_id=3`);
          specialSubCategoriesData3 = specialSubCatResponse.data.data || [];
        } else if (mainCat.id === 4) {
          const specialSubCatResponse = await axios.post(`https://admin.urbantyohar.com/api/main-subcategory?maincat_id=4`);
          specialSubCategoriesData4 = specialSubCatResponse.data.data || [];
        }
      }

      // Store all data in state
      setMainCategories(mainCats);
      setCategories(categoriesData);
      setSubCategories(subCategoriesData);
      setSpecialSubCategories3(specialSubCategoriesData3);
      setSpecialSubCategories4(specialSubCategoriesData4);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAndStoreAllData();
  }, []);

  const handleCategoryClick = (mainCategory, category) => {
    if (category.category_name === 'Browse by Category') {
      window.scrollTo(0, 0);
      navigate('/browse-category');
    } else if (mainCategory.id === 3) {
      // Special navigation logic for maincat_id=3
      navigate(`/Stasubcategory/${category.id}/${category.category_name.replace(/\s+/g, '-')}`);
      window.scrollTo(0, 0);
    } else {
      navigate(`/${mainCategory.maincat_name.replace(/\s+/g, '-')}/${category.id}/${category.category_name.replace(/\s+/g, '-')}`);
    }
    setIsMobileMenuOpen(false);
  };

  const handleMainCategoryClick = (mainCategory) => {
    // Special handling for maincat_id=6 to redirect to /gift
    if (mainCategory.id === 6) {
      window.scrollTo(0, 0);
      navigate('/gift');
      setIsMobileMenuOpen(false);
      return true; // Return true to indicate we've handled the navigation
    }
    return false; // Return false to indicate we haven't handled the navigation
  };

  const DropdownMenu = ({ mainCategory }) => {
    const categoryItems = categories[mainCategory.id] || [];
    const hasItems = categoryItems.length > 0;
  
    return (
      <div className="group w-full md:w-auto relative">
        {!isMobile ? (
          <div
            className="relative"
            onMouseEnter={() => hasItems && setActiveDropdown(mainCategory.maincat_name)}
            onMouseLeave={() => setActiveDropdown(null)}
            onClick={() => handleMainCategoryClick(mainCategory)}
          >
            <div className="relative px-4 py-2 cursor-pointer">
              <span className="flex items-center justify-between md:justify-start gap-1 font-poppins font-medium relative text-white">
                {mainCategory.maincat_name}
                {hasItems && mainCategory.id !== 6 && (
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === mainCategory.maincat_name ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-out hidden md:block"></span>
              </span>
            </div>
      
            {activeDropdown === mainCategory.maincat_name && hasItems && mainCategory.id !== 6 && (
              <div className="absolute left-0 border-b w-auto bg-[#4A00FF] opacity-100 translate-y-0 transition-opacity duration-300 ease-out delay-150 rounded-b-2xl">
                <div className="p-2">
                  <div className="flex flex-wrap gap-1 ">
                    {categoryItems.map((category, index) => (
                      <div
                        key={category.id}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering parent click
                          handleCategoryClick(mainCategory, category);
                        }}
                      >
                        <div
                          className={`relative group/item transition-all duration-300 hover:text-shadow-md ${index !== categoryItems.length - 1 ? 'border-b border-gray-400' : ''}`}
                        >
                          <div className="flex justify-center items-center px-4 py-2 cursor-pointer whitespace-nowrap min-w-[150px]">
                            <span className="font-medium text-white group-hover/item:text-black-600 transition-colors duration-600 ">
                              {category.category_name}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className="font-medium px-4 py-2 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-300 cursor-pointer rounded-lg flex items-center justify-between"
            onClick={() => {
              if (handleMainCategoryClick(mainCategory)) {
                // If the main category click is handled (for maincat_id=6), don't show submenu
                return;
              }
              
              if (hasItems) {
                setActiveCategory(mainCategory);
                setShowSubMenu(true);
              }
            }}
          >
            {mainCategory.maincat_name}
            {hasItems && mainCategory.id !== 6 && <HiChevronRight className="text-xl" />}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#4A00FF] shadow-lg fixed top-0 w-fit mx-auto z-50 mt-0 md:mt-6 rounded-sm md:rounded-full max-md:w-full px-0 md:px-4 border-2 border-yellow-200">
      <div className="mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-2 py-2 md:py-1 gap-4">
          <div className="flex-shrink-0"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              navigate("/");
            }} >
            <img src={Utlogo} alt="Logo" className="h-10 md:h-10 w-fit object-contain" />
          </div>

          {/* Navigation Menu for Desktop */}
          <nav className="hidden md:block border-t md:border-t-0">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-2 md:py-1">
                <div className="flex flex-col md:flex-row w-full md:justify-center items-stretch md:items-center gap-2">
                  {mainCategories.map((mainCategory) => (
                    <DropdownMenu key={mainCategory.id} mainCategory={mainCategory} />
                  ))}
                </div>
                {/* <a 
                  className="text-white font-poppins font-medium px-4 py-2 hover:text-black-600 transition-colors duration-300 cursor-pointer rounded-lg flex items-center gap-2" 
                  onClick={() => {navigate('/vendor-plan')
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                > 
                  <span className="flex items-center"> 
                    <img src={VendorLogo} alt="Vendor Logo" className="h-5 w-5 mr-2" /> 
                    Vendor 
                  </span>
                </a> */}
              </div>
            </div>
          </nav>

          {/* Login/Profile Button */}
          {isLoggedIn ? (
            <button
              className="text-[#4A00FF] max-md:hidden flex items-center gap-1 bg-[#FFCA00] px-2 py-1 rounded-3xl cursor-pointer hover:bg-[#E0A800] transition-colors duration-300 font-poppins font-medium"
              onClick={() => {
                const userToken = localStorage.getItem("user_token");
                const vendorToken = localStorage.getItem("vendor_token");
                if (userToken) {
                  navigate("/profile");
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (vendorToken) {
                  navigate("/vendor-desh");
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              <IoMdPerson className="text-lg" />
              Profile
            </button>
          ) : (
            <button
              className="flex items-center max-md:hidden gap-1 bg-[#FFCA00] px-2 py-1 rounded-3xl cursor-pointer hover:bg-[#FFCA00] transition-colors duration-300"
              onClick={() => navigate("/login")}
            >
              <IoMdPerson className="text-lg" />
              Login
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-xl p-1 text-white hover:bg-gray-300 rounded-lg transition-colors duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
          </button>
        </div>

        {/* Mobile Menu */}
     {isMobileMenuOpen && isMobile && (
  <div className="fixed inset-0 bg-white bg-opacity-50 z-40">
    <div className="fixed top-0 left-0 w-full h-full">
      {/* Main Menu */}
      <div className={`absolute top-0 right-0 w-full h-full bg-white shadow-lg z-50 transition-transform duration-300 transform ${showSubMenu ? '-translate-x-full' : 'translate-x-0'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <img src={Logo} alt="Logo" className="h-8 w-24 object-contain" />
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-2xl">
            <HiOutlineX />
          </button>
        </div>
        
        <div className="flex flex-col gap-0 p-2">
          {mainCategories.map((mainCategory) => (
            <DropdownMenu key={mainCategory.id} mainCategory={mainCategory} />
          ))}
          <a
            className="font-medium px-4 py-2 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-300 cursor-pointer rounded-lg"
            onClick={() => {
              navigate("/contact");
              setIsMobileMenuOpen(false);
            }}
          >
            Contact Us
          </a>
          {!isLoggedIn && (
            <a
              className="font-medium px-4 py-2 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-300 cursor-pointer rounded-lg"
              onClick={() => {
                window.scrollTo(0, 0);
                navigate("/login");
                setIsMobileMenuOpen(false);
              }}
            >
              Login
            </a>
          )}
          {/* Vendor link moved to the end */}
          <a
            className="font-medium px-4 py-2 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-300 cursor-pointer rounded-lg flex items-center gap-0 mt-2"
            onClick={() => {
              // alert('Currently we are working on this page. Please visit after some time.');
              navigate('/vendor-plan')
              setIsMobileMenuOpen(false);
              //  navigate('/vendor-plan')
            }}
          >
            <img src={VendorLogo} alt="Vendor Logo" className="h-5 w-5" />
            Vendor
          </a>
        </div>
      </div>
      {/* Categories Sub Menu */}
      <div className={`absolute top-0 left-0 w-full h-full bg-white shadow-lg z-50 transition-transform duration-300 transform ${showSubMenu ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <button 
            onClick={() => setShowSubMenu(false)}
            className="flex items-center gap-2 text-gray-600"
          >
            <HiChevronLeft className="text-xl" />
            Back
          </button>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-2xl">
            <HiOutlineX />
          </button>
        </div>
        <div className="flex flex-col gap-4 p-4">
          {/* Show regular categories for all main categories including maincat_id=3 */}
          {activeCategory && categories[activeCategory.id]?.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(activeCategory, category)}
            >
              <div className="font-medium px-4 py-2 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-300 cursor-pointer rounded-lg">
                {category.category_name}
              </div>
            </div>
            
          ))}
        </div>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default Navbar;