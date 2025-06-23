import React, { useState } from "react";
import CryptoJS from "crypto-js";

const PhonePePaymentButton = () => {
  const [amount] = useState(1000); // Amount in paise (1000 = ₹10.00)
  const merchantId = "M221SJQ15FIJP";
  const saltKey = "0b5e4f60-26a6-498a-880c-2e3b9010737c"; // Salt Key
  const saltIndex = "1";
  const transactionId = `TXN${Date.now()}`; // Unique transaction ID
  const productId = "PRODUCT123";
  const callbackUrl = "https://your-redirect-url.com";
  const userId = localStorage.getItem("userId") || "GUEST123"; // Dynamic User ID

  // ✅ Fix: Safe Base64 Encoding
  const base64Encode = (obj) => {
    return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
  };

  // ✅ Fix: Correct Signature Generation
  const generateSignature = (payload) => {
    const hash = CryptoJS.HmacSHA256(payload + "/pg/v1/pay" + saltKey, saltKey).toString();
    return `${hash}###${saltIndex}`;
  };

  const handlePayment = async () => {
    const payload = {
      merchantId,
      merchantTransactionId: transactionId,
      merchantUserId: userId,
      amount: amount,
      callbackUrl: callbackUrl,
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const base64Payload = base64Encode(payload);
    const checksum = generateSignature(base64Payload);

    const requestPayload = {
      request: base64Payload,
    };

    try {
      const response = await fetch("https://api.phonepe.com/apis/hermes/pg/v1/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          "X-MERCHANT-ID": merchantId,
        },
        body: JSON.stringify(requestPayload),
      });

      const data = await response.json();
      
      // ✅ Fix: Proper API Response Handling
      if (data.success && data.data?.instrumentResponse?.redirectInfo?.url) {
        window.location.href = data.data.instrumentResponse.redirectInfo.url;
      } else {
        console.error("Payment Failed:", data);
        alert("Payment could not be processed. Please try again.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Payment request failed. Please check your internet connection.");
    }
  };

  return <button onClick={handlePayment}>Pay with PhonePe</button>;
};

export default PhonePePaymentButton;
