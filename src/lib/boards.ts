import type { Board } from "@/lib/types";

const STORAGE_KEY = "pinrepo.boards.v2";

export const DEFAULT_BOARDS: Board[] = [
  {
    id: "claude-stack",
    name: "Claude stack",
    pinIds: [],
    createdAt: Date.now(),
  },
  {
    id: "cursor-kit",
    name: "Cursor kit",
    pinIds: [],
    createdAt: Date.now(),
  },
  {
    id: "agent-runtime",
    name: "Agent runtimes",
    pinIds: [],
    createdAt: Date.now(),
  },
];

export function loadBoards(): Board[] {
  if (typeof window === "undefined") return DEFAULT_BOARDS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_BOARDS.map((b) => ({ ...b, pinIds: [...b.pinIds] }));
    const parsed = JSON.parse(raw) as Board[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_BOARDS.map((b) => ({ ...b, pinIds: [...b.pinIds] }));
    }
    return parsed;
  } catch {
    return DEFAULT_BOARDS.map((b) => ({ ...b, pinIds: [...b.pinIds] }));
  }
}

export function saveBoards(boards: Board[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
}

export function createBoard(name: string): Board {
  return {
    id: `board-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim() || "Untitled board",
    pinIds: [],
    createdAt: Date.now(),
  };
}
