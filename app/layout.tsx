import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RentMe - Professional Property Rental Platform",
  description: "Connect renters with verified housing agents through our professional property rental platform. Find your perfect home or manage your properties with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <AuthProvider>
          {/* <ConditionalNavigation /> */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
