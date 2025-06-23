import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setQuery(e.target.value.trimStart());
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
  };

  const handleSearch = async () => {
    if (query.trim() === '') return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `https://admin.urbantyohar.com/api/search?tag=${query}`
      );
      console.log('API Response:', response.data);
      setResults(response.data.data.slice(0, 5) || []);
    } catch (err) {
      setError('An error occurred while searching. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query.trim() !== '') {
      handleSearch();
    } else {
      setResults([]);
    }
  }, [query]);

  const handleViewAll = () => {
    navigate('/allvideos', { state: { query } });
  };

  return (
    <div className="flex justify-center items-start p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-lg">
        <div className="relative bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1),_-5px_0_15px_rgba(0,0,0,0.05),_5px_0_15px_rgba(0,0,0,0.05)] border border-gray-100">
          <input
            type="text"
            placeholder="Search products, categories, or tags..."
            className="w-full px-12 py-4 text-lg text-gray-700 placeholder-gray-400 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            value={query}
            onChange={handleChange}
          />
          <button
            onClick={handleSearch}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 transition duration-200"
          >
            <Search className="text-blue-500 hover:text-blue-600" size={24} />
          </button>
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 transition duration-200"
            >
              <X className="text-gray-400 hover:text-gray-600" size={24} />
            </button>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        {results.length > 0 && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setResults([])}></div>
            <div className="flex p-4 absolute z-50 w-full bg-white border shadow-[0_0_20px_rgba(0,0,0,0.1),_-8px_0_15px_rgba(0,0,0,0.05),_8px_0_15px_rgba(0,0,0,0.05)] rounded-lg">
              <div className="flex-grow">
                <div className="space-y-4">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-start space-x-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        navigate(`/invitation-Videos?id=${result.id}`);
                      }}
                    >
                      <img
                        src={`https://admin.urbantyohar.com/${result.video_thumbnail}`}
                        alt={result.title}
                        className="w-16 h-16 object-cover rounded-lg shadow-md"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {result.title}
                        </h3>
                        <div className="text-red-500 font-bold">
                          Rs. {result.offer_dis}{' '}
                          <span className="text-gray-500 line-through">Rs. {result.price}</span>
                        </div>
                        <div className="text-gray-500">{result.vendor}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {results.length === 0 && !loading && query && (
          <div className="text-center py-4">
            <p className="text-gray-500 text-lg">
              No results found for "{query.trim()}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;