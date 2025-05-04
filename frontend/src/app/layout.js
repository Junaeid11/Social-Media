import RootLayoutClient from "@/components/RootLayoutClient";
import "./globals.css";

export const metadata = {
  title: "Social media - Junaeid Ahmed",
  description: "Social networking site by Abdul Rehman in NextJs, MERN STACK",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen m-0 bg-[#F5F6FA]">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
