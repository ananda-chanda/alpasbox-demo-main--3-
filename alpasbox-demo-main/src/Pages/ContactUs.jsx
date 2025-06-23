import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../assets/contactus/ContactUs.json';
import Mail from '../assets/all_icon/Mail.png';
import wp from '../assets/all_icon/Chat.png';
import call from '../assets/contactus/Call.png';

export const ContactUs = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center pt-20">
      {/* Main Contact Card */}
      <div className="bg-white rounded-xl p-10 w-full max-w-full flex flex-col md:flex-row items-center">
        {/* Lottie Animation Section */}
        <div className="md:w-1/2 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-xl blur-lg opacity-30"></div>
            <div className="relative max-md:w-64 max-md:h-64 h-96 w-80 rounded-xl">
              <Lottie options={defaultOptions} />
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
          <div className="flex gap-5 mt-5 justify-start ">
          <a href="mailto:support@urbantyohar.com" className="w-14 h-13">
  <img src={Mail} alt="Mail Icon" className="w-14 h-13" />
</a>
<a href="https://wa.me/9891715977" className="w-14 h-13" target="_blank" rel="noopener noreferrer">
  <img src={wp} alt="WhatsApp Icon" className="w-14 h-13" />
</a>

<a href="tel:9891715977" className="w-14 h-13">
  <img src={call} alt="Contact Icon" className="w-14 h-13" />
</a>

          </div>
        </div>
      </div>

      {/* Our Offices Section */}
      <div className="relative w-full mt-10">
        <div
          className="absolute w-full"
          style={{
            clipPath: 'polygon(0 72px, 100% 2px, 100% 4px, 0 74px)',
            backgroundColor: '#FBBF24',
            height: '100%',
            top: 0,
            zIndex: 10,
          }}
        />
        <div
          className="bg-[#4A00FF] text-white w-full mt-1"
          style={{ clipPath: 'polygon(0 70px, 100% 0, 100% 100%, 0 100%)' }}
        >
          <div className="mx-auto p-8">
            <div className="text-start mb-12 mt-12">
              <h2 className="text-xl font-semibold text-yellow-400 mb-2">WHERE ARE WE?</h2>
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                Our Offices
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Office locations */}
              <div className="md:col-span-1">
                <div className="mb-12 bg-blue-700/20 p-6 rounded-lg backdrop-blur-sm">
                  <h3 className="text-2xl font-bold text-yellow-400 ">Delhi</h3>
                  <p className="text-lg leading-relaxed mt-2">
                    Sector 11, Rohini,<br />
                    Delhi 110085, India
                  </p>
                </div>

                <div className="mb-12 bg-blue-700/20 p-6 rounded-lg backdrop-blur-sm">
                  <h3 className="text-2xl font-bold text-yellow-400">Odisha</h3>
                  <p className="text-lg leading-relaxed mt-2">
                    1570, Aravindo Nagar,<br />
                    near Poonama Gate Flyover, Dakabangala Chhaka, Old Town,<br />
                    Bhubaneswar, Odisha 751002
                  </p>
                </div>
              </div>

              {/* Maps */}
              <div className="md:col-span-1">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d407136.74188782385!2d76.93916607429144!3d28.944203698964024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d014f76cc6eb5%3A0x415e77c948652094!2sWIV-Wedding%20invitation%20video!5e0!3m2!1sen!2sin!4v1735790543659!5m2!1sen!2sin"
                  className="w-full h-96 rounded-xl"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
 <div className="md:col-span-1">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3743.401406590139!2d85.82355567500906!3d20.242180681217583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19a70a544d34fd%3A0x612407a36b433105!2sUrban%20Tyohar!5e0!3m2!1sen!2sin!4v1748938960834!5m2!1sen!2sin"
    className="w-full h-96 rounded-xl"
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;