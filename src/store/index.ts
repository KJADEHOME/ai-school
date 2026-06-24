import { create } from "zustand";

export type ModuleType =
  | "copywriting"
  | "graphic"
  | "3d"
  | "drama"
  | "canvas";

interface AppState {
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Active module
  activeModule: ModuleType | null;
  setActiveModule: (m: ModuleType | null) => void;

  // Search
  globalSearch: string;
  setGlobalSearch: (s: string) => void;

  // Theme (for future use)
  theme: "dark";
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  activeModule: null,
  setActiveModule: (m) => set({ activeModule: m }),

  globalSearch: "",
  setGlobalSearch: (s) => set({ globalSearch: s }),

  theme: "dark",
}));

// Canvas store for infinite canvas module
interface CanvasNode {
  id: string;
  type: "text" | "image" | "video" | "ai" | "output";
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

interface CanvasEdge {
  id: string;
  source: string;
  target: string;
}

interface CanvasState {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  selectedNodeId: string | null;
  addNode: (node: CanvasNode) => void;
  updateNode: (id: string, data: Partial<CanvasNode>) => void;
  removeNode: (id: string) => void;
  setSelectedNode: (id: string | null) => void;
  addEdge: (edge: CanvasEdge) => void;
  removeEdge: (id: string) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  addNode: (node) => set((s) => ({ nodes: [...s.nodes, node] })),
  updateNode: (id, data) =>
    set((s) => ({
      nodes: s.nodes.map((n) => (n.id === id ? { ...n, ...data } : n)),
    })),
  removeNode: (id) =>
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
    })),
  setSelectedNode: (id) => set({ selectedNodeId: id }),
  addEdge: (edge) => set((s) => ({ edges: [...s.edges, edge] })),
  removeEdge: (id) =>
    set((s) => ({ edges: s.edges.filter((e) => e.id !== id) })),
}));

// Chat store for copywriting module
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface ChatState {
  messages: ChatMessage[];
  isGenerating: boolean;
  addMessage: (msg: ChatMessage) => void;
  setGenerating: (v: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isGenerating: false,
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setGenerating: (v) => set({ isGenerating: v }),
  clearMessages: () => set({ messages: [] }),
}));
