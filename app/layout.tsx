import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hourfy — Price to Hours Converter",
  description: "See how many hours of work an item costs based on your income.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
