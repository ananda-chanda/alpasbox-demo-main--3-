import React, { useState, useEffect } from 'react';
import { Heart, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, toggleWishlist } from '../rtk/wishlistSlice';

const Floatinglist = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.wishlist?.items) || [];

  // Fetch wishlist items on component mount
  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleFavoritesClick = (e) => {
    e.preventDefault();
    setIsOpen(true);
  };

  const handleToggleWishlist = (e, item) => {
    e.stopPropagation(); // Prevent navigation when clicking the heart button
    dispatch(toggleWishlist(item));
  };

  const navigateToProduct = (item) => {
    const formattedUrlName = item.url_name ? item.url_name.replace(/\s+/g, '-') : '';
    navigate(`/invitation-Videos?id=${item.id}/${formattedUrlName}`);
    setIsOpen(false); // Close the sidebar after navigation
  };

  const FavoritesSidebar = () => (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-60"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-60 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Favorites ({favoriteItems.length})</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-10rem)] p-4">
          {favoriteItems.length > 0 ? (
            favoriteItems.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center gap-4 mb-4 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => navigateToProduct(item)}
              >
                <img
                  src={`https://admin.urbantyohar.com/${item.card_thumbnail || item.video_thumbnail}`}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.title}</h3>
                  <div>
                  <span className="text-gray-500 font-semibold mt-1 line-through">Rs. {item.price}</span>
                  <span className='text-black font-semibold mt-1'> Rs {item.offer_dis}</span>
                  </div>
                  
                </div>
                <button
                  onClick={(e) => handleToggleWishlist(e, item)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 mt-8">
              Your favorites list is empty
            </div>
          )}
        </div>

        {favoriteItems.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
            <button 
              onClick={() => {
                navigate('/');
                setIsOpen(false);
              }}
              className="w-full bg-[#4A00FF] text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Favorites
            </button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <div
        onClick={handleFavoritesClick}
        className="fixed bottom-32 right-8 cursor-pointer transform hover:scale-110 transition-all duration-700 animate-bounce"
      >
        <div className="bg-[#4A00FF] p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
          <Heart className="h-6 w-6 text-white" />
          {favoriteItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
              {favoriteItems.length}
            </span>
          )}
        </div>
      </div>
      
      <FavoritesSidebar />
    </>
  );
};

export default Floatinglist;