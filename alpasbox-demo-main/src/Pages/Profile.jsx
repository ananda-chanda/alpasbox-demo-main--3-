import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Save, X } from "lucide-react";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});
  const navigate = useNavigate();

  // List of Indian states
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    
   
    
   
   
 
    if (!token) {
      alert("You are not authorized. Please log in.");
      navigate("/login");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await fetch("https://admin.urbantyohar.com/api/user-data", {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserDetails(data);
          setEditedDetails(data.data);
          if (data.data.image) {
            const imageUrl = `https://admin.urbantyohar.com/${data.data.image}`;
            setProfileImage(imageUrl);
            localStorage.setItem("profile_image", imageUrl);
          }
        } else {
          alert("Failed to fetch user details.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        alert("An error occurred while fetching user details.");
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_details");
    localStorage.removeItem("profile_image");
    navigate("/login");
  };

  const handleProfileImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const token = localStorage.getItem("user_token");
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch("https://admin.urbantyohar.com/api/user-image-update", {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Image update response:", data);

          // Fetch updated user details
          const userResponse = await fetch("https://admin.urbantyohar.com/api/user-data", {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUserDetails(userData);
            setEditedDetails(userData.data);
            if (userData.data.image) {
              const imageUrl = `https://admin.urbantyohar.com/${userData.data.image}`;
              setProfileImage(imageUrl);
              localStorage.setItem("profile_image", imageUrl);
              alert("Profile image updated successfully!");
            }
          }
        } else {
          alert("Failed to update profile image.");
        }
      } catch (error) {
        console.error("Error updating profile image:", error);
        alert("An error occurred while updating profile image.");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("user_token");
    try {
      const response = await fetch("https://admin.urbantyohar.com/api/user-name-update", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedDetails)
      });

      if (response.ok) {
        setUserDetails({ data: editedDetails });
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating profile.");
    }
  };

  return (
    <div className="font-sans m-0 p-0 min-h-screen py-12 px-4 mt-8">
      <div className="max-w-3xl mx-auto my-5 p-5 border border-gray-300 rounded-lg bg-white shadow-md" style={{ border: '2px solid #f1c40f' }}>
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl m-0">My Profile</h1>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-gray-100 border border-gray-300 rounded px-3 py-1 text-gray-700"
            >
              Edit
            </button>
          ) : null}
        </div>
        
        <div className="flex flex-col md:flex-row items-center border-2 border-blue-400 rounded-lg p-5 mb-5">
          <div className="relative mb-4 md:mb-0">
            <div className="w-24 h-24 md:w-20 md:h-20 mx-auto md:mx-0">
              <img 
                className="rounded-full w-full h-full object-cover border-2 border-blue-400" 
                src={profileImage || (userDetails?.data?.image ? `https://admin.urbantyohar.com/${userDetails.data.image}` : "/api/placeholder/100/100")} 
                alt="Profile" 
              />
              <div className="absolute bottom-1 right-7  transform translate-x-1/2 translate-y-1/2 bg-black text-white rounded-full p-1 cursor-pointer">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                  <Camera size={16} />
                </label>
              </div>
            </div>
          </div>
          
          {userDetails && (
            <div className="flex-grow text-center md:text-left md:ml-5">
              <h2 className="text-xl md:text-lg m-0">{userDetails.data.name || 'Not provided'}</h2>
              <p className="my-2 md:my-1 text-gray-600">{userDetails.data.mobile || 'Not provided'}</p>
              <p className="my-2 md:my-1 text-gray-600">{userDetails.data.email || 'Not provided'}</p>
            </div>
          )}
        </div>
        
        {userDetails && (
          <div className="border-2 border-blue-400 rounded-lg p-5">
            {isEditing ? (
              <>
                <div className="mb-4">
                  <label className="block font-bold mb-1" htmlFor="name">Name</label>
                  <input 
                    id="name" 
                    name="name"
                    type="text" 
                    value={editedDetails.name || ''} 
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block font-bold mb-1" htmlFor="email">Email</label>
                  <input 
                    id="email" 
                    name="email"
                    type="email" 
                    value={editedDetails.email || ''} 
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block font-bold mb-1" htmlFor="mobile">Mobile No.</label>
                  <input 
                    id="mobile" 
                    name="mobile"
                    type="tel" 
                    value={editedDetails.mobile || ''} 
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block font-bold mb-1" htmlFor="address">State</label>
                  <select
                    id="address"
                    name="address"
                    value={editedDetails.address || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                  >
                    <option value="">Select State</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={handleSave}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block font-bold mb-1" htmlFor="name">Name</label>
                  <input 
                    id="name" 
                    readOnly 
                    type="text" 
                    value={userDetails.data.name || 'Not provided'} 
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block font-bold mb-1" htmlFor="email">Email</label>
                  <input 
                    id="email" 
                    readOnly 
                    type="text" 
                    value={userDetails.data.email || 'Not provided'} 
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block font-bold mb-1" htmlFor="mobile">Mobile No.</label>
                  <input 
                    id="mobile" 
                    readOnly 
                    type="text" 
                    value={userDetails.data.mobile || 'Not provided'} 
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block font-bold mb-1" htmlFor="address">State</label>
                  <input 
                    id="address" 
                    readOnly 
                    type="text" 
                    value={userDetails.data.address || 'Not provided'} 
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                  />
                </div>
              </>
            )}
            
            <div className="mt-8">
              <button
                onClick={handleLogout}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;