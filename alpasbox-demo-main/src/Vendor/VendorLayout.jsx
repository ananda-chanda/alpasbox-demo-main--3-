import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import axios from 'axios';
import VendorLogo from '../assets/Vendor/VendorLogo.png';
import Utlogo from '../assets/Navbar/Utlogo.png';

const VendorLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    
    useEffect(() => {
        if (location.pathname === '/vendor-desh') {
            navigate('/vendor-desh/profile');
        }
    }, [location.pathname, navigate]);

    const navItems = [
        { id: 'profile', label: 'My Profile', icon: 'fa-user', path: '/vendor-desh/profile' },
        { id: 'plan', label: 'My Plan', icon: 'fa-clipboard-list', path: '/vendor-desh/plan' },
        { id: 'videoCoin', label: 'Video Coin', icon: 'fa-video', path: '/vendor-desh/video-coin' },
        { id: 'download', label: 'Download', icon: 'fa-download', path: '/vendor-desh/download' },
        { id: 'gst', label: 'GST Update', icon: 'fa-file-invoice', path: '/vendor-desh/gst' }
    ];

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            const authToken = localStorage.getItem("vendor_token");
            
            await axios.post('https://admin.urbantyohar.com/api/vender-logout', {}, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    Accept: 'application/json'
                }
            });

            localStorage.removeItem("vendor_token");
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
            localStorage.removeItem("vendor_token");
            navigate('/login');
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="font-['Roboto'] m-0 p-0 box-border bg-white mt-14 mb-4 rounded-[10px] mx-24">
            <div className="flex min-h-screen px-6 gap-4">
                {/* Sidebar */}
                <div className="w-[200px] mt-10 bg-white border-2 border-yellow-400 rounded-l-[15px] p-4 shadow-[0_0_8px_rgba(0,0,0,0.1)] flex flex-col justify-between">
                    <div>
                        <img src={VendorLogo} alt="Pro Vendor Logo" className="w-[80px] mb-4 mx-auto" />
                        <h2 className="text-xl mb-6 font-poppins font-semibold text-center">Pro Vendor</h2>
                        <ul className="list-none p-0">
                            {navItems.map(item => (
                                <li key={item.id} className="mb-4 font-sans font-light">
                                    <button
                                        onClick={() => navigate(item.path)}
                                        className={`w-full text-left no-underline text-black text-lg flex items-center p-[8px_12px] rounded ${location.pathname === item.path ? 'bg-[#4a00e0] text-white' : ''}`}
                                    >
                                        <i className={`fas ${item.icon} mr-[8px]`}></i>
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                            
                            {/* Logout Button */}
                            <li className="mt-4 font-poppins font-light flex justify-center">
                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="w-2/3 flex items-center justify-center gap-2 text-lg p-[6px_10px] rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                    {isLoggingOut ? (
                                        <span>Logging out...</span>
                                    ) : (
                                        <>
                                            <i className="fas fa-sign-out-alt"></i>
                                            <span>Logout</span>
                                        </>
                                    )}
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className="relative bottom-8">
                        <img src={Utlogo} alt="Urban Tyohar Logo" className="w-[90px] mx-auto" />
                        <p className='font-poppins text-center'>URBAN TYOHAR</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 border-2 border-yellow-400 mt-10 flex flex-col shadow-lg rounded-r-[15px]">
                    <Outlet /> 
                </div>
            </div>
        </div>
    );
};

export default VendorLayout;