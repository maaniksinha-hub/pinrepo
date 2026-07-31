"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createBoard, loadBoards, saveBoards } from "@/lib/boards";
import type { Board } from "@/lib/types";

type BoardsContextValue = {
  boards: Board[];
  ready: boolean;
  addBoard: (name: string) => Board;
  pinToBoard: (boardId: string, pinId: string) => void;
  unpinFromBoard: (boardId: string, pinId: string) => void;
  isPinned: (pinId: string) => boolean;
  boardsForPin: (pinId: string) => Board[];
};

const BoardsContext = createContext<BoardsContextValue | null>(null);

export function BoardsProvider({ children }: { children: ReactNode }) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setBoards(loadBoards());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveBoards(boards);
  }, [boards, ready]);

  const addBoard = useCallback((name: string) => {
    const board = createBoard(name);
    setBoards((prev) => [...prev, board]);
    return board;
  }, []);

  const pinToBoard = useCallback((boardId: string, pinId: string) => {
    setBoards((prev) =>
      prev.map((b) =>
        b.id === boardId && !b.pinIds.includes(pinId)
          ? { ...b, pinIds: [...b.pinIds, pinId] }
          : b,
      ),
    );
  }, []);

  const unpinFromBoard = useCallback((boardId: string, pinId: string) => {
    setBoards((prev) =>
      prev.map((b) =>
        b.id === boardId
          ? { ...b, pinIds: b.pinIds.filter((id) => id !== pinId) }
          : b,
      ),
    );
  }, []);

  const isPinned = useCallback(
    (pinId: string) => boards.some((b) => b.pinIds.includes(pinId)),
    [boards],
  );

  const boardsForPin = useCallback(
    (pinId: string) => boards.filter((b) => b.pinIds.includes(pinId)),
    [boards],
  );

  const value = useMemo(
    () => ({
      boards,
      ready,
      addBoard,
      pinToBoard,
      unpinFromBoard,
      isPinned,
      boardsForPin,
    }),
    [boards, ready, addBoard, pinToBoard, unpinFromBoard, isPinned, boardsForPin],
  );

  return (
    <BoardsContext.Provider value={value}>{children}</BoardsContext.Provider>
  );
}

export function useBoards() {
  const ctx = useContext(BoardsContext);
  if (!ctx) throw new Error("useBoards must be used within BoardsProvider");
  return ctx;
}
