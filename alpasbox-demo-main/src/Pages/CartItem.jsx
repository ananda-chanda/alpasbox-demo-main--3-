import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, addToCart, updateCart, removeFromCart } from '../rtk/cartSlice';

const CartItem = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items) || [];

  // Fetch cart items on component mount
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Add item to cart
  const handleAddToCart = (item) => {
    dispatch(addToCart(item.id));
  };

  // Handle quantity change
  const handleQuantityChange = (itemId, operation) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item) {
      const newQuantity = operation === 'increase' ? item.quantity + 1 : item.quantity - 1;
      if (newQuantity > 1) {
        dispatch(updateCart({ cartId: item.id, quantity: newQuantity }));
      } else {
        dispatch(removeFromCart(item.id));
      }
    }
  };

  // Remove item from cart
  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
  };
  return (
    <div className="container mx-auto px-4 py-20 ">
      <div className="cart-section bg-white rounded-lg shadow-lg p-6">
        <div className="cart-header border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 ">Your Cart</h2>
        </div>
        <div className="cart-items space-y-6">
          {cartItems.filter(item => item.quantity > 0).length > 0 ? (
            cartItems.filter(item => item.quantity > 0).map((item) => (
              <div key={item.id} className="cart-item flex items-center border-b pb-4">
                <img
                src={`https://admin.urbantyohar.com/${item.card_thumbnail || item.video_thumbnail}`}
                
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="ml-6 flex-grow">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-gray-600 mt-1">{item.short_desc}</p>
                  <div className="mt-2">
                    <span className="font-bold text-gray-800">Rs. {item.price}</span>
                  </div>
                </div>
                <div className="cart-item-quantity flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(item.id, 'decrease')}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    -
                  </button>
                  <span className="font-medium text-lg">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, 'increase')}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">Your cart is empty. Add items to the cart!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;