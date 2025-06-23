import React, { useEffect, useState } from 'react';
import axios from 'axios';
import wp from '../assets/all_icon/Chat.png';

const Floatwha = () => {
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    const fetchWhatsappNumber = async () => {
      try {
        const response = await axios.post('https://admin.urbantyohar.com/api/whatsapp');
        if (response.data && response.data.whatsapp) {
          setWhatsappNumber(response.data.whatsapp.whatsapp_number);
        }
      } catch (error) {
        console.error('Error fetching WhatsApp number:', error);
      }
    };

    fetchWhatsappNumber();
  }, []);

  const message = encodeURIComponent(
    "Hi, Welcome to our Family Urban Tyohar. We have a wide range of Invitation options available.\n\n" +
    "Before That, I need to know some details about your requirements.\n\n" +
    "1- Which Invitation is needed? & Date of Function (So that we can deliver to you as soon as possible)"
  );

  return (
    <div style={{ position: 'fixed', bottom: '200px', right: '28px', zIndex: 1000 }}>
      <a href={`https://wa.me/${whatsappNumber}?text=${message}`} target="_blank" rel="noopener noreferrer">
        <img src={wp} alt="Chat with us on WhatsApp" style={{ width: '60px', height: '60px' }} />
      </a>
    </div>
  );
};

export default Floatwha;