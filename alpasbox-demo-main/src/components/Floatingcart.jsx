import React, { useState, useEffect } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../rtk/cartSlice';

const Floatingcart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items) || [];

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCartClick = (e) => {
    e.preventDefault();
    setIsOpen(true);
  };

  const CartSidebar = () => (
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
          <h2 className="text-xl font-semibold">Shopping Cart ({totalItems})</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-10rem)] p-4">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 mb-4 p-3 border rounded-lg">
                <img
                   src={`https://admin.urbantyohar.com/${item.card_thumbnail || item.video_thumbnail}`}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">Quantity: {item.quantity}</p>
                  <p className="text-[#4A00FF] font-semibold mt-1">Rs. {item.price}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 mt-8">
              Your cart is empty
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4  border-t bg-white">
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold">
                Rs. {cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
              </span>
            </div>
            <button 
              onClick={() => navigate('/cart-item')}
              className="w-full bg-[#4A00FF] text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Cart
            </button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <div
        onClick={handleCartClick}
        className="fixed bottom-16 right-8 cursor-pointer transform hover:scale-110 transition-all duration-700 animate-bounce"
      >
        <div className="bg-[#4A00FF] p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
          <ShoppingCart className="h-6 w-6 text-white" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
      </div>
      
      <CartSidebar />
    </>
  );
};

export default Floatingcart;