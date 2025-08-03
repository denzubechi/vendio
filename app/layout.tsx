import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers/providers";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Selar Onchain - Sell Digital Products with Crypto",
  description:
    "Create your digital storefront and sell products with cryptocurrency payments on Base",
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
