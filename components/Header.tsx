'use client';

import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white flex justify-between items-center p-6 h-16">
      <div className="text-xl font-bold">
        AI Training Platform
      </div>
      <nav className="space-x-6">
        <Link href="/" className="hover:text-gray-400 font-semibold transition-colors duration-300">
          Home
        </Link>
        <Link href="/upload" className="hover:text-gray-400 font-semibold transition-colors duration-300">
          Upload CSV
        </Link>
        <Link href="/leaderboard" className="hover:text-gray-400 font-semibold transition-colors duration-300">
          Leaderboard
        </Link>
        <Link href="/feature-importance" className="hover:text-gray-400 font-semibold transition-colors duration-300">
          Important Features
        </Link>
        <Link href="/test" className="hover:text-gray-400 font-semibold transition-colors duration-300">
          Test
        </Link>
      </nav>
    </header>
  );
};

export default Header;
