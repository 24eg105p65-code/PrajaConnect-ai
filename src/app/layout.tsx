import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PrajaConnect AI | Village Public Service Platform',
  description: 'AI-Powered Village Public Service and Complaint Management Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col">{children}</body>
    </html>
  );
}