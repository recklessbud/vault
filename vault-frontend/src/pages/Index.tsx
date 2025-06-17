
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CapsuleDemo from "@/components/CapsuleDemo";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Hero />
      <CapsuleDemo />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
