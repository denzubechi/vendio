import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers/providers";
import logo from "@/public/vendio.png";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vendio - Turn Your Creativity into Crypto",
  description:
    "Empower your creativity with Vendio's suite of creator and business tools. Build a digital storefront, sell courses, accept crypto tips, and get paid instantly on the Base blockchain.",
  keywords: [
    "digital products",
    "sell",
    "crypto",
    "cryptocurrency payments",
    "Base blockchain",
    "e-commerce",
    "digital storefront",
    "creator economy",
    "web3",
    "online selling",
    "USDC",
    "instant payments",
    "no fees",
    "global reach",
    "decentralized",
    "marketplace",
    "smart contracts",
    "Vendio",
    "Vendio.co",
    "onchain",
    "creator tools",
    "business tools",
    "digital products",
    "online selling",
    "crypto payments",
    "Base blockchain",
    "e-commerce",
    "digital storefront",
    "creator economy",
    "web3",
    "link in bio",
    "global tips",
    "course creation",
    "payment links",
    "analytics dashboard",
    "Vendio",
  ],
  icons: {
    icon: "/vendio.png",
  },
  authors: [{ name: "Vendio Team" }],
  openGraph: {
    title: "Vendio - Your All-in-One Creator Platform",
    description:
      "Showcase your work, sell digital products, and manage your business with Vendio's powerful creator tools. Instant crypto payments, secure storefronts, and detailed analytics.",
    url: "https://tryvendio.vercel.app",
    siteName: "Vendio",
    images: [
      {
        url: "/vendio.png",
        width: 1200,
        height: 630,
        alt: "Vendio Digital Product Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vendio - Sell Digital Products with Crypto",
    description:
      "Build your brand and monetize your creativity with Vendio. From custom 'Link in Bio' pages to smart storefronts and instant crypto payments, we've got you covered.",
    images: ["/vendio.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/vendio.png" sizes="any" />
      </head>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />{" "}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
