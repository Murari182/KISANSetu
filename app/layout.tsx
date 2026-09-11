import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/i18n";
import { SessionProvider } from "@/lib/auth";
import { ToastProvider } from "@/lib/toast";
import { AppLayoutShell } from "@/components/layout/AppLayoutShell";
import { GlassCommandMenu } from "@/components/glass/GlassCommandMenu";

export const metadata: Metadata = {
  title: "Kisan Setu - Technology That Connects Every Farmer to a Better Harvest",
  description:
    "Smart Agriculture. Better Decisions. AI-powered agricultural intelligence, crop guidance, weather insights, market information and government support.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#154D30",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var isExplicit = localStorage.getItem('kisan_theme_explicit');
                  var savedTheme = localStorage.getItem('kisan_setu_theme');
                  if (isExplicit === 'true' && savedTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  var savedLang = localStorage.getItem('kisan_setu_lang');
                  if (savedLang === 'ur') {
                    document.documentElement.setAttribute('dir', 'rtl');
                    document.documentElement.setAttribute('lang', 'ur');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased selection:bg-emerald-600 selection:text-white min-h-[100dvh] w-full flex flex-col m-0 p-0 overflow-x-hidden bg-background text-foreground">
        <ThemeProvider>
          <LanguageProvider>
            <SessionProvider>
              <ToastProvider>
                {/* Subtle Ambient Liquid Glass Background Glows */}
                <div className="liquid-mesh" aria-hidden="true">
                  <div className="liquid-mesh-blob-1" />
                  <div className="liquid-mesh-blob-2" />
                </div>

                {/* Main Full-Viewport Shell */}
                <AppLayoutShell>{children}</AppLayoutShell>

                {/* Global Command Palette (Cmd + K) */}
                <GlassCommandMenu />
              </ToastProvider>
            </SessionProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
