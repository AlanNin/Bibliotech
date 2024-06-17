import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
// import { dark } from "@clerk/themes";
import { GeistSans } from "geist/font/sans";
import Navbar from "./_shared/layout/navbar";

export const metadata = {
  title: "Bibliotech",
  description: "#1 E-Library",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={GeistSans.className}>
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
