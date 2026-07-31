"use client";

import Link from "next/link";
import { useState } from "react";
import { CoverArt } from "@/components/CoverArt";
import { SaveSheet } from "@/components/SaveSheet";
import { formatStars, repoSlug } from "@/data/repos";
import { useBoards } from "@/hooks/useBoards";
import type { RepoPin } from "@/lib/types";

type PinPanelProps = {
  pin: RepoPin;
  index: number;
};

export function PinPanel({ pin, index }: PinPanelProps) {
  const { isPinned } = useBoards();
  const [sheetOpen, setSheetOpen] = useState(false);
  const pinned = isPinned(pin.id);

  return (
    <>
      <article
        className={`pin pin--${pin.height}`}
        style={{ ["--i" as string]: index }}
        data-pinned={pinned ? "true" : "false"}
      >
        <div className="pin__gutter-break" aria-hidden="true" />
        <div className="pin__frame">
          <div className="pin__cover">
            <CoverArt
              src={pin.cover}
              alt={`Anime cover for ${pin.owner}/${pin.name}`}
            />
            <span className="pin__sfx" aria-hidden="true">
              {pin.sfx}
            </span>
          </div>

          <div className="pin__body">
            <header className="pin__header">
              <p className="pin__owner">
                {pin.viral && <span className="pin__viral">VIRAL </span>}
                {pin.owner}/
              </p>
              <h2 className="pin__name">
                <Link href={`/repo/${repoSlug(pin)}`}>{pin.name}</Link>
              </h2>
            </header>

            <p className="pin__desc">{pin.description}</p>
            <p className="pin__godmode">
              <span className="pin__godmode-label">God mode</span>
              {pin.godMode}
            </p>

            <div className="pin__meta">
              <span className="pin__bubble">{pin.language}</span>
              <span className="pin__stars" title={`${pin.stars} stars`}>
                ★ {formatStars(pin.stars)}
              </span>
              <ul className="pin__topics">
                {pin.topics.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>

            <div className="pin__actions">
              <Link className="pin__link" href={`/repo/${repoSlug(pin)}`}>
                Repo page
              </Link>
              <a
                className="pin__link"
                href={`https://github.com/${pin.owner}/${pin.name}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <button
                type="button"
                className="pin__save"
                data-pinned={pinned ? "true" : "false"}
                onClick={() => setSheetOpen(true)}
              >
                {pinned ? "Pinned" : "Pin"}
              </button>
            </div>
          </div>
        </div>
      </article>

      <SaveSheet
        pinId={pin.id}
        pinName={pin.name}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}
