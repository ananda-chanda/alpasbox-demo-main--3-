import { useState, useEffect } from 'react'
import axios from 'axios'
import vendortik from '../assets/blog/vendor-tik.png';
import ail from '../assets/all_icon/Mail.png';
import wp from '../assets/all_icon/Chat.png';
import call from '../assets/contactus/Call.png';
import animationData from '../assets/contactus/ContactUs.json';
import Lottie from 'react-lottie';
import MainLoader from '../components/Loader';

function CustomPage() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true) // Initial loading for entire page
    const [productLoading, setProductLoading] = useState(false) // Loading for product cards only
    const [error, setError] = useState(null)
    const [selectedType, setSelectedType] = useState('custom_video')

    // Lottie options configuration
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    const fetchData = async (type, isInitialLoad = false) => {
        if (isInitialLoad) {
            setLoading(true)
        } else {
            setProductLoading(true)
        }
        setError(null)
        
        try {
            const response = await axios.post("https://admin.urbantyohar.com/api/custom-page", {
                type: type
            })
            
            setData(response.data)
            console.log("Data fetched successfully:", response.data)
        } catch (err) {
            setError(err.message || "Failed to fetch data")
            console.error("Error fetching data:", err)
        } finally {
            if (isInitialLoad) {
                setLoading(false)
            } else {
                setProductLoading(false)
            }
        }
    }

    useEffect(() => {
        fetchData(selectedType, true) // Initial load
    }, [])

    const handleTypeChange = (type) => {
        if (type !== selectedType) {
            setSelectedType(type)
            fetchData(type, false) // Product cards only reload
        }
    }

    // Function to parse features and add vendor-tik to each line
    const parseFeatures = (featuresHtml) => {
        if (!featuresHtml) return []
        
        // Split by <p> tags or line breaks to get individual features
        const features = featuresHtml
            .replace(/<p>/g, '')
            .split(/<\/p>/)
            .filter(feature => feature.trim())
            .map(feature => feature.trim())
        
        return features
    }

    // Generate WhatsApp message with product details
    const generateWhatsAppLink = (product) => {
        const defaultMessage = `
Hello,

I am interested in purchasing the following custom product:

Product Title: ${product.title}
Product Type: ${selectedType === 'custom_video' ? 'Custom Invitation Story Video' : 'Custom Invitation Print Card'}
Price: ₹${product.price?.toLocaleString()}
GST (18%): ₹${Math.round(product.price * 0.18)}
Total Price: ₹${Math.round(product.price * 1.18)}

Please provide the necessary details regarding payment, delivery options, and any other relevant information.

Looking forward to your response.

Thank you.
        `;
        
        const encodedMessage = encodeURIComponent(defaultMessage);
        return `https://api.whatsapp.com/send/?phone=917983772927&text=${encodedMessage}&type=phone_number&app_absent=0`;
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <MainLoader />
        </div>
    )
    if (error) return <div className="text-red-500 text-center py-4">Error: {error}</div>
    if (!data) return <div className="text-center py-4">No data available</div>

    const { custom_contain, custom_product } = data

    return (
        <div className="bg-white py-0 px-0 mt-16 md:mt-0">
            <div className="mx-auto">
                {/* Banner Section - First */}
                {custom_contain && custom_contain.banner && (
                    <div className="mb-8">
                        <img 
                            src={`https://admin.urbantyohar.com/${custom_contain.banner}`}
                            alt="Banner"
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Description Section - Second */}
                {custom_contain && (
                    <div className="text-center mb-12">
                        <div 
                            className="text-lg font-poppins font-normal text-gray-900 mb-4 px-2 md:px-24 text-left [&_h2]:font-bold [&_b]:font-bold [&_h2]:block [&_h2]:text-center [&_b]:block [&_b]:text-center"
                            dangerouslySetInnerHTML={{ __html: custom_contain.desc }}
                        />
                    </div>
                )}

                {/* Type Selection Buttons - Third */}
                <div className="text-center mb-12">
                    <h2 className='text-xl md:text-2xl font-poppins font-bold text-gray-900 mb-6 px-4'>Urban Tyohar Custom Invitation Benefits</h2>
                    <div className="flex flex-col md:flex-row gap-4 justify-center px-4">
                        <button
                            onClick={() => handleTypeChange('custom_video')}
                            disabled={productLoading}
                            className={`px-6 md:px-16 py-3 rounded-full font-bold text-xs md:text-sm transition-colors shadow-lg ${
                                selectedType === 'custom_video'
                                    ? 'bg-[#FF3D57] text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            } ${productLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            CUSTOM INVITATION<br />STORY VIDEO
                        </button>
                        <button
                            onClick={() => handleTypeChange('custom_card')}
                            disabled={productLoading}
                            className={`px-6 md:px-16 py-3 rounded-full font-bold text-xs md:text-sm transition-colors shadow-lg ${
                                selectedType === 'custom_card'
                                    ? 'bg-[#FF3D57] text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            } ${productLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            CUSTOM INVITATION<br />PRINT CARD
                        </button>
                    </div>
                    <div className="text-center mt-4 text-black font-poppins text-base md:text-lg px-4">
                        <p>create custom invitation video or invitation print card as per your love story</p>
                    </div>
                </div>

                {/* Plan Cards Section - With Loading State */}
                <div className="relative min-h-[400px]">
                    {productLoading && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-10">
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF3D57]"></div>
                                <p className="mt-4 text-gray-600 font-poppins">Loading plans...</p>
                            </div>
                        </div>
                    )}
                    
                    {custom_product && custom_product.length > 0 && (
                        <div className={`grid gap-8 mb-12 px-4 md:px-0 max-w-4xl mx-auto transition-opacity duration-300 ${
                            productLoading ? 'opacity-30' : 'opacity-100'
                        } ${
                            custom_product.length === 1 
                                ? 'grid-cols-1 place-items-center' 
                                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'
                        }`}>
                            {custom_product.map((product, index) => (
                                <div key={`${product.id}-${selectedType}`} className={custom_product.length === 1 ? 'max-w-md w-full' : ''}>
                                    <div className="relative p-6 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white py-2 px-6 rounded-lg text-lg md:text-xl font-bold whitespace-nowrap">
                                            {product.title}
                                        </div>
                                        <div className="mt-6">
                                            <div className="mb-6">
                                                <ul className="space-y-4">
                                                    {parseFeatures(product.feature).map((feature, idx) => (
                                                        <li key={idx} className="font-poppins flex items-start space-x-2">
                                                            <img
                                                                src={vendortik}
                                                                alt="Feature Included"
                                                                className="w-5 h-5 mt-1 flex-shrink-0"
                                                            />
                                                            <span
                                                                className="text-gray-700"
                                                                dangerouslySetInnerHTML={{ __html: feature }}
                                                            />
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {product.terms_condition && (
                                        <div className="mb-4 text-xs text-gray-500 font-poppins border border-gray-200 rounded-lg p-4 mt-4 bg-red-100">
                                            <strong>Terms & Conditions:</strong><br />
                                            {product.terms_condition}
                                        </div>
                                    )}

                                    <div className="flex flex-row items-center justify-between mt-6 px-4 gap-1 md:gap-4">
                                        <div className="text-lg md:text-2xl lg:text-3xl font-bold flex flex-col text-left">
                                            <span className="truncate">₹{product.price?.toLocaleString()}</span>
                                            <div className="font-poppins text-[10px] md:text-xs text-gray-500 font-normal">(GST EXC)</div>
                                        </div>
                                        
                                        <div className="flex flex-row gap-1 md:gap-2">
                                            <button 
                                                className="bg-[#4A00FF] hover:bg-blue-600 text-white py-3 md:py-3 px-4 md:px-6 rounded-full text-xs md:text-sm font-medium transition-colors duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={productLoading}
                                                onClick={() => {
                                                    const userToken = localStorage.getItem('userToken');
                                                    
                                                    if (!userToken) {
                                                        window.location.href = '/login';
                                                        return;
                                                    }
                                                    
                                                    // Store custom product details in localStorage for billing
                                                    localStorage.setItem('checkoutInfo', JSON.stringify({
                                                        productId: product.id,
                                                        productTitle: product.title,
                                                        productType: selectedType,
                                                        price: product.price,
                                                        gst: Math.round(product.price * 0.18),
                                                        total: Math.round(product.price * 1.18),
                                                    }));
                                                    
                                                    window.location.href = '/bills';
                                                }}
                                            >
                                                Buy Now
                                            </button>
                                            <a
                                                href={productLoading ? '#' : generateWhatsAppLink(product)}
                                                target={productLoading ? '_self' : '_blank'}
                                                rel="noopener noreferrer"
                                                className={`bg-green-500 hover:bg-green-600 text-white py-3 md:py-3 px-4 md:px-4 rounded-full text-xs md:text-sm font-medium transition-colors duration-200 whitespace-nowrap flex items-center justify-center ${
                                                    productLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                                                }`}
                                            >
                                                Order on WhatsApp
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {custom_contain && (
                    <div className="text-center mb-12">
                        <div 
                            className="text-lg font-poppins font-normal text-gray-900 mb-4 px-2 md:px-24 text-left [&_h3]:font-bold [&_b]:font-bold [&_h3]:block [&_h3]:text-center [&_h3]:mb-6 [&_h3]:mt-8 [&_b]:block [&_b]:text-center [&_p]:mt-4"
                            dangerouslySetInnerHTML={{ __html: custom_contain.sub_desc }}
                        />
                    </div>
                )}

                <section className="py-12 font-poppins">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-xl p-10 w-full max-w-full flex flex-col md:flex-row items-center">
                            {/* Lottie Animation Section */}
                            <div className="md:w-1/2 flex justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-100 rounded-xl blur-lg opacity-30"></div>
                                    <div className="relative max-md:w-64 max-md:h-64 h-96 w-80 rounded-xl">
                                        <Lottie 
                                            options={defaultOptions}
                                            isClickToPauseDisabled={true}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Text Section */}
                            <div className="md:w-1/2 mb-8 md:mb-0 md:mr-8 text-center flex flex-col">
                                <h1 className="text-5xl text-black font-poppins text-center tracking-wide mb-4 w-fit">
                                    Have Questions?
                                </h1>
                                <p className="w-fit text-justify tracking-wide leading-loose">
                                    We have all the time in the world to answer.<br />
                                    Just connect with us. We will connect with you in a second.<br />
                                    That's our word. Use WhatsApp, Call us, or Mail us.<br />
                                    The options are unlimited.
                                </p>
                                <div className="flex gap-5 mt-5 justify-start">
                                    <a href="mailto:support@urbantyohar.com" className="w-14 h-13">
                                        <img src={ail} alt="Mail Icon" className="w-14 h-13" />
                                    </a>
                                    <a href="https://wa.me/917983772927" className="w-14 h-13" target="_blank" rel="noopener noreferrer">
                                        <img src={wp} alt="WhatsApp Icon" className="w-14 h-13" />
                                    </a>
                                    <a href="tel:+917983772927" className="w-14 h-13">
                                        <img src={call} alt="Contact Icon" className="w-14 h-13" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default CustomPage