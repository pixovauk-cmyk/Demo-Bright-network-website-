import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatWidget from "@/components/AIChatWidget";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <AIChatWidget />
    </>
  )
}
