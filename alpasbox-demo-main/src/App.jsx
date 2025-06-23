import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Floatingcart from './components/Floatingcart';
import ScrollToTop from './components/ScrollToTop';
import Floatinglist from './components/Floatinglist';
// import Floatwha from './components/Floatwha';
import Stationary from './Pages/Stationary';
import AllCards from './Pages/AllCards';
import DynamicCategoryPage from './Pages/DynamicCategoryPage';
import Blog from './Pages/Blog';
import Vendorplan from './Pages/Vendorplan';
import Process from './Pages/Process';
import VendorLogin from './Pages/VendorLogin';
import VendorVerify from './Pages/VendorVerify';
import VendorPro from './Vendor/VendorPro';
import VendorLayout from './Vendor/VendorLayout';
import ContactDel from './Pages/Finalprod';
import Stasubcategory from './Pages/Stasubcategory';
import Poojakit from './Pages/Poojakit';
import Loader from './components/Loader';
import Cardsub from './Pages/CardSubcatagory';
import Bills from './Pages/Bills'
import Payment from './Pages/Payment';
import Gift from './Pages/Gift';
import Avai from './Pages/Available'

// Lazy loaded components
const Home = lazy(() => import('./Pages/Home'));
const Login = lazy(() => import('./Pages/Login'));
const Signup = lazy(() => import('./Pages/Signup'));
const Thankyou = lazy(() => import('./Pages/ThanksPage'));
const Profile = lazy(() => import('./Pages/Profile'));
const AllVideos = lazy(() => import('./Pages/AllVideo'));
const InvitationCollections = lazy(() => import('./components/MainCategory'));
const SingleProd = lazy(() => import('./Pages/SingleProd'));
const Singlecart = lazy(() => import('./Pages/Singlecart'));
const Singlesta = lazy(() => import('./Pages/SinStationary'));
const CartItems = lazy(() => import('./Pages/CartItem'));
const CustomerReview = lazy(() => import('./Pages/CustomerReview'));
const Faq = lazy(() => import('./Pages/Faq'));
const AboutUT = lazy(() => import('./Pages/AboutUT'));
const ContactUs = lazy(() => import('./Pages/ContactUs'));
const About = lazy(() => import('./Pages/About'));
const BlogPost = lazy(() => import('./Pages/BlogPost'));
const TermsAndCondition = lazy(() => import('./Pages/TermsAndCondition'));
const Privacy = lazy(() => import('./Pages/Privacy'));
const RefundPolicy = lazy(() => import('./Pages/RefundPolicy'));
const CallDesigner = lazy(() => import('./Pages/CallDesigner'));
const SubcategoryPage = lazy(() => import('./Pages/SubcategoryPage'));
const GST = lazy(() => import('./Vendor/VendorGst'));
const Plan = lazy(() => import('./Vendor/VendorPlan'));
const Download = lazy(() => import('./Vendor/VendorDownload'));
const VideoCoin = lazy(() => import('./Vendor/VideoCoin'));
const ProfileContent = lazy(() => import('./Vendor/VendorProfile'));

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="relative w-full flex items-center justify-center">
          <Navbar />
        </div>

        <div>
          <Suspense fallback={<Loader/>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/invitation-Video" element={<AllVideos />} />
              <Route path="/invitation-Video/:category_id/:category_name" element={<AllVideos />} />
              <Route path="/all-cards" element={<AllCards />} />
              <Route path="/all-stationaries" element={<Stationary />} />
              <Route path="/invitation-collections" element={<InvitationCollections />} />
              <Route path="/invitation-Videos" element={<SingleProd />} />
              <Route path="/single-cart" element={<Singlecart />} />
              <Route path="/stationary" element={<Singlesta />} />
              <Route path="/cart-item" element={<CartItems />} />
              <Route path="/custo-rev" element={<CustomerReview />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/aboutut" element={<AboutUT />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/about" element={<About />} />
              <Route path="/terms-con" element={<TermsAndCondition />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/thank-you" element={<Thankyou />} />
              <Route path="/gift" element={<Gift />} />
              
              {/* Blog Routes */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              
              <Route path="/process" element={<Process />} />
              <Route path="/vendor-plan" element={<Vendorplan />} />
              <Route path="/vendor-login" element={<VendorLogin />} />
              <Route path="/vendor-verify" element={<VendorVerify />} />
              <Route path="/vendor-pro" element={<VendorPro />} />
              <Route path="/contact-Deli" element={<ContactDel />} />
              <Route path="/refund" element={<RefundPolicy />} />
              <Route path="/call-designer" element={<CallDesigner />} />
              <Route path="/Stasubcategory/:subcategory_id/:subcategoryName" element={<Stasubcategory />} />
              <Route path="/pooja-kits/:subcategory_id/:subcategoryName" element={<Poojakit />} />
              <Route path="/subcategory/:subcategory_id/:subcategoryName" element={<SubcategoryPage />} />
              <Route path="/cardsub/:subcategory_id/:subcategoryName" element={<Cardsub />} />
              <Route path="/bills" element={<Bills />} />
              <Route path="/payment" element={<Payment />} />
              
              {/* Dynamic Category Page */}
              
              <Route path="/:maincat_name/:category_id/:category_name" element={<DynamicCategoryPage />} />
              
              <Route path="/vendor-desh" element={<VendorLayout />}>
                <Route path="profile" element={<ProfileContent />} /> 
                <Route path="plan" element={<Plan />} />
                <Route path="video-coin" element={<VideoCoin />} />
                <Route path="download" element={<Download />} />
                <Route path="gst" element={<GST />} />

                <Route index element={<ProfileContent />} /> 
              </Route>
            </Routes>
          </Suspense>
        </div>

        {/* <Floatwha /> */}
        <Floatinglist />
        <Floatingcart />
        <ScrollToTop />
        <Avai/>
        <Footer />
      </Router>
    </HelmetProvider>
  );
}

export default App;
