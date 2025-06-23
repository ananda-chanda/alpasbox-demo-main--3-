import React from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';

const PhonePePaymentButton = ({ amount }) => {
  // Updated PhonePe Sandbox Credentials
  const merchantId = "PGTESTPAYUAT86"; 
  const saltKey = "96434309-7796-489d-8924-ab56988a6076";
  const saltIndex = "1";

  const handlePayment = async () => {
    try {
      const transactionId = `TXN${Date.now()}`;

      const payload = {
        merchantId,
        merchantTransactionId: transactionId,
        amount: amount * 100, // Convert to paisa
        redirectUrl: "https://webhook.site/callback",
        redirectMode: "REDIRECT",
        callbackUrl: "https://webhook.site/callback",
        merchantUserId: "MUID123",
        mobileNumber: "9999999999",
        paymentInstrument: {
          type: "PAY_PAGE"
        }
      };

      // Base64 encode the payload
      const base64Payload = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));

      // Correct checksum calculation
      const string = base64Payload + "/pg/v1/pay" + saltKey;
      const sha256 = CryptoJS.SHA256(string).toString(CryptoJS.enc.Hex);
      const checksum = sha256 + "###" + saltIndex;

      // Updated UAT Sandbox URL
      const response = await axios.post(
        "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
        { request: base64Payload },
        {
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            "X-VERIFY": checksum,
          },
        }
      );

      console.log("API Response:", response.data);

      if (response.data.success) {
        window.location.href = response.data.data.instrumentResponse.redirectInfo.url;
      } else {
        throw new Error(response.data.message || "Payment failed");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment initialization failed. Please try again.");
    }
  };

  return (
    <button 
      onClick={handlePayment}
      className="w-full py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700"
      disabled={!amount || amount <= 0}
    >
      Pay ₹{amount} with PhonePe
    </button>
  );
};

export default PhonePePaymentButton;
