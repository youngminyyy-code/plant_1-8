"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "🌱 오늘의 이야기" },
  { href: "/growth", label: "🌻 성장 현황" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="top-nav">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`top-nav-tab ${pathname === tab.href ? "active" : ""}`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
