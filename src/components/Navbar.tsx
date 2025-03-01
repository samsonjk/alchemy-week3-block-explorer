"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-xl font-bold">Ethereum Explorer</h1>
        <ul className="flex space-x-6">
          <li>
            <Link
              href="/"
              className={`hover:underline ${
                pathname === "/" ? "font-bold" : ""
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/accounts"
              className={`hover:underline ${
                pathname === "/accounts" ? "font-bold" : ""
              }`}
            >
              Accounts
            </Link>
          </li>
          <li>
            <Link
              href="/nft"
              className={`hover:underline ${
                pathname === "/nft" ? "font-bold" : ""
              }`}
            >
              NFT
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
