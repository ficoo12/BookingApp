import "./App.css";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Footer from "./components/Footer";
function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutUs />
      <ContactUs />
      <Footer />
    </>
  );
}

export default LandingPage;
