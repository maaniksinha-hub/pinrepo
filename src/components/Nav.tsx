"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="nav">
      <div className="nav__inner">
        <Link href="/" className="nav__brand" aria-label="Pinrepo home">
          <span className="nav__brand-mark" aria-hidden="true">
            週
          </span>
          <span className="nav__brand-name">Pinrepo</span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          <Link
            href="/"
            className="nav__link"
            data-active={pathname === "/" ? "true" : "false"}
          >
            Feed
          </Link>
          <Link
            href="/boards"
            className="nav__link"
            data-active={pathname.startsWith("/boards") ? "true" : "false"}
          >
            Boards
          </Link>
          <Link
            href="/guides/best-git-repos-for-ai-coding"
            className="nav__link"
            data-active={pathname.startsWith("/guides") ? "true" : "false"}
          >
            Guide
          </Link>
        </nav>

        <p className="nav__issue" aria-hidden="true">
          WEEKLY · DEMO
        </p>
      </div>
    </header>
  );
}
