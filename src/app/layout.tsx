import type { Metadata } from "next";
import AdminShortcut from "@/components/AdminShortcut";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tkachenko Studio | Студия красоты в Краснодаре",
  description: "Tkachenko Studio — премиальная студия красоты в Краснодаре. Сложное окрашивание Airtouch, стрижки, уход за волосами. Мастер-колорист Юлия Ткаченко. Материалы Keune (Нидерланды). Запись по телефону +7 (967) 313-88-93.",
  keywords: "студия красоты, Краснодар, окрашивание, Airtouch, стрижки, Keune, Ткаченко, колорист",
  openGraph: {
    title: "Tkachenko Studio | Студия красоты в Краснодаре",
    description: "Премиальная студия красоты. Сложное окрашивание, стрижки, уход за волосами на материалах Keune.",
    locale: "ru_RU",
    type: "website",
    siteName: "Tkachenko Studio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <style>{`nextjs-portal { display: none !important; }`}</style>
      </head>
      <body>
        {children}
        <AdminShortcut />
      </body>
    </html>
  );
}
