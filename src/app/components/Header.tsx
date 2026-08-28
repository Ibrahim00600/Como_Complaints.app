import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-brand text-white flex items-center px-4 py-2 shadow-md">
      <Link href="/" legacyBehavior>
        <a className="flex items-center space-x-2">
          <Image src="/logo.png" alt="CUCS Logo" width={40} height={40} priority />
          <span className="font-semibold text-lg">CUCS – Comopolitan University Complaints System</span>
        </a>
      </Link>
    </header>
  );
}
