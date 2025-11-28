import Hero from './components/Hero';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-black selection:bg-white/20">
      <div className="relative z-10">
        <Hero />
        
        <footer className="absolute bottom-4 w-full text-center text-gray-800 text-xs pointer-events-none">
          <p>© {new Date().getFullYear()} MNKY</p>
        </footer>
      </div>
    </main>
  );
}
