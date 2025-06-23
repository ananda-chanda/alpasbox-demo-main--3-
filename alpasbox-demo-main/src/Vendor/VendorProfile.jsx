import React, { useState, useEffect } from 'react';
import Camera from '../assets/Vendor/Camera.png';
import axios from 'axios';

const VendorProfile = () => {
    const [profileData, setProfileData] = useState({
        name: '',
        mobile: '',
        email: '',
        address: '',
        image: ''
    });
    const [isEditable, setIsEditable] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('vendor_token');
            if (!token) {
                setError('Please login to access profile');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.post('https://admin.urbantyohar.com/api/vender-profile', {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.data && response.data.data) {
                    setProfileData({
                        name: response.data.data.name || '',
                        mobile: response.data.data.mobile || '',
                        email: response.data.data.email || '',
                        address: response.data.data.address || '',
                        image: response.data.data.image || ''
                    });
                }
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch profile data');
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [profileData.image]);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            const token = localStorage.getItem('vendor_token');
            if (!token) {
                setError('Please login to update profile image');
                return;
            }

            try {
                const response = await axios.post('https://admin.urbantyohar.com/api/vender-image-update', formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setProfileData(prevState => ({
                    ...prevState,
                    image: response.data.data?.image
                }));
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to update profile image');
                console.error('Error updating profile image:', err);
            }
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setProfileData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const toggleEditMode = () => {
        setIsEditable(!isEditable);
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('vendor_token');
        if (!token) {
            setError('Please login to update profile');
            return;
        }

        try {
            await axios.post('https://admin.urbantyohar.com/api/vender-name-update', {
                name: profileData.name,
                email: profileData.email,
                address: profileData.address
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setIsEditable(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
            console.error('Error updating profile:', err);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-6">{error}</div>;
    }

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold">My Profile</h1>
                <div
                    onClick={toggleEditMode}
                    className="bg-[#f0f0f0] p-[8px_15px] rounded cursor-pointer flex items-center text-blue-400"
                >
                    <i className="fas fa-edit mr-[5px]"></i>
                    {isEditable ? 'Cancel' : 'Edit'}
                </div>
            </div>

            {/* Profile Image and Info Section */}
            <div className="flex items-center p-2 rounded-[8px] mb-6 border-2 border-blue-300">
                <div className='flex gap-3'>
                    <div className="relative">
                        <img
                            src={`https://admin.urbantyohar.com/${profileData.image}` || "https://superlawyer.in/wp-content/uploads/2023/10/Raghav-DP-2-croped.jpg"}
                            alt="Profile Picture"
                            className="w-[100px] h-[100px] rounded-full border-[2px] border-[#00e0e0] mr-6"
                        />
                        <label htmlFor="profile-pic" className="absolute bottom-0 right-[25px] bg-black text-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
                            <img src={Camera} alt="Camera Icon" />
                        </label>
                        <input
                            type="file"
                            id="profile-pic"
                            accept="image/*"
                            capture="user"
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-bold m-0">{profileData.name}</h2>
                        <p className="my-[3px] text-[#666]">{profileData.mobile}</p>
                        <p className="my-[3px] text-[#666]">{profileData.email}</p>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className='border-2 border-blue-300 rounded-[8px]'>
                <form className="p-5 space-y-4">
                    <div className="mb-4">
                        <label className="block font-medium mb-2" htmlFor="name">Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                id="name"
                                placeholder="Your Name"
                                value={profileData.name}
                                onChange={handleInputChange}
                                disabled={!isEditable}
                                className="w-full p-2 pl-8 border border-[#e0e0e0] rounded-md"
                            />
                            <i className="fas fa-user absolute top-1/2 left-3 -translate-y-1/2 text-red-500"></i>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block font-medium mb-2" htmlFor="mobile">Mobile No.</label>
                        <div className="relative">
                            <input
                                type="text"
                                id="mobile"
                                placeholder="Enter your number"
                                value={profileData.mobile}
                                disabled
                                className="w-full p-2 pl-8 border border-[#e0e0e0] rounded-md"
                            />
                            <i className="fas fa-phone absolute top-1/2 left-3 -translate-y-1/2 text-red-500"></i>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block font-medium mb-2" htmlFor="email">Mail ID</label>
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your mail ID"
                                value={profileData.email}
                                onChange={handleInputChange}
                                disabled={!isEditable}
                                className="w-full p-2 pl-8 border border-[#e0e0e0] rounded-md"
                            />
                            <i className="fas fa-envelope absolute top-1/2 left-3 -translate-y-1/2 text-red-500"></i>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block font-medium mb-2" htmlFor="address">Address</label>
                        <div className="relative">
                            <input
                                type="text"
                                id="address"
                                placeholder="Write address"
                                value={profileData.address}
                                onChange={handleInputChange}
                                disabled={!isEditable}
                                className="w-full p-2 pl-8 border border-[#e0e0e0] rounded-md"
                            />
                            <i className="fas fa-info-circle absolute top-1/2 left-3 -translate-y-1/2 text-red-500"></i>
                        </div>
                    </div>
                </form>
            </div>

            {/* Submit Button */}
            {isEditable && (
                <div className="flex justify-center mt-4">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-[#00e000] text-white p-2 border-none rounded-md cursor-pointer text-base w-32"
                    >
                        Submit
                    </button>
                </div>
            )}
        </>
    );
};

export default VendorProfile;