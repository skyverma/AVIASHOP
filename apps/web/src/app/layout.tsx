import type { Metadata } from "next";
import { Fraunces, Sora } from "next/font/google";
import { ShopProvider } from "@/lib/shop-context";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Sora({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "VYOMAI — Manage your store. Grow your business.",
  description:
    "VYOMAI helps you track inventory, protect margins, grow profit, and act on agent insights — for small shops to large businesses.",
  metadataBase: new URL("https://aviagent.shop"),
  openGraph: {
    title: "VYOMAI",
    description: "Manage your store and grow your business with inventory intelligence.",
    url: "https://aviagent.shop",
    siteName: "VYOMAI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} antialiased`}>
        <ShopProvider>{children}</ShopProvider>
      </body>
    </html>
  );
}
