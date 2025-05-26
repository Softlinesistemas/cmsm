'use client'

export default function Header() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full h-10 bg-blue-900 bg-cover rounded-b-2xl shadow-md" />

      <header className="w-full z-10 relative px-4 py-6 max-w-7xl mx-auto text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <img src="/logo.png" alt="Logo CMSM" className="h-16" />
          <h1 className="text-lg sm:text-2xl font-bold tracking-wide text-blue-900">
            COLÉGIO MILITAR SANTA MARIA
          </h1>
        </div>
      </header>
    </div>
  );
}
