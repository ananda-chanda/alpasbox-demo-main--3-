import React, { useState, useEffect } from 'react';
import { Play, Download, Heart, Star, Phone, Mail, MessageCircle, Facebook, Youtube, Instagram, PlayCircle, Loader } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, toggleWishlist } from '../rtk/wishlistSlice';
import { Helmet } from 'react-helmet-async';
import moreinfo from '../assets/MainCata/more-info.png';
import border_1 from '../assets/MainCata/sinborder.png';
import animationData from '../assets/contactus/ContactUs.json';
import Lottie from 'react-lottie';
import ail from '../assets/all_icon/Mail.png';
import wp from '../assets/all_icon/Chat.png';
import call from '../assets/contactus/Call.png';


const SkeletonCard = () => (
  <div
    className="relative bg-white rounded-lg border border-gray-200 shadow-md p-4 animate-pulse font-poppins"
    style={{ minHeight: '340px', maxWidth: '290px' }}
  >
    <div className="relative w-full aspect-video bg-gray-200 rounded-lg mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-4/5 mx-auto"></div>
      <div className="flex justify-center items-center space-x-2">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  </div>
);

const WeddingInvitationLanding = () => {
  const { id, meta_url } = useParams();
  const [landingData, setLandingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.wishlist?.items) || [];
  const navigate = useNavigate();
  const baseUrl = 'https://admin.urbantyohar.com/';
  
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  {landingData?.meta_url && (
  <div className="text-center text-sm text-gray-500 mt-2">
    {landingData.meta_url}
  </div>
)}

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://admin.urbantyohar.com/api/landing-page', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: id || 1 ,
             meta_url: meta_url // Use the ID from URL params or default to 1
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setLandingData(data.data); // Access the data property from the response
        console.log('Landing page data:', data.data);
      } catch (err) {
        console.error('Error fetching landing page data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
    dispatch?.(fetchWishlist?.());
  }, [dispatch, id]);

  const handleToggleWishlist = async (e, template) => {
    e.preventDefault();
    e.stopPropagation();

    const userToken = localStorage.getItem('user_token');
    if (!userToken) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate('/login');
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [template.id]: true }));
    await dispatch(toggleWishlist(template));
    setLoadingStates((prev) => ({ ...prev, [template.id]: false }));
  };

  // Parse the sub_desc JSON string if it exists
  const subDescriptions = landingData?.sub_desc ? JSON.parse(landingData.sub_desc) : [];

  // Helper function to extract h3 content from sub_desc
  const getSubDescTitle = () => {
    if (subDescriptions.length > 0) {
      const firstSection = subDescriptions[0];
      const h3Match = firstSection.sub_desc.match(/<h3[^>]*>(.*?)<\/h3>/i);
      if (h3Match) {
        return h3Match[1].replace(/&nbsp;/g, ' ').trim();
      }
    }
    return 'Caricature Wedding';
  };

  // Helper function to remove h3 tags from content
  const removeH3FromContent = (htmlContent) => {
    return htmlContent.replace(/<h3[^>]*>.*?<\/h3>/gi, '').trim();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-poppins">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wedding templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-poppins">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading data: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Meta tags using React Helmet */}
      <Helmet>
        <title>{landingData?.meta_title || 'Wedding Invitation - Urban Tyohar'}</title>
        <meta name="description" content={landingData?.meta_desc || 'Discover beautiful wedding invitations at Urban Tyohar'} />
        {landingData?.meta_keyword && <meta name="keywords" content={landingData.meta_keyword} />}
        <link rel="canonical" href={`${window.location.origin}/landing/${id || 1}/${landingData?.meta_url || ''}`} />
        <meta property="og:title" content={landingData?.meta_title || 'Wedding Invitation - Urban Tyohar'} />
        <meta property="og:description" content={landingData?.meta_desc || 'Discover beautiful wedding invitations at Urban Tyohar'} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-white font-poppins mt-16 md:mt-0">
        {landingData?.banner && (
          <div className="relative">
            <img 
              src={`https://admin.urbantyohar.com/${landingData.banner}`}
              alt="Banner"
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-8xl mx-auto px-4 md:px-6 py-8 md:py-4">
          {/* Title Section with Heart Divider */}
          <div className="flex items-center justify-center py-0 lg:py-8 sm:py-0">
            <div className="flex flex-wrap items-center justify-center">
              {/* <div className="h-px bg-yellow-400 w-8 md:w-16 hidden md:block"></div>
              <Heart className="mx-2 md:mx-4 text-yellow-500" size={18} /> */}
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-center md:whitespace-nowrap font-poppins px-1 md:px-2">
                {landingData?.title || 'Caricature Wedding'} <br className="md:hidden" />
              </h1>
              {/* <Heart className="mx-2 md:mx-4 text-yellow-500" size={18} />
              <div className="h-px bg-yellow-400 w-8 md:w-16 hidden md:block"></div> */}
            </div>
          </div>

          <div className="text-start my-2">
            <div className="text-gray-600 max-w-6xl mx-auto font-poppins">
              <div dangerouslySetInnerHTML={{ 
                __html: landingData?.desc || 'At Urban Tyohar, we believe that every special occasion deserves to be celebrated in style...' 
              }} />
            </div>
          </div>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center my-12">
            <div className="flex items-center">
              <img
                src={border_1}
                alt="left border"
                className="h-12 w-32 sm:w-48 md:w-64 lg:w-80 max-sm:hidden"
              />
              <span className="text-xl md:text-2xl lg:text-3xl font-bold text-center md:whitespace-nowrap font-poppins">
                {landingData?.product_head || 'Caricature Wedding Sample'}
              </span>
              <img
                src={border_1}
                alt="right border"
                className="h-12 w-32 sm:w-48 md:w-64 lg:w-80 max-sm:hidden"
              />
            </div>
          </div>

          {/* Template Grid - Updated Style */}
          <div className="container mx-auto py-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-6 justify-items-center">
              {landingData?.product && landingData.product.length > 0 ? 
                landingData.product.map((template, index) => (
                  <Link
                    key={template.id || index}
                    to={`/invitation-Videos?id=${template.id}/${template.url_name ? template.url_name.replace(/\s+/g, '-') : ''}`}
                    className="relative bg-white rounded-lg border-2 border-yellow-200 shadow-md shadow-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer p-4 max-sm:p-1 hover:border-yellow-400 group block font-poppins"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    style={{ minHeight: '340px', maxWidth: '290px', textDecoration: 'none' }}
                  >
                    <div className="relative w-full overflow-hidden rounded-lg">
                      <div 
                        className="absolute top-2 right-2 z-20 bg-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer shadow-md"
                        onClick={(e) => e.preventDefault()}
                      >
                        {loadingStates[template.id] ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Heart
                            className={`w-4 h-4 transition-colors duration-300 cursor-pointer ${
                              favoriteItems && favoriteItems.some((item) => item.id === template.id)
                                ? 'text-[#FF3D57] fill-current'
                                : 'text-red-500'
                            }`}
                            onClick={(e) => handleToggleWishlist?.(e, template)}
                          />
                        )}
                      </div>

                      {template.video_thumbnail ? (
                        <>
                          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 z-0 rounded-lg"></div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                            <PlayCircle className="w-16 h-16 max-sm:w-8 max-sm:h-8 text-white" />
                          </div>
                          <img
                            src={`${baseUrl}${template.video_thumbnail}`}
                            alt={template.title || 'Video thumbnail'}
                            className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform duration-300 rounded-lg"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=300&h=600&fit=crop';
                              e.target.alt = 'Image not available';
                            }}
                          />
                        </>
                      ) : (
                        <div className="w-full bg-gray-200 rounded-lg flex items-center justify-center aspect-video">
                          <span className="text-gray-400 font-poppins">No thumbnail</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 text-center">
                      <h2 className="font-poppins text-gray-800 text-sm md:text-lg line-clamp-2">
                        {template.title || 'Wedding Invitation Template'}
                      </h2>
                      <div className="flex justify-center items-center space-x-2 mt-1 font-poppins">
                        <p className="text-sm md:text-lg text-gray-600 line-through">₹{template.price}</p>
                        <p className="text-base md:text-xl font-bold text-gray-800">₹{template.offer_dis}</p>
                      </div>
                    </div>

                    <div className="relative text-center flex justify-center items-center mt-4">
                      <img
                        src={moreinfo}
                        alt="More Info"
                        className="cursor-pointer hover:scale-110 transition-transform duration-300 max-w-[90px] sm:max-w-[120px]"
                      />
                    </div>
                  </Link>
                )) : 
                // Fallback templates if API data is not available
                Array(5).fill(0).map((_, index) => <SkeletonCard key={index} />)
              }
            </div>

            {landingData?.product && landingData.product.length > 0 && (
              <div className="flex justify-center mt-8">
                <Link
                  to="/invitation-Video"
                  className="bg-[#4A00FF] text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition-all no-underline font-poppins"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Load more
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center py-0 lg:py-2 sm:py-0 space-x-4">
            <img
              src={border_1}
              alt="left border"
              className="h-12 w-32 sm:w-48 md:w-64 lg:w-80 max-sm:hidden"
            />
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-center md:whitespace-nowrap font-poppins">
              {getSubDescTitle()}
            </h1>
            <img
              src={border_1}
              alt="right border"
              className="h-12 w-32 sm:w-48 md:w-64 lg:w-80 max-sm:hidden"
            />
          </div>

          {/* Content Sections from sub_desc */}
          {subDescriptions.length > 0 && subDescriptions.map((section, index) => (
            <div key={index} className="text-start mb-4">
              <div className="text-gray-600 max-w-6xl mx-auto font-poppins">
                <div dangerouslySetInnerHTML={{ __html: removeH3FromContent(section.sub_desc) }} />
              </div>
            </div>
          ))}

          {/* Questions Section - Contact Info */}
          <section className="py-12 font-poppins">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-xl p-10 w-full max-w-full flex flex-col md:flex-row items-center">
                {/* Lottie Animation Section */}
                <div className="md:w-1/2 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-100 rounded-xl blur-lg opacity-30"></div>
                    <div className="relative max-md:w-64 max-md:h-64 h-96 w-80 rounded-xl">
                      <Lottie 
                        options={defaultOptions}
                        isClickToPauseDisabled={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Text Section */}
                <div className="md:w-1/2 mb-8 md:mb-0 md:mr-8 text-center flex flex-col">
                  <h1 className="text-5xl text-black font-poppins text-center tracking-wide mb-4 w-fit">
                    Have Questions?
                  </h1>
                  <p className="w-fit text-justify tracking-wide leading-loose">
                    We have all the time in the world to answer.<br />
                    Just connect with us. We will connect with you in a second.<br />
                    That's our word. Use WhatsApp, Call us, or Mail us.<br />
                    The options are unlimited.
                  </p>
                  <div className="flex gap-5 mt-5 justify-start">
                    <a href="mailto:support@urbantyohar.com" className="w-14 h-13">
                      <img src={ail} alt="Mail Icon" className="w-14 h-13" />
                    </a>
                    <a href="https://wa.me/917983772927" className="w-14 h-13" target="_blank" rel="noopener noreferrer">
                      <img src={wp} alt="WhatsApp Icon" className="w-14 h-13" />
                    </a>
                    <a href="tel:+917983772927" className="w-14 h-13">
                      <img src={call} alt="Contact Icon" className="w-14 h-13" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default WeddingInvitationLanding;