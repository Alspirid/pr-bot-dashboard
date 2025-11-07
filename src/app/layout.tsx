"use client";

import { BarChart3, FileText, LayoutDashboard, Shield } from "lucide-react";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const navigation = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Pull Requests", href: "/prs", icon: FileText },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gray-50">
          {/* Top Navigation Bar */}
          <header className="bg-white border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-start gap-20">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-blue-600" />
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      PR Security Dashboard
                    </h1>
                    <p className="text-sm text-gray-500">
                      Security Bot Analytics & Monitoring
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                          ${
                            isActive
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }
                        `}
                      >
                        <Icon className="w-5 h-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto px-4 sm:px-6 lg:px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
