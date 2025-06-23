import React from 'react'
import Hero from '../components/Hero'
import InvitationCollections from '../components/MainCategory'
import WeddingInvitations from '../components/InVideo'
import WeddingInvitation from '../components/InCard'
import Searchbar from '../components/Searchbar'
import HowMake from '../Pages/HowMake'
import CustomerReviews from './CustomerReview'
import Faq from './Faq'
import AboutUT from './AboutUT'
import CallDesigner from './CallDesigner'
// import InvideoBanner from '../components/InvideoBanner'
import Stationary from '../components/Instationary';
import { Helmet } from 'react-helmet-async';


const Home = () => {
  return (
    <>
      <Helmet>
        <title>Urban Tyohar | Design Wedding Invitations, Cards & Videos – Your Ultimate Wedding Invitation Maker</title>
        <meta name="description" content="Urban Tyohar lets you design wedding invitations, wedding invitation cards, and wedding invitation videos with ease. Choose from stunning templates and create the perfect invite for your big day" />
          <link rel="canonical" href="/" />
      </Helmet>
    <Hero/>
    <Searchbar/>
    <InvitationCollections/>
    <WeddingInvitations/>
    <WeddingInvitation/>
    <Stationary/>
    <HowMake/>
    <CustomerReviews/>
    <CallDesigner/>
    <AboutUT/>
    <Faq/>
  
  
    
   
    </>
  )
}
export default Home