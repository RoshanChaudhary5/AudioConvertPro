import { useEffect } from 'react';
import Hero from '../components/Hero';
import UploadSection from '../components/UploadSection';
import FeaturesSection from '../components/FeaturesSection';
import HowItWorks from '../components/HowItWorks';
import FAQ from '../components/FAQ';
import Testimonials from '../components/Testimonials';

export default function Home() {
  useEffect(() => {
    document.title = 'AudioConvert Pro — Convert MP4 to MP3 Instantly';
  }, []);

  return (
    <>
      <Hero />
      <UploadSection />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <FAQ />
    </>
  );
}
