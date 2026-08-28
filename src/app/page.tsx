import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 md:py-24 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
        <div className="flex-1 space-y-8 text-center md:text-left">
          <div className="inline-block relative h-20 w-20 md:hidden mb-4 rounded-full overflow-hidden border-2 border-gold shadow-lg bg-white">
             <Image 
                src="/logo.png" 
                alt="CUCS Logo" 
                fill
                className="object-contain"
              />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-sm">
            Welcome to <span className="text-gold">CUCS</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-xl mx-auto md:mx-0">
            The Comopolitan University Complaints System provides a seamless way to report and track issues across campus facilities.
          </p>
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20 inline-block text-left w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
               <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               How it works
            </h2>
            <ul className="space-y-6">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gold/20 border border-gold/50 text-gold flex items-center justify-center font-bold text-sm shadow-inner">1</div>
                <p className="ml-4 text-gray-200 mt-1">Scan a CUCS QR code located at the facility.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gold/20 border border-gold/50 text-gold flex items-center justify-center font-bold text-sm shadow-inner">2</div>
                <p className="ml-4 text-gray-200 mt-1">Fill out the quick issue report form.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gold/20 border border-gold/50 text-gold flex items-center justify-center font-bold text-sm shadow-inner">3</div>
                <p className="ml-4 text-gray-200 mt-1">Our facilities team handles the rest.</p>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex-1 hidden md:flex justify-center relative">
           {/* Decorative background glow */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gold/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
           
          <div className="relative w-full max-w-md aspect-square bg-gradient-to-tr from-white/5 to-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-center border border-white/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-[url('/logo.png')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
            
            <div className="text-center p-8 bg-brand/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 z-10 w-3/4 transform transition-transform hover:scale-105 duration-300">
              <div className="w-32 h-32 mx-auto bg-white rounded-xl shadow-inner p-2 flex items-center justify-center mb-6 relative group">
                 <img src="/api/qrcode/home" alt="Scan to Report" className="w-full h-full object-contain" />
              </div>
              <p className="text-lg font-bold text-white mb-1">Scan to Report</p>
              <div className="inline-block px-3 py-1 bg-white/10 rounded-full border border-white/20">
                <p className="text-xs text-gold">Facility Management</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
