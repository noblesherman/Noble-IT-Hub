"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition"
    >
      Sign Out
    </button>
  );
}