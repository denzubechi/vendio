import "@coinbase/onchainkit/styles.css";
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { headers } from "next/headers";
import { Providers } from "@/components/providers/providers";
import { cookieToInitialState } from "wagmi";
import { getConfig } from "@/lib/wagmi";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL || "https://tryvendio.vercel.app";
  const appName = "Vendio";
  const imageUrl = `${URL}/vendio.png`;
  const splashImageUrl = `${URL}/vendio.png`; // Reusing the same image for the splash screen
  const splashBackgroundColor = "#000000";

  // Build Mini App embed per latest docs
  const miniappEmbed = {
    version: "1",
    imageUrl,
    button: {
      title: `Turn Your Creativity into Crypto`,
      action: {
        type: "launch_miniapp",
        name: appName,
        url: URL,
        splashImageUrl,
        splashBackgroundColor,
      },
    },
  };

  // Build Farcaster Frame for backward compatibility
  const frameEmbed = {
    version: "1",
    imageUrl,
    button: {
      title: `Launch ${appName}`,
      action: {
        type: "launch_frame",
        name: appName,
        url: URL,
        splashImageUrl,
        splashBackgroundColor,
      },
    },
  };

  return {
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
      "online selling",
      "crypto payments",
      "link in bio",
      "global tips",
      "course creation",
      "payment links",
      "analytics dashboard",
    ],
    icons: {
      icon: "/vendio.png",
    },
    authors: [{ name: "Vendio Team" }],
    openGraph: {
      title: "Vendio - Your All-in-One Creator Platform",
      description:
        "Showcase your work, sell digital products, and manage your business with Vendio's powerful creator tools. Instant crypto payments, secure storefronts, and detailed analytics.",
      url: URL,
      siteName: "Vendio",
      images: [
        {
          url: `${URL}/vendio.png`,
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
      images: [`${URL}/vendio.png`],
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
    other: {
      // New embed tag as per the latest docs
      "fc:miniapp": JSON.stringify(miniappEmbed),
      // Backward compatibility tag
      "fc:frame": JSON.stringify(frameEmbed),
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialState = cookieToInitialState(
    getConfig(),
    headers().get("cookie")
  );
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
