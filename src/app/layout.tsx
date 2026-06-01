import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chomthong Web Apps | โรงเรียนจอมทอง",
  description: "ระบบจัดการเว็บแอปพลิเคชันและระบบสารสนเทศ โรงเรียนจอมทอง จังหวัดเชียงใหม่",
  keywords: ["โรงเรียนจอมทอง", "ระบบสารสนเทศ", "chomthong school"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: [{ url: "/logo.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full">
      <body className="min-h-full bg-slate-50 antialiased">
        {children}
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          duration={3500}
          toastOptions={{
            style: { fontFamily: "var(--font-noto-sans-thai), sans-serif" },
          }}
        />
      </body>
    </html>
  );
}
