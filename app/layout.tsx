import { Montserrat } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

// Import Montserrat with additional weights
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans", // Custom CSS variable for Montserrat
  weight: ["400", "500", "600", "700", "800"], // Added more weights
});

export const metadata: Metadata = {
  title: "Invoicer",
  description: "A Next.js invoice management solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>{children}</body>
    </html>
  );
}
