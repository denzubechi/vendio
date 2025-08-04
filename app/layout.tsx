import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vendio - Sell Digital Products with Crypto",
  description:
    "Create your digital storefront and sell products with cryptocurrency payments on Base blockchain. Instant, secure, and global.",
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
  ],
  authors: [{ name: "Vendio Team" }],
  openGraph: {
    title: "Vendio - Sell Digital Products with Crypto",
    description:
      "Create your digital storefront and sell products with cryptocurrency payments on Base blockchain. Instant, secure, and global.",
    url: "https://tryvendio.vercel.app",
    siteName: "Vendio",
    images: [
      {
        url: "/favicon.ico",
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
      "Create your digital storefront and sell products with cryptocurrency payments on Base blockchain. Instant, secure, and global.",
    images: ["/favicon.ico"],
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
      <body className={inter.className}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
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
