import Navbar from "@/components/user/navbar";
import Hero from "./components/Hero";
import PopularWorks from "./components/PopularWorks";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <PopularWorks />
      <Footer />
    </div>
  );
}