import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Providers } from './providers';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "투두리스트",
  description: "할 일 관리 애플리케이션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head />
      <body className={inter.className}>
        <Providers>
            <AppSidebar />
            <SidebarInset className="flex-1 flex flex-col">
              {children}
            </SidebarInset>
        </Providers>
      </body>
    </html>
  );
}
