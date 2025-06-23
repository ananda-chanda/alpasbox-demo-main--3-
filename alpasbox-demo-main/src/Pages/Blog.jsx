import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await axios.post("https://admin.urbantyohar.com/api/blog");
        if (response.data.status === 200) {
          setBlogPosts(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Function to parse HTML string and extract text content
  const parseTopics = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const topics = Array.from(doc.getElementsByTagName('h3')).map(h3 => {
      const a = h3.querySelector('a');
      return a ? a.textContent : h3.textContent;
    });
    return topics;
  };

  return (
    <div className="font-sans ">
         <Helmet>
        <title>Blog Post  - My Website</title>
        <meta name="description" content={`Read blog post  and learn new things.`} />
      </Helmet>
      <header className="bg-blue-600 text-white text-center py-16 px-4 mt-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-600 opacity-90" />
        <div className="relative z-10">
          <h1 className="text-xl  md:text-3xl font-bold mb-6">Urban Tyohar Video Marketing Blog</h1>
          <p className="text-lg max-w-3xl mx-auto md:text-xl ">
            A one-stop guide to all our resources to grow traffic, improve
            conversion, increase sales & lead generation through actionable video
            and content marketing.
          </p>
        </div>
      </header>

      <main className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 md:px-10">
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0 py-6">
              {blogPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col"
                >
                  <img
                    src={`https://admin.urbantyohar.com/${post.image}`}
                    alt={post.title}
                    className="w-full h-44 object-cover rounded-t-lg hover:opacity-90 transition-opacity duration-300"
                  />
                  <div className="p-4 flex flex-col flex-grow">
                    <h2 className="text-2xl font-bold text-blue-600 mb-4 ">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 mb-4">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <ul className="text-gray-600 space-y-2 mb-auto">
                      {parseTopics(post.short_desc).map((topic, i, arr) => (
                        <li key={i} className="flex items-center">
                          <span>{topic}</span>
                          {i < arr.length - 1 && <span className="mx-2 text-gray-400">|</span>}
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between items-center pt-4 mt-4 border-t">
                      <span className="text-sm text-gray-500">5 min read</span>
                      <button 
                        onClick={() => { 
                          navigate(`/blog/${post.id}`);
                          window.scroll(0,0);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Blog;
