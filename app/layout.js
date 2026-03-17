"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import Banner from "./components/banner";
import Footer from "./components/footer";
import { usePathname } from "next/navigation";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({ children }) {
    const pathname = usePathname();

    const authPages = ["/sign-in", "/sign-up", "/complete-profile", "/forgot-password", "/verify-code", "/set-new-password", ];
    const hideLayout = authPages.includes(pathname);


    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {!hideLayout && <Banner />}
        {!hideLayout && <Header />}

        {children}

        {!hideLayout && <Footer />}
        </body>
        </html>
    );
}