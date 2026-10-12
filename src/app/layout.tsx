import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PrajaConnect AI — Village Civic & Grievance Platform',
  description: 'AI-Powered Village Public Service and Complaint Management Platform for Rural Governance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <style>{`
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
        `}</style>
      </head>
      <body className="antialiased bg-slate-50 text-slate-900 selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}