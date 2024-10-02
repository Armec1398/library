import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "کتابخانه آنلاین",
  description: "بهترین کتابخانه ای که باهاش سروکار دارید",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa">
      <body>
        {children}
      </body>
    </html>
  );
}
