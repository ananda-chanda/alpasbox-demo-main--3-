import logo from '../assets/Navbar/Logo.png';
export const RAZORPAY_CONFIG = {
    key_id: "rzp_live_NVkJ71N4zc5xtT",
    // key_id: "rzp_test_L5X7LvDPVVVaE2",
    currency: "INR",
    name: "Urban Tyohar",
    image: logo, 
    description: "Product Purchase",
    theme: {
        color: "#3399cc"
    }
};

export const API_URLS = {
    createOrder: 'https://admin.urbantyohar.com/api/create-order',
    verifyPayment: 'https://admin.urbantyohar.com/api/verify-payment'
};