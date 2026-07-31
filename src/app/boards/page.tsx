import { BoardsView } from "@/components/BoardsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your AI git repository boards",
  description:
    "Pin Claude, Cursor, MCP, and agent git repositories into personal boards on Pinrepo.",
  alternates: { canonical: "/boards" },
  robots: { index: false, follow: true },
};

export default function BoardsPage() {
  return <BoardsView />;
}
