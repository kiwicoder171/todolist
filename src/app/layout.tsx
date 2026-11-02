import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { HouseholdProvider } from "@/context/HouseholdContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { RoutinesProvider } from "@/context/RoutinesContext";
import { DailyTasksProvider } from "@/context/DailyTasksContext";
import { KanbanProvider } from "@/context/KanbanContext";
import { FocusTimerProvider } from "@/context/FocusTimerContext";
import { PWARegistration } from "@/components/PWARegistration";
import { Analytics } from "@vercel/analytics/next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Couple Task Hub",
  description: "Hand-drawn collaborative daily task & habit tracker for couples",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,300&family=Montserrat:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {process.env.NODE_ENV !== "production" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function(regs) {
                    for (var r of regs) { r.unregister(); }
                  });
                }
              `,
            }}
          />
        )}
      </head>
      <body className="antialiased selection:bg-black selection:text-white">
        <AuthProvider>
          <HouseholdProvider>
            <FocusTimerProvider>
              <NotificationProvider>
                <RoutinesProvider>
                  <DailyTasksProvider>
                    <KanbanProvider>
                      <PWARegistration />
                      {children}
                      <Analytics />
                    </KanbanProvider>
                  </DailyTasksProvider>
                </RoutinesProvider>
              </NotificationProvider>
            </FocusTimerProvider>
          </HouseholdProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
