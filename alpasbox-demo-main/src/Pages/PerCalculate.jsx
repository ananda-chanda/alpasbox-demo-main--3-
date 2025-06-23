// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const PerCalculate = ({ productId }) => {
//   const [mainPrice, setMainPrice] = useState(null);
//   const [sellPrice, setSellPrice] = useState(null);
//   const [percentage, setPercentage] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPrices = async () => {
//       const config = {
//         method: "post",
//         maxBodyLength: Infinity,
//         url: `https://admin.urbantyohar.com/api/single-product?id=${productId}`,
//         headers: {
//           Authorization: "Bearer 1|jTJPqu1PMw114pLFNnPjRm5TZx4vd0tE5Y5FDcQNaac47fa3",
//         },
//       };

//       try {
//         const response = await axios.request(config);
//         console.log("API Response:", response.data);  // Check API response

//         // Assuming `price` is a string, we convert it to a number before using it
//         const mainPrice = parseFloat(response.data.price);  // Convert string to number
//         const sellPrice = response.data.offer_dis; // `offer_dis` is already a number

//         // Ensure both prices are numbers before proceeding
//         if (!isNaN(mainPrice) && !isNaN(sellPrice)) {
//           setMainPrice(mainPrice);
//           setSellPrice(sellPrice);

//           // Calculate the discount percentage only if both prices are valid
//           if (mainPrice > 0 && sellPrice >= 0) {
//             const result = ((mainPrice - sellPrice) / mainPrice) * 100;
//             setPercentage(result.toFixed(2)); // Round to 2 decimal places
//           }
//         } else {
//           setPercentage(null);  // If prices are invalid, no discount
//         }
//       } catch (error) {
//         console.error("Error fetching prices:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPrices();
//   }, [productId]); // Add productId as a dependency

//   if (loading) {
//     return <div className="text-center text-gray-600">Loading...</div>;
//   }

//   return (
//     <div className="flex justify-center items-center mt-4">
//       {percentage !== null ? (
//         <button
//           className="px-4 py-2 bg-red-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           Save {percentage}%
//         </button>
//       ) : (
//         <button
//           className="px-4 py-2 bg-gray-400 text-white font-bold rounded-md cursor-not-allowed"
//           disabled
//         >
//           No Discount Available
//         </button>
//       )}
//     </div>
//   );
// };

// export default PerCalculate;
