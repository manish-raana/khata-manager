import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import RecoilRootWrapper from "@/wrappers/RecoilRootWrapper";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Khata Manager",
  description: "Manage your store's khata easily with Khata Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <RecoilRootWrapper>
            {children}
          </RecoilRootWrapper>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
