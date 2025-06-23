import { useEffect, useState } from "react";
import axios from "axios";

const ProfileContent = () => {
    const [profileData, setProfileData] = useState(null);
    const [isEditable, setIsEditable] = useState(false);
    const [updatedData, setUpdatedData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getAuthToken = () => {
        return localStorage.getItem("authToken"); // Ensure this matches your token storage key
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = getAuthToken();
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await axios.post(
                "https://admin.urbantyohar.com/api/vender-profile",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    
                    }
                }
            );

            setProfileData(response.data);
            setUpdatedData(response.data);
        } catch (error) {
            console.error("Error fetching profile:", error);
            setError(error.response?.data?.message || error.message);
            // Consider redirect to login if 401 Unauthorized
            if (error.response?.status === 401) {
                window.location.href = "/login";
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleEditMode = () => {
        setIsEditable(!isEditable);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUpdatedData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error("No authentication token found");
            }

            await axios.post(
                "https://admin.urbantyohar.com/api/vender-name-update",
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            // Refresh data after successful update
            await fetchProfile();
            setIsEditable(false);
        } catch (error) {
            console.error("Update error:", error);
            setError(error.response?.data?.message || error.message);
        }
    };

    if (loading) {
        return <p className="text-center p-4">Loading profile...</p>;
    }

    if (error) {
        return (
            <div className="text-center p-4 text-red-500">
                Error: {error}
                <button 
                    onClick={fetchProfile}
                    className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">My Profile</h1>
                <button
                    onClick={toggleEditMode}
                    className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-blue-600 flex items-center"
                >
                    <i className="fas fa-edit mr-2"></i>
                    {isEditable ? 'Cancel Editing' : 'Edit Profile'}
                </button>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-6 mb-6 border border-blue-200">
                <div className="flex items-center gap-4 mb-6">
                    <img 
                        src={profileData.profile_picture || '/default-avatar.png'} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full border-2 border-cyan-400"
                    />
                    <div>
                        <h2 className="text-xl font-semibold">{profileData.name}</h2>
                        <p className="text-gray-600">{profileData.mobile}</p>
                        <p className="text-gray-600">{profileData.email}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {['name', 'mobile', 'email', 'address'].map((field) => (
                        <div key={field} className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id={field}
                                    value={updatedData[field] || ''}
                                    onChange={handleInputChange}
                                    disabled={!isEditable}
                                    className={`w-full p-2 pl-10 border rounded-lg ${
                                        isEditable 
                                            ? 'border-blue-300 focus:ring-2 focus:ring-blue-200' 
                                            : 'border-gray-200 bg-gray-50'
                                    }`}
                                    placeholder={`Enter your ${field}`}
                                />
                                <i className={`fas fa-${
                                    field === 'email' ? 'envelope' :
                                    field === 'mobile' ? 'phone' :
                                    field === 'address' ? 'map-marker' : 'user'
                                } absolute left-3 top-3 text-gray-400`}></i>
                            </div>
                        </div>
                    ))}
                </div>

                {isEditable && (
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileContent;