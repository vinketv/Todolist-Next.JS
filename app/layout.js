import { Inter } from "next/font/google";
import "./globals.css";
import './globalicon.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TodoList",
  description: "TodoList by Kevin Sanches"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        </body>
    </html>
  );
}
