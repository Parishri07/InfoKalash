'use client';

import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white flex justify-between items-center p-6 h-16 shadow-md">
      <div className="text-xl font-bold">
        AI Training Platform
      </div>
      <nav className="space-x-6">
        <Link href="/" passHref>
          <span className="hover:text-gray-400 font-semibold transition-colors duration-300 cursor-pointer">Home</span>
        </Link>
        <Link href="/upload" passHref>
          <span className="hover:text-gray-400 font-semibold transition-colors duration-300 cursor-pointer">Upload CSV</span>
        </Link>
        <Link href="/leaderboard" passHref>
          <span className="hover:text-gray-400 font-semibold transition-colors duration-300 cursor-pointer">Leaderboard</span>
        </Link>
        <Link href="/feature-importance" passHref>
          <span className="hover:text-gray-400 font-semibold transition-colors duration-300 cursor-pointer">Important Features</span>
        </Link>
        <Link href="/test" passHref>
          <span className="hover:text-gray-400 font-semibold transition-colors duration-300 cursor-pointer">Test</span>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
