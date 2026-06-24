import { useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
  Panel,
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion } from "framer-motion";
import {
  Type,
  Image,
  Video,
  Sparkles,
  Download,
  MousePointer,
  Trash2,
  Play,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/AppLayout";

// ===== Custom Node Components =====
function TextNode({ data, selected }: NodeProps<Node<{ label: string; content?: string }>>) {
  return (
    <div
      className={cn(
        "min-w-[180px] bg-[#141414] border rounded-lg overflow-hidden transition-all",
        selected ? "border-[#fd79a8] ring-1 ring-[#fd79a8]/30" : "border-[#2a2a2a]"
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-[#fd79a8]" />
      <div className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1a] border-b border-[#2a2a2a]">
        <Type className="w-3.5 h-3.5 text-[#fd79a8]" />
        <span className="text-xs font-medium text-white">{data.label}</span>
      </div>
      <div className="px-3 py-2">
        <p className="text-xs text-[#a0a0a0]">{data.content || "输入文本内容..."}</p>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-[#fd79a8]" />
    </div>
  );
}

function ImageNode({ data, selected }: NodeProps<Node<{ label: string; status?: string }>>) {
  return (
    <div
      className={cn(
        "min-w-[180px] bg-[#141414] border rounded-lg overflow-hidden transition-all",
        selected ? "border-[#8b5cf6] ring-1 ring-[#8b5cf6]/30" : "border-[#2a2a2a]"
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-[#8b5cf6]" />
      <div className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1a] border-b border-[#2a2a2a]">
        <Image className="w-3.5 h-3.5 text-[#8b5cf6]" />
        <span className="text-xs font-medium text-white">{data.label}</span>
      </div>
      <div className="px-3 py-4 flex items-center justify-center">
        <div className="w-full h-20 bg-[#1a1a1a] rounded border border-dashed border-[#2a2a2a] flex items-center justify-center">
          <Image className="w-6 h-6 text-[#333]" />
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-[#8b5cf6]" />
    </div>
  );
}

function VideoNode({ data, selected }: NodeProps<Node<{ label: string }>>) {
  return (
    <div
      className={cn(
        "min-w-[180px] bg-[#141414] border rounded-lg overflow-hidden transition-all",
        selected ? "border-[#f59e0b] ring-1 ring-[#f59e0b]/30" : "border-[#2a2a2a]"
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-[#f59e0b]" />
      <div className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1a] border-b border-[#2a2a2a]">
        <Video className="w-3.5 h-3.5 text-[#f59e0b]" />
        <span className="text-xs font-medium text-white">{data.label}</span>
      </div>
      <div className="px-3 py-4 flex items-center justify-center">
        <div className="w-full h-20 bg-[#1a1a1a] rounded border border-dashed border-[#2a2a2a] flex items-center justify-center">
          <Video className="w-6 h-6 text-[#333]" />
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-[#f59e0b]" />
    </div>
  );
}

function AINode({ data, selected }: NodeProps<Node<{ label: string; model?: string }>>) {
  return (
    <div
      className={cn(
        "min-w-[200px] bg-[#141414] border rounded-lg overflow-hidden transition-all",
        selected ? "border-[#10b981] ring-1 ring-[#10b981]/30" : "border-[#2a2a2a]"
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-[#10b981]" />
      <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border-b border-[#2a2a2a]">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-xs font-medium text-emerald-400">{data.label}</span>
      </div>
      <div className="px-3 py-2">
        <p className="text-[10px] text-[#666]">模型: {data.model || "GPT-4"}</p>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-[#10b981]" />
    </div>
  );
}

function OutputNode({ data, selected }: NodeProps<Node<{ label: string }>>) {
  return (
    <div
      className={cn(
        "min-w-[160px] bg-[#141414] border rounded-lg overflow-hidden transition-all",
        selected ? "border-white ring-1 ring-white/30" : "border-[#2a2a2a]"
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-white" />
      <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border-b border-[#2a2a2a]">
        <Download className="w-3.5 h-3.5 text-white" />
        <span className="text-xs font-medium text-white">{data.label}</span>
      </div>
      <div className="px-3 py-2">
        <p className="text-[10px] text-[#666]">导出最终作品</p>
      </div>
    </div>
  );
}

const nodeTypes = {
  text: TextNode,
  image: ImageNode,
  video: VideoNode,
  ai: AINode,
  output: OutputNode,
};

const toolbarItems = [
  { type: "text", label: "文本", icon: Type, color: "#fd79a8" },
  { type: "image", label: "图像", icon: Image, color: "#8b5cf6" },
  { type: "video", label: "视频", icon: Video, color: "#f59e0b" },
  { type: "ai", label: "AI处理", icon: Sparkles, color: "#10b981" },
  { type: "output", label: "输出", icon: Download, color: "#ffffff" },
];

export default function CanvasModule() {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "1",
      type: "text",
      position: { x: 100, y: 100 },
      data: { label: "灵感输入", content: "写一个关于校园生活的故事" },
    },
    {
      id: "2",
      type: "ai",
      position: { x: 400, y: 100 },
      data: { label: "AI脚本生成", model: "朋友公司模型" },
    },
    {
      id: "3",
      type: "image",
      position: { x: 700, y: 50 },
      data: { label: "配图生成" },
    },
    {
      id: "4",
      type: "video",
      position: { x: 700, y: 200 },
      data: { label: "视频片段" },
    },
    {
      id: "5",
      type: "output",
      position: { x: 1000, y: 125 },
      data: { label: "导出作品" },
    },
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([
    { id: "e1-2", source: "1", target: "2" },
    { id: "e2-3", source: "2", target: "3" },
    { id: "e2-4", source: "2", target: "4" },
    { id: "e3-5", source: "3", target: "5" },
    { id: "e4-5", source: "4", target: "5" },
  ]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        id: `e-${connection.source}-${connection.target}-${Date.now()}`,
        source: connection.source || "",
        target: connection.target || "",
        animated: true,
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const addNode = (type: string) => {
    const label = `新${toolbarItems.find((t) => t.type === type)?.label || "节点"}`;
    const newNode = {
      id: Date.now().toString(),
      type,
      position: { x: 200 + Math.random() * 200, y: 200 + Math.random() * 100 },
      data: { label },
    };
    setNodes((nds: typeof nodes) => [...nds, newNode]);
  };

  const deleteSelected = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) =>
        eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id)
      );
      setSelectedNode(null);
    }
  };

  return (
    <AppLayout title="无限画布" fullWidth>
      <div className="h-[calc(100vh-0px)] flex bg-[#0a0a0a]">
        {/* Left Toolbar */}
        <div className="w-[60px] bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col items-center py-4 gap-2 z-10">
          <div className="mb-2">
            <MousePointer className="w-5 h-5 text-[#a0a0a0]" />
          </div>
          {toolbarItems.map((item) => (
            <button
              key={item.type}
              onClick={() => addNode(item.type)}
              className="group relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-colors"
            >
              <item.icon className="w-5 h-5" style={{ color: item.color }} />
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                {item.label}
              </div>
            </button>
          ))}
          <div className="mt-auto flex flex-col gap-2">
            <button
              onClick={deleteSelected}
              disabled={!selectedNode}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-lg transition-colors",
                selectedNode
                  ? "hover:bg-red-500/10 text-[#a0a0a0] hover:text-red-400"
                  : "text-[#333] cursor-not-allowed"
              )}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-[#0a0a0a]"
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#2a2a2a" gap={20} size={1} />
            <Controls className="!bg-[#141414] !border-[#2a2a2a] !text-white" />
            <MiniMap
              className="!bg-[#141414] !border-[#2a2a2a]"
              nodeColor={(node) => {
                const colors: Record<string, string> = {
                  text: "#fd79a8",
                  image: "#8b5cf6",
                  video: "#f59e0b",
                  ai: "#10b981",
                  output: "#ffffff",
                };
                return colors[node.type || ""] || "#666";
              }}
              maskColor="rgba(10,10,10,0.7)"
            />

            {/* Run Button */}
            <Panel position="top-right">
              <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <Play className="w-4 h-4" />
                运行工作流
              </button>
            </Panel>
          </ReactFlow>
        </div>

        {/* Right Properties Panel */}
        {selectedNode && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-[#0d0d0d] border-l border-[#1a1a1a] overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white">节点属性</h3>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded hover:bg-[#1a1a1a] text-[#666] hover:text-white"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#a0a0a0] mb-1 block">节点ID</label>
                  <div className="px-3 py-2 bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-[#666]">
                    {selectedNode.id}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#a0a0a0] mb-1 block">类型</label>
                  <div className="px-3 py-2 bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white capitalize">
                    {selectedNode.type}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#a0a0a0] mb-1 block">位置</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="px-3 py-2 bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-[#666]">
                      X: {Math.round(selectedNode.position.x)}
                    </div>
                    <div className="px-3 py-2 bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-[#666]">
                      Y: {Math.round(selectedNode.position.y)}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1a1a1a]">
                  <button
                    onClick={deleteSelected}
                    className="w-full flex items-center justify-center gap-2 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg text-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    删除节点
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
