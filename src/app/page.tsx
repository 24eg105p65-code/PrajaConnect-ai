import React from 'react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="tricolor-stripe w-full" />
      <header className="p-6 bg-white border-b border-slate-200 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gov-navy">PrajaConnect AI</h1>
        <span className="text-xs bg-amber-100 text-amber-900 px-2 py-1 rounded font-bold">10 Wards Pilot</span>
      </header>
      <main className="p-8 max-w-4xl mx-auto flex-grow space-y-4">
        <h2 className="text-3xl font-extrabold text-gov-navy">Your Village. Your Voice.</h2>
        <p className="text-slate-600">Extract this repository in VS Code and connect to your Supabase instance to begin.</p>
      </main>
    </div>
  );
}