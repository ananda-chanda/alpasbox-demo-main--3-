import React, { useEffect, useState, useTransition } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moreinfo from '../assets/MainCata/more-info.png';
import hborder from '../assets/MainCata/sinborder.png';
import { Heart, Loader } from 'lucide-react'; // Updated import
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, toggleWishlist } from '../rtk/wishlistSlice';
import MainLoader from './Loader'; // Renamed to avoid conflict

const WeddingInvitation = () => {
  const [title, setTitle] = useState('');
  const [carts, setCarts] = useState([]);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({});
  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.wishlist.items) || [];
  const navigate = useNavigate();
  const baseUrl = 'https://admin.urbantyohar.com';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const storedData = localStorage.getItem('weddingInvitationData');
      const storedTimestamp = localStorage.getItem('weddingInvitationTimestamp');
      const currentTime = Date.now();
      const refreshInterval = 5 * 60 * 1000;

      if (storedData && storedTimestamp && currentTime - storedTimestamp < refreshInterval) {
        const parsedData = JSON.parse(storedData);
        setTitle(parsedData.title || 'Invitation Card Section');
        setCarts(parsedData.carts || []);
        console.log('Data loaded from localStorage');
        setLoading(false);
      } else {
        try {
          const response = await axios.post(`${baseUrl}/api/home-product`, {
            timeout: 10000,
          });
          startTransition(() => {
            if (response.data && Array.isArray(response.data.data)) {
              setTitle(response.data.title || 'Invitation Card Section');
              const cartArray = Array.from(response.data.data[1]?.products || []);
              setCarts(cartArray);

              const dataToStore = {
                title: response.data.title,
                carts: cartArray,
              };
              localStorage.setItem('weddingInvitationData', JSON.stringify(dataToStore));
              localStorage.setItem('weddingInvitationTimestamp', currentTime.toString());
              setLoading(false);
            } else {
              setError('Invalid data format received from server');
              setLoading(false);
            }
          });
        } catch (err) {
          setError(
            err.response
              ? `Server error: ${err.response.status}`
              : 'Wait a few seconds - please check your connection'
          );
          setLoading(false);
        }
      }
    };

    fetchData();
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleToggleWishlist = async (e, cart) => {
    e.preventDefault();
    e.stopPropagation();

    const userToken = localStorage.getItem('user_token');
    if (!userToken) {
      window.scrollTo(0, 0);
      navigate('/login');
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [cart.id]: true }));
    await dispatch(toggleWishlist(cart));
    setLoadingStates((prev) => ({ ...prev, [cart.id]: false }));
  };

  if (error) {
    return (
      <div className="bg-white-100 min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white ">
      {loading ? (
        <MainLoader />
      ) : (
        <>
          <div className="flex items-center justify-center pt-8 space-x-4">
            <img
              src={hborder}
              alt="left border"
              className="h-12 w-32 sm:w-48 md:w-64 lg:w-80 max-sm:hidden"
            />
           <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-center md:whitespace-nowrap px-4 leading-tight">
  Invitation Card Design <br className="sm:hidden" />& Printing Services
</h1>
            <img
              src={hborder}
              alt="right border"
              className="h-12 w-32 sm:w-48 md:w-64 lg:w-80 max-sm:hidden"
            />
          </div>

          <div className="container mx-auto py-8 px-3">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
              {isPending ? (
                <div className="col-span-full flex justify-center items-center py-12">
                  <div className="animate-pulse text-xl">Loading cards...</div>
                </div>
              ) : (
                carts.slice(0, 4).map((cart, index) => (
                  <Link
                    key={cart.id || index}
                    to={`/single-cart?id=${cart.id}/${cart.url_name ? cart.url_name.replace(/\s+/g, '-') : ''}`}
                    className="relative bg-white rounded-lg border-2 border-yellow-200 shadow-md shadow-gray-300 transition-shadow duration-300 cursor-pointer p-4 block"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    style={{ minHeight: '240px', maxWidth: '340px', textDecoration: 'none' }}
                  >
                    <div className="relative w-full overflow-hidden rounded-lg">
                      <div 
                        className="absolute top-2 right-2 z-20 bg-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                        onClick={(e) => e.preventDefault()}
                      >
                        {loadingStates[cart.id] ? (
                          <Loader className="w-4 h-4 text-red-500 animate-spin" />
                        ) : (
                          <Heart
                            className={`w-4 h-4 ${
                              favoriteItems.some((item) => item.id === cart.id)
                                ? 'text-red-500 fill-current'
                                : 'text-red-500'
                            }`}
                            onClick={(e) => handleToggleWishlist(e, cart)}
                          />
                        )}
                      </div>
                      {cart.card_thumbnail ? (
                        <img
                          src={`${baseUrl}/${cart.card_thumbnail}`}
                          alt={cart.maincat_name || 'Card thumbnail'}
                          className="w-[400px]  h-[180px] md:h-[440px]   md:object-cover p-1 hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                            e.target.alt = 'Image not available';
                          }}
                        />
                      ) : (
                        <div className="w-full bg-gray-200 rounded-lg flex items-center justify-center aspect-video">
                          <span className="text-gray-400">No thumbnail</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 text-center">
                      <h2 className="font-poppins text-gray-800 text-lg line-clamp-2">
                        {cart.title || 'Untitled Card'}
                      </h2>
                      <div className="flex flex-col justify-between items-center mb-0 mt-3">
                        <div className="flex items-center">
                          <span className="text-gray-600 line-through text-md mr-2">₹{cart.price}</span>
                          <span className="text-xl font-bold text-gray-800">₹{cart.offer_dis}</span>
                          {/* {cart.price && cart.offer_dis && (
                            <span className="text-xs text-green-600 px-3">
                              ({Math.round((1 - cart.offer_dis / cart.price) * 100)}% off)
                            </span>
                          )} */}
                        </div>
                      </div>
                    </div>
                    <div className="relative text-center flex justify-center items-center mt-1">
                      <img
                        src={moreinfo}
                        alt="More Info"
                        className="cursor-pointer hover:scale-110 transition-transform duration-300"
                        style={{ maxWidth: '130px' }}
                      />
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                to="/all-cards"
                className="px-6 py-2 bg-[#4A00FF] text-white text-lg font-medium rounded-md hover:bg-blue-700 transition-colors no-underline"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                View All
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WeddingInvitation;