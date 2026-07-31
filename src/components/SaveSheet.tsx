"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useBoards } from "@/hooks/useBoards";

type SaveSheetProps = {
  pinId: string;
  pinName: string;
  open: boolean;
  onClose: () => void;
};

export function SaveSheet({ pinId, pinName, open, onClose }: SaveSheetProps) {
  const { boards, addBoard, pinToBoard, unpinFromBoard } = useBoards();
  const [newName, setNewName] = useState("");
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("button, input")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="sheet" role="presentation" onClick={onClose}>
      <div
        className="sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet__head">
          <h2 id={titleId} className="sheet__title">
            Pin <span className="sheet__repo">{pinName}</span>
          </h2>
          <button type="button" className="sheet__close" onClick={onClose}>
            Close
          </button>
        </div>

        <ul className="sheet__list">
          {boards.map((board) => {
            const saved = board.pinIds.includes(pinId);
            return (
              <li key={board.id}>
                <button
                  type="button"
                  className="sheet__board"
                  data-saved={saved ? "true" : "false"}
                  onClick={() =>
                    saved
                      ? unpinFromBoard(board.id, pinId)
                      : pinToBoard(board.id, pinId)
                  }
                >
                  <span className="sheet__board-name">{board.name}</span>
                  <span className="sheet__board-meta">
                    {board.pinIds.length} pins
                  </span>
                  <span className="sheet__board-action">
                    {saved ? "Unpin" : "Pin"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <form
          className="sheet__create"
          onSubmit={(e) => {
            e.preventDefault();
            const board = addBoard(newName);
            pinToBoard(board.id, pinId);
            setNewName("");
          }}
        >
          <label className="visually-hidden" htmlFor={`new-board-${pinId}`}>
            New board name
          </label>
          <input
            id={`new-board-${pinId}`}
            className="sheet__input"
            placeholder="New board name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button type="submit" className="sheet__submit" disabled={!newName.trim()}>
            Create & pin
          </button>
        </form>
      </div>
    </div>
  );
}
