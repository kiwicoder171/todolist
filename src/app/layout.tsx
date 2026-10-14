import type { Metadata } from "next";
import "./globals.css";
import { HouseholdProvider } from "@/context/HouseholdContext";
import { RoutinesProvider } from "@/context/RoutinesContext";
import { DailyTasksProvider } from "@/context/DailyTasksContext";
import { KanbanProvider } from "@/context/KanbanContext";
import { PWARegistration } from "@/components/PWARegistration";

export const metadata: Metadata = {
  title: "Couple Task Hub",
  description: "Hand-drawn collaborative daily task & habit tracker for couples",
  manifest: "/manifest.json",
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
        <HouseholdProvider>
          <RoutinesProvider>
            <DailyTasksProvider>
              <KanbanProvider>
                <PWARegistration />
                {children}
              </KanbanProvider>
            </DailyTasksProvider>
          </RoutinesProvider>
        </HouseholdProvider>
      </body>
    </html>
  );
}
