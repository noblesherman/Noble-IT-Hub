import Hero from "@/components/Hero";
import FeaturedWork from "@/components/FeaturedWork";
import Services from "@/components/Services";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col w-full">
      <Hero />
      <FeaturedWork />
      <Services />
      <CTA />
      <Footer />
    </main>
  );
}