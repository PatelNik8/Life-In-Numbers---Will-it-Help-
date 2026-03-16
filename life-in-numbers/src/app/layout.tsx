import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "@/styles/globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Life in Numbers – Personal Data Dashboard",
    template: "%s | Life in Numbers",
  },
  description:
    "Transform your daily life data into meaningful visual analytics. Track habits, health, and productivity with beautiful charts and AI insights.",
  keywords: ["personal analytics", "habit tracker", "life dashboard", "data visualization", "health tracking"],
  authors: [{ name: "Life in Numbers" }],
  openGraph: {
    title: "Life in Numbers – Personal Data Dashboard",
    description: "Your Google Analytics for personal life. Track, visualize, and improve every day.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} font-sans antialiased bg-[var(--bg-primary)] text-[var(--text-primary)]`}>
        {children}
      </body>
    </html>
  );
}
