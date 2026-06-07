import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
  preload: false,
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "BrightPeak Apprenticeships | Build a Team That Grows",
  description:
    "Government funded apprenticeships tailored to your business. Start to finish delivery. 30+ years of expertise. Ofsted Good rated.",
  keywords: "apprenticeships, government funded, employer training, level 3, level 4, business, tech, finance",
  openGraph: {
    title: "BrightPeak Apprenticeships",
    description: "Build a team that grows with your business.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="bg-[#F4F6FF] text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
