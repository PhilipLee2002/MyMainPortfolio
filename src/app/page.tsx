import { FEATURES } from '@/lib/features';
import { SkipNav } from '@/components/layout/SkipNav';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/providers/PageTransition';
import { HeroSection } from '@/components/sections/HeroSection';
import { WorkSection } from '@/components/sections/WorkSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ContactSection } from '@/components/sections/ContactSection';

export default function Page() {
  return (
    <>
      <SkipNav />
      <Navigation />
      {FEATURES.framerMotion ? (
        <PageTransition>
          <HeroSection />
          <WorkSection />
          <AboutSection />
          <ContactSection />
        </PageTransition>
      ) : (
        <main id="main-content" className="pt-16">
          <HeroSection />
          <WorkSection />
          <AboutSection />
          <ContactSection />
        </main>
      )}
      <Footer />
    </>
  );
}
