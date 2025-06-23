import React, { useEffect, useState, useTransition, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart } from "lucide-react";
import InvideoBanner from "../components/InvideoBanner";
import moreinfo from "../assets/MainCata/more-info.png";

const Stationary = () => {
  const [title, setTitle] = useState("");
  const [stationaryItems, setStationaryItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [favorites, setFavorites] = useState({});
  const baseUrl = "https://admin.urbantyohar.com";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${baseUrl}/api/home-product`, {
          timeout: 10000,
        });
        startTransition(() => {
          if (response.data && Array.isArray(response.data.data)) {
            const section = response.data.data.find((section) => section.id === 3);
            if (section) {
              setTitle(section.title || "Stationary");
              setStationaryItems(section.products || []);
            } else {
              setError("No data found for the Stationary section");
            }
          } else {
            setError("Invalid data format received from server");
          }
        });
      } catch (err) {
        setError(
          err.response
            ? `Server error: ${err.response.status}`
            : "Network error - please check your connection"
        );
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.post(
          `${baseUrl}/api/all-category?maincat_id=3`
        );
        if (response.data && Array.isArray(response.data.data)) {
          const formattedCategories = response.data.data.map((item) => ({
            id: item.id,
            title: item.category_name,
            image: `${baseUrl}/${item.image}`,
          }));
          setCategories(formattedCategories);

          if (formattedCategories.length > 0) {
            fetchSubcategories(formattedCategories[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      }
    };

    fetchData();
    fetchCategories();
  }, []);

  const fetchSubcategories = useCallback(async (category) => {
    setSelectedCategory(category);

    try {
      const response = await axios.post(
        `${baseUrl}/api/category?id=${category.id}`
      );
      if (response.data && response.data.data) {
        const subcategories = response.data.data.subcategories || [];
        setStationaryItems(subcategories.flatMap((subcategory) => subcategory.products));
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
      setError("Failed to load subcategories.");
    }
  }, []);

  const toggleFavorite = (itemId) => {
    setFavorites((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <InvideoBanner mainId={3} />
      <div className="flex justify-center py-8">
        <h1 className="text-3xl font-bold text-center">{title}</h1>
      </div>

      {/* Browse by Category Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Browse by Category
        </h2>
        <div className="flex justify-center space-x-8 overflow-x-auto py-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="text-center cursor-pointer"
              onClick={() => fetchSubcategories(category)}
            >
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg mx-auto">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p
                className={`mt-3 font-medium ${
                  selectedCategory?.id === category.id
                    ? "text-blue-600"
                    : "text-gray-700"
                }`}
              >
                {category.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stationary Items Section */}
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-4 px-2 sm:px-4 md:px-6 justify-items-center">
          {isPending ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="animate-pulse text-xl">Loading stationary items...</div>
            </div>
          ) : (
            stationaryItems.map((item) => (
              <div
                key={item.id}
                className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer p-3 group border-2 border-yellow-200 w-full max-w-[280px] mx-auto"
                style={{ minHeight: "320px" }}
                onClick={() => navigate(`/stationary?id=${item.id}`)}
              >
                <div className="relative w-full overflow-hidden rounded-lg">
                  <div
                    className="absolute top-2 right-2 z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors duration-300 ${
                        favorites[item.id]
                          ? "text-red-500 fill-current"
                          : "text-red-400"
                      }`}
                    />
                  </div>
                  <img
                    src={`${baseUrl}/${item.card_thumbnail}`}
                    alt={item.product_type || "Stationary Item"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                      e.target.alt = "Image not available";
                    }}
                  />
                </div>

                <div className="mt-3 text-center">
                  <h2 className="text-sm font-semibold text-gray-800 line-clamp-2">
                    {item.product_type || "Untitled Item"}
                  </h2>
                  <div className="flex justify-center items-center space-x-2 mt-1">
                    <p className="text-sm text-gray-600 line-through">₹{item.price}</p>
                    <p className="text-sm font-bold text-gray-800">₹{item.offer_dis}</p>
                  </div>
                  <div className="mt-2">
                    <img
                      src={moreinfo}
                      alt="More Info"
                      className="cursor-pointer w-24 h-10 inline-block"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/stationary?id=${item.id}`);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Stationary;