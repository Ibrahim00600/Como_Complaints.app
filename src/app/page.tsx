import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-zinc-50">
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 md:py-24 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-8 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-brand">
            Welcome to CUCS
          </h1>
          <p className="text-xl text-gray-600 max-w-xl mx-auto md:mx-0">
            The Comopolitan University Complaints System provides a seamless way to report and track issues across campus facilities.
          </p>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 inline-block text-left">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">How it works</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-sm mt-0.5">1</div>
                <p className="ml-3 text-gray-600">Scan a CUCS QR code located at the facility.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-sm mt-0.5">2</div>
                <p className="ml-3 text-gray-600">Fill out the quick issue report form.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-sm mt-0.5">3</div>
                <p className="ml-3 text-gray-600">Our facilities team handles the rest.</p>
              </li>
            </ul>
          </div>
          <div className="pt-4">
             <Link 
              href="/login" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand hover:bg-brand/90 transition-colors shadow-sm"
            >
              Admin Portal Login
            </Link>
          </div>
        </div>
        <div className="flex-1 hidden md:flex justify-center">
          <div className="relative w-full max-w-sm aspect-square bg-gradient-to-tr from-brand/20 to-brand/5 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center border border-white">
            <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50">
              <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
                <span className="text-gray-400 text-sm font-medium">QR Code</span>
              </div>
              <p className="font-semibold text-brand">Scan to Report</p>
              <p className="text-xs text-gray-500 mt-1">Example Location Label</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
