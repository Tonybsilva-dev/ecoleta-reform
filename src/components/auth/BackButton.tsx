"use client";

import Link from "next/link";

export function BackButton() {
  return (
    <Link
      href="#"
      onClick={(e) => {
        e.preventDefault();
        window.history.back();
      }}
      className="absolute top-6 left-6 flex items-center text-white opacity-80 transition-opacity hover:opacity-100"
    >
      <svg
        className="mr-2 h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <title>Voltar</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      <span className="font-medium text-sm">Voltar</span>
    </Link>
  );
}
