import React, { useEffect, useState, useTransition } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlayCircle, Heart, Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, toggleWishlist } from '../rtk/wishlistSlice';
import moreinfo from '../assets/MainCata/more-info.png';
import border_1 from '../assets/MainCata/sinborder.png';
// import { Helmet } from 'react-helmet-async';

const SkeletonCard = () => (
  <div
    className="relative bg-white rounded-lg border border-gray-200 shadow-md p-4 animate-pulse"
    style={{ minHeight: '440px', maxWidth: '590px' }}
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

const WeddingInvitations = ({ heading = 'Invitation Video' }) => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [loadingStates, setLoadingStates] = useState({});
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, videoId: null });
  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.wishlist.items) || [];
  const navigate = useNavigate();
  const baseUrl = 'https://admin.urbantyohar.com/';

  useEffect(() => {
    const fetchVideos = async () => {
      const storedVideos = localStorage.getItem('weddingInvitationsVide');
      const storedTimestamp = localStorage.getItem('weddingInvitationsTimestamp');
      const currentTime = Date.now();
      const refreshInterval = 60 * 60 * 1000;

      if (storedVideos && storedTimestamp && currentTime - storedTimestamp < refreshInterval) {
        setVideos(JSON.parse(storedVideos));
      } else {
        try {
          const response = await axios.post('https://admin.urbantyohar.com/api/home-product', {}, { timeout: 15000 });
          
          if (response.data && Array.isArray(response.data.data)) {
            const videoArray = response.data.data[0].products.slice(0, 10);
            setVideos(videoArray);
            localStorage.setItem('weddingInvitationsVideos', JSON.stringify(videoArray));
            localStorage.setItem('weddingInvitationsTimestamp', currentTime.toString());
          } else {
            setError('Invalid data format received from server');
          }
        } catch (err) {
          setError(err.response 
            ? `Server error: ${err.response.status}` 
            : `Network error: ${err.message || 'Please check your connection and try again'}`);
        }
      }
    };

    fetchVideos();
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleToggleWishlist = async (e, video) => {
    e.preventDefault();
    e.stopPropagation();

    const userToken = localStorage.getItem('user_token');
    if (!userToken) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate('/login');
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [video.id]: true }));
    await dispatch(toggleWishlist(video));
    setLoadingStates((prev) => ({ ...prev, [video.id]: false }));
  };

  if (error) {
    return (
      <div className="bg-white  flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <>
     {/* <Helmet>
  <title>
    {videos?.length > 0 && videos[0]?.title 
      ? `${videos[0].title} | Urban Tyohar`
      : 'Create Beautiful Wedding Invitation Videos | Urban Tyohar'}
  </title>
  <meta
    name="description"
    content={
      videos?.length > 0 && videos[0]?.short_desc
        ? videos[0].short_desc// Limit to recommended length
        : 'Design stunning wedding invitation videos that capture your love story. Personalized, elegant, and shareable digital invitations for your special day.'
    }
  />
</Helmet> */}
    <div className="bg-white min-h-screen px-4">
      <div className="flex items-center justify-center py-0 lg:py-8 sm:py-0 space-x-4">
        <img
          src={border_1}
          alt="left border"
          className="h-12 w-32 sm:w-48 md:w-64 lg:w-80 max-sm:hidden"
        />
     <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-center md:whitespace-nowrap">
  Caricature Wedding <br className="md:hidden" />Invitation Video 
</h1>
        <img
          src={border_1}
          alt="right border"
          className="h-12 w-32 sm:w-48 md:w-64 lg:w-80 max-sm:hidden"
        />
      </div>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-6 justify-items-center">
          {isPending ? (
            <div className="col-span-full flex justify-center items-center px-4 py-12">
              <div className="animate-pulse text-xl">Loading videos...</div>
            </div>
          ) : (
            videos.map((video, index) => (
              
              <Link
                key={video.id || index}
                to={`/invitation-Videos?id=${video.id}/${video.url_name ? video.url_name.replace(/\s+/g, '-') : ''}`}
                className="relative bg-white rounded-lg border-2 border-yellow-200 shadow-md shadow-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer p-4 max-sm:p-1 hover:border-yellow-400 group block"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{ minHeight: '340px', maxWidth: '290px', textDecoration: 'none' }}
              >
                <div className="relative w-full overflow-hidden rounded-lg">
                  <div 
                    className="absolute top-2 right-2 z-30 bg-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer shadow-md"
                    onClick={(e) => handleToggleWishlist(e, video)}
                  >
                    {loadingStates[video.id] ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Heart
                        className={`w-4 h-4 transition-colors duration-300 cursor-pointer ${
                          favoriteItems.some((item) => item.id === video.id)
                            ? 'text-[#FF3D57] fill-current'
                            : 'text-red-500'
                        }`}
                      />
                    )}
                  </div>

                  {video.video_thumbnail ? (
                    <>
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 z-0 rounded-lg"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <PlayCircle className="w-16 h-16 max-sm:w-8 max-sm:h-8 text-white" />
                      </div>
                      <img
                        src={`${baseUrl}/${video.video_thumbnail}`}
                        alt={video.maincat_name || 'Video thumbnail'}
                        className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform duration-300 rounded-lg"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                          e.target.alt = 'Image not available';
                        }}
                      />
                    </>
                  ) : (
                    <div className="w-full bg-gray-200 rounded-lg flex items-center justify-center aspect-video">
                      <span className="text-gray-400">No thumbnail</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-center">
                  <h2 className="font-poppins text-gray-800 text-sm md:text-lg line-clamp-2">
                    {video.title || 'Untitled Video'}
                  </h2>
                  <div className="flex justify-center items-center space-x-2 mt-1">
                    <p className="text-sm md:text-lg text-gray-600 line-through">₹{video.price}</p>
                    <p className="text-base md:text-xl font-bold text-gray-800">₹{video.offer_dis}</p>
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
            ))
          )}
          
          {!isPending && videos.length === 0 && !error && (
            Array(5).fill(0).map((_, index) => <SkeletonCard key={index} />)
          )}
        </div>

        {!isPending && videos.length > 0 && (
          <div className="flex justify-center mt-8">
            <Link
              to="/invitation-Video"
              className="bg-[#4A00FF] text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition-all no-underline"
              onClick={() => window.scrollTo(0, 0)}
            >
              View All
            </Link>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default WeddingInvitations;