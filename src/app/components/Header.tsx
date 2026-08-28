import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-brand-dark/80 border-b border-gold/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-gold/50 group-hover:border-gold transition-colors duration-300 shadow-sm">
                <Image 
                  src="/logo.png" 
                  alt="CUCS Logo" 
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-gold-light transition-colors">
                CUCS
              </span>
            </Link>
          </div>
          
          <nav className="flex gap-4">
            <Link 
              href="/login" 
              className="text-sm font-medium text-gray-300 hover:text-gold transition-colors px-3 py-2 rounded-md hover:bg-white/5"
            >
              Admin Portal
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
