import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await axios.post("https://admin.urbantyohar.com/api/blog");
        if (response.data.status === 200) {
          const foundPost = response.data.data.find(post => post.id === parseInt(id));
          if (foundPost) {
            setPost(foundPost);
          }
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center mt-24">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog post not found</h2>
        <button
          onClick={() => navigate('/blog')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white mt-0">
      <div className="max-w-full mx-auto px-0 py-0">
        {/* Hero Section with Overlay */}
        <div className="relative h-[500px] w-full mb-8">
          {/* Background Image with Opacity */}
          <div className="absolute inset-0">
            <img
              src={`https://admin.urbantyohar.com/${post.image}`}
              alt="background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/60"></div>
          </div>

          {/* Content Container */}
          <div className="relative z-10 h-full max-w-4xl mx-auto px-4 flex items-center">
            {/* <div className="w-1/2">
              <img
                src={`https://admin.urbantyohar.com/${post.image}`}
                alt={post.title}
                className="w-full h-[400px] object-contain rounded-xl shadow-2xl"
              />
            </div> */}
            <div className="w-2/2 pl-8">
              <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center text-gray-300 space-x-4">
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                    />
                  </svg>
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                  5 min read
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Content */}
        <div className="max-w-6xl mx-auto px-4">
          <article className="prose prose-lg max-w-none mb-12">
            <div 
              className=" font-poppins text-xl text-gray-800 leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: post.long_desc }}
            />
          </article>

          {/* Navigation */}
          <div className="mt-12 border-t pt-8 mb-4 flex justify-center font-poppins">
            <button
              onClick={() => navigate('/blog')}
              className="group px-6 py-2 bg-[#4A00FF] text-white rounded-lg hover:[#4A00FF] transition-colors flex items-center"
            >
              <svg 
                className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;