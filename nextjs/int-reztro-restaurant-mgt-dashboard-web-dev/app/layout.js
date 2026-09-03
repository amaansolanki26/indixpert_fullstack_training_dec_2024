import { Geist, Geist_Mono } from "next/font/google";
import "@/helper/cognito";
import "@/styles/theme.scss";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Reztro Restaurant Admin Dashboard",
  icons: {
    icon: "/Symbol.svg",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
