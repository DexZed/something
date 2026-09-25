import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const libreBaskerville = localFont({
  src: "./fonts/LibreBaskerville-VariableFont_wght.ttf",
  variable: "--font-libre-baskerville",
});

const libreBaskervilleItalic = localFont({
  src: "./fonts/LibreBaskerville-Italic-VariableFont_wght.ttf",
  variable: "--font-libre-baskerville-italic",
});

export const metadata: Metadata = {
  title: "University Dashboard",
  description:
    "University Dashboard Management System. Streamline administrative tasks and enhance student services with our comprehensive solution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${libreBaskerville.variable} ${libreBaskervilleItalic.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
