import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "GitHub Issue Tracker",
  description: "Mini GitHub issue tracker clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
