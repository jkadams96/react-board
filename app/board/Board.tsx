"use client";

// Pick the one you actually use. If your board is defined as Board.tsx in components,
// switch the import to that. The key is: NO imports from "@nhost/react" here.
import KanbanBoard from "components/KanbanBoard"; // <-- adjust if your board component file is named differently

export default function Board() {
  return <KanbanBoard />;
}
