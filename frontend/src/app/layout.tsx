import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { geistMono, geistSans, geistSerif } from "@/lib/fonts"
import { MockAuthProvider } from "@/components/mock-auth-provider"
import { SiteLayout } from "@/components/site-layout"
import { FaviconManager } from "@/components/favicon-manager"
import "./globals.css"

export const metadata: Metadata = {
  title: "Nerrawave — AI Speech to Text for Interviews",
  description:
    "Turn audio and video into accurate transcripts. Built for market research, journalism, and teams who work with long-form recordings.",
  icons: {
    icon: [{ url: "/favicon-32.png", type: "image/png" }],
    apple: [{ url: "/nerrawave-logo.png" }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${geistSerif.variable}`}
    >
      <body className={`${geistSans.className} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <MockAuthProvider>
            <FaviconManager />
            <SiteLayout>{children}</SiteLayout>
          </MockAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
