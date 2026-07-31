"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CoverArt } from "@/components/CoverArt";
import { formatStars } from "@/data/repos";
import { getAllRepos } from "@/lib/catalog";
import { useBoards } from "@/hooks/useBoards";

export function BoardsView() {
  const { boards, addBoard, ready } = useBoards();
  const [name, setName] = useState("");

  const byId = useMemo(
    () => new Map(getAllRepos().map((r) => [r.id, r])),
    [],
  );

  return (
    <div className="boards">
      <header className="boards__hero">
        <h1 className="boards__title">
          Your <span className="boards__title-sfx">BOARDS</span>
        </h1>
        <p className="boards__lede">
          Your AI god-mode arsenal — chapters of pinned repos, saved in this
          browser.
        </p>
      </header>

      <form
        className="boards__create"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          addBoard(name);
          setName("");
        }}
      >
        <label className="visually-hidden" htmlFor="board-name">
          Board name
        </label>
        <input
          id="board-name"
          className="boards__input"
          placeholder="Name a new board…"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" className="boards__submit" disabled={!name.trim()}>
          Create board
        </button>
      </form>

      {!ready ? (
        <p className="boards__loading">Loading boards…</p>
      ) : (
        <div className="boards__list">
          {boards.map((board, i) => (
            <section
              key={board.id}
              className="board-card"
              style={{ ["--i" as string]: i }}
            >
              <div className="board-card__head">
                <h2 className="board-card__name">{board.name}</h2>
                <p className="board-card__count">{board.pinIds.length} pins</p>
              </div>

              {board.pinIds.length === 0 ? (
                <p className="board-card__empty">
                  Empty chapter — pin something from the feed.
                </p>
              ) : (
                <ul className="board-card__pins">
                  {board.pinIds.map((id) => {
                    const pin = byId.get(id);
                    if (!pin) return null;
                    return (
                      <li key={id} className="board-card__pin">
                        <div className="board-card__thumb">
                          <CoverArt
                            src={pin.cover}
                            alt={`${pin.owner}/${pin.name}`}
                          />
                        </div>
                        <div>
                          <p className="board-card__pin-name">
                            {pin.owner}/{pin.name}
                          </p>
                          <p className="board-card__pin-meta">
                            {pin.language} · ★ {formatStars(pin.stars)}
                          </p>
                        </div>
                        <a
                          className="board-card__link"
                          href={`https://github.com/${pin.owner}/${pin.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}

              <Link href="/" className="board-card__cta">
                Back to feed
              </Link>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
