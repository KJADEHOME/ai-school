import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clapperboard,
  Plus,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Clock,
  User,
  MapPin,
  Camera,
  Wand2,
  Trash2,
  Copy,
  GripVertical,
  Film,
  Sparkles,
  Download,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/AppLayout";

interface Storyboard {
  id: string;
  sceneNumber: number;
  title: string;
  description: string;
  location: string;
  characters: string[];
  cameraAngle: string;
  duration: number;
  status: "draft" | "generated" | "completed";
}

const mockStoryboards: Storyboard[] = [
  {
    id: "1",
    sceneNumber: 1,
    title: "开场 - 校园全景",
    description: "清晨的阳光洒在校园的主楼上，镜头从天空缓缓下降，展现校园的全貌。学生们背着书包走在林荫道上。",
    location: "校园主楼前",
    characters: ["学生群像"],
    cameraAngle: "航拍俯拍→平视",
    duration: 5,
    status: "completed",
  },
  {
    id: "2",
    sceneNumber: 2,
    title: "主角登场",
    description: "主角小林从教学楼走出来，脸上带着自信的微笑。特写镜头捕捉她的表情。",
    location: "教学楼走廊",
    characters: ["小林"],
    cameraAngle: "中景→特写",
    duration: 3,
    status: "generated",
  },
  {
    id: "3",
    sceneNumber: 3,
    title: "实验室场景",
    description: "小林在实验室里专注地做实验，周围是各种仪器设备。灯光柔和，营造学术氛围。",
    location: "化学实验室",
    characters: ["小林", "实验搭档"],
    cameraAngle: "过肩拍→正面",
    duration: 4,
    status: "draft",
  },
];

const cameraAngles = [
  "正面",
  "侧面",
  "背面",
  "俯拍",
  "仰拍",
  "特写",
  "中景",
  "全景",
  "过肩拍",
];

export default function DramaModule() {
  const [storyboards, setStoryboards] = useState<Storyboard[]>(mockStoryboards);
  const [activeBoardId, setActiveBoardId] = useState<string>("1");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newBoard, setNewBoard] = useState({
    title: "",
    description: "",
    location: "",
    characters: "",
    cameraAngle: "正面",
    duration: 3,
  });

  const activeBoard = storyboards.find((s) => s.id === activeBoardId);
  const totalDuration = storyboards.reduce((sum, s) => sum + s.duration, 0);

  const addStoryboard = () => {
    if (!newBoard.title.trim()) return;
    const board: Storyboard = {
      id: Date.now().toString(),
      sceneNumber: storyboards.length + 1,
      title: newBoard.title,
      description: newBoard.description,
      location: newBoard.location,
      characters: newBoard.characters.split(",").map((c) => c.trim()).filter(Boolean),
      cameraAngle: newBoard.cameraAngle,
      duration: newBoard.duration,
      status: "draft",
    };
    setStoryboards([...storyboards, board]);
    setNewBoard({
      title: "",
      description: "",
      location: "",
      characters: "",
      cameraAngle: "正面",
      duration: 3,
    });
    setShowNewForm(false);
  };

  const deleteBoard = (id: string) => {
    setStoryboards(storyboards.filter((s) => s.id !== id));
    if (activeBoardId === id && storyboards.length > 1) {
      setActiveBoardId(storyboards.find((s) => s.id !== id)?.id || "");
    }
  };

  const duplicateBoard = (board: Storyboard) => {
    const newBoard: Storyboard = {
      ...board,
      id: Date.now().toString(),
      sceneNumber: storyboards.length + 1,
      title: `${board.title} (复制)`,
      status: "draft",
    };
    setStoryboards([...storyboards, newBoard]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/20 text-emerald-400";
      case "generated":
        return "bg-amber-500/20 text-amber-400";
      default:
        return "bg-[#2a2a2a] text-[#666]";
    }
  };

  return (
    <AppLayout title="短剧生成" fullWidth>
      <div className="h-[calc(100vh-0px)] flex bg-[#0a0a0a]">
        {/* Left - Storyboard List */}
        <div className="w-[320px] bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-[#1a1a1a]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-white">分镜列表</h2>
                <p className="text-xs text-[#666] mt-0.5">
                  {storyboards.length} 个分镜 · 总时长 {totalDuration}秒
                </p>
              </div>
              <button
                onClick={() => setShowNewForm(!showNewForm)}
                className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                新建
              </button>
            </div>
          </div>

          {/* New Form */}
          <AnimatePresence>
            {showNewForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-b border-[#1a1a1a]"
              >
                <div className="p-3 space-y-2">
                  <input
                    type="text"
                    placeholder="分镜标题"
                    value={newBoard.title}
                    onChange={(e) =>
                      setNewBoard({ ...newBoard, title: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder:text-[#666] outline-none focus:border-amber-500/50"
                  />
                  <textarea
                    placeholder="场景描述"
                    value={newBoard.description}
                    onChange={(e) =>
                      setNewBoard({ ...newBoard, description: e.target.value })
                    }
                    rows={2}
                    className="w-full px-3 py-2 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder:text-[#666] outline-none focus:border-amber-500/50 resize-none"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="地点"
                      value={newBoard.location}
                      onChange={(e) =>
                        setNewBoard({ ...newBoard, location: e.target.value })
                      }
                      className="flex-1 px-3 py-2 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder:text-[#666] outline-none focus:border-amber-500/50"
                    />
                    <input
                      type="number"
                      placeholder="秒"
                      value={newBoard.duration}
                      onChange={(e) =>
                        setNewBoard({
                          ...newBoard,
                          duration: Number(e.target.value),
                        })
                      }
                      className="w-16 px-3 py-2 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-white outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <button
                    onClick={addStoryboard}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    添加分镜
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {storyboards.map((board, index) => (
              <button
                key={board.id}
                onClick={() => setActiveBoardId(board.id)}
                className={cn(
                  "w-full text-left p-3 border-b border-[#1a1a1a] transition-all group",
                  activeBoardId === board.id
                    ? "bg-[#141414]"
                    : "hover:bg-[#111111]"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <GripVertical className="w-3 h-3 text-[#333]" />
                    <span className="text-xs font-medium text-[#666]">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-white truncate">
                        {board.title}
                      </span>
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[10px]",
                          getStatusColor(board.status)
                        )}
                      >
                        {board.status === "completed"
                          ? "已完成"
                          : board.status === "generated"
                            ? "已生成"
                            : "草稿"}
                      </span>
                    </div>
                    <p className="text-xs text-[#666] line-clamp-2 mb-1.5">
                      {board.description}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-[#666]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {board.duration}秒
                      </span>
                      <span className="flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        {board.cameraAngle}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateBoard(board);
                      }}
                      className="p-1 rounded hover:bg-[#2a2a2a] text-[#666] hover:text-white"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBoard(board.id);
                      }}
                      className="p-1 rounded hover:bg-red-500/10 text-[#666] hover:text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center - Preview & Edit */}
        <div className="flex-1 flex flex-col">
          {activeBoard ? (
            <>
              {/* Preview Area */}
              <div className="flex-1 flex items-center justify-center p-6 bg-[#0a0a0a]">
                <div className="w-full max-w-2xl">
                  {/* Video Preview Placeholder */}
                  <div className="aspect-video bg-[#141414] rounded-xl border border-[#2a2a2a] flex flex-col items-center justify-center relative overflow-hidden">
                    {activeBoard.status === "completed" ? (
                      <div className="text-center">
                        <Film className="w-16 h-16 text-amber-400 mx-auto mb-3" />
                        <p className="text-white font-medium">视频已生成</p>
                        <p className="text-xs text-[#a0a0a0] mt-1">
                          {activeBoard.title}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                          <Clapperboard className="w-8 h-8 text-amber-400" />
                        </div>
                        <p className="text-sm text-[#a0a0a0]">
                          {activeBoard.status === "generated"
                            ? "素材已准备，可合成视频"
                            : "点击生成以创建视频片段"}
                        </p>
                      </div>
                    )}

                    {/* Scene Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="flex items-center gap-4 text-xs text-[#a0a0a0]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {activeBoard.location || "未设置地点"}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {activeBoard.characters.join(", ") || "无角色"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activeBoard.duration}秒
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Playback Controls */}
                  <div className="mt-4 flex items-center justify-center gap-4">
                    <button className="p-2 rounded-lg hover:bg-[#1a1a1a] text-[#a0a0a0] hover:text-white transition-colors">
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>
                    <button className="p-2 rounded-lg hover:bg-[#1a1a1a] text-[#a0a0a0] hover:text-white transition-colors">
                      <SkipForward className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              <div className="h-[280px] border-t border-[#1a1a1a] bg-[#0d0d0d] overflow-y-auto">
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#a0a0a0] mb-1 block">
                        分镜标题
                      </label>
                      <input
                        type="text"
                        value={activeBoard.title}
                        onChange={(e) =>
                          setStoryboards(
                            storyboards.map((s) =>
                              s.id === activeBoardId
                                ? { ...s, title: e.target.value }
                                : s
                            )
                          )
                        }
                        className="w-full px-3 py-2 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-white outline-none focus:border-amber-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#a0a0a0] mb-1 block">
                        拍摄地点
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                        <input
                          type="text"
                          value={activeBoard.location}
                          onChange={(e) =>
                            setStoryboards(
                              storyboards.map((s) =>
                                s.id === activeBoardId
                                  ? { ...s, location: e.target.value }
                                  : s
                              )
                            )
                          }
                          className="w-full pl-9 pr-3 py-2 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-white outline-none focus:border-amber-500/50"
                        />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-[#a0a0a0] mb-1 block">
                        场景描述
                      </label>
                      <textarea
                        value={activeBoard.description}
                        onChange={(e) =>
                          setStoryboards(
                            storyboards.map((s) =>
                              s.id === activeBoardId
                                ? { ...s, description: e.target.value }
                                : s
                            )
                          )
                        }
                        rows={3}
                        className="w-full px-3 py-2 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-white outline-none focus:border-amber-500/50 resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#a0a0a0] mb-1 block">
                        镜头角度
                      </label>
                      <select
                        value={activeBoard.cameraAngle}
                        onChange={(e) =>
                          setStoryboards(
                            storyboards.map((s) =>
                              s.id === activeBoardId
                                ? { ...s, cameraAngle: e.target.value }
                                : s
                            )
                          )
                        }
                        className="w-full px-3 py-2 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-white outline-none focus:border-amber-500/50"
                      >
                        {cameraAngles.map((angle) => (
                          <option key={angle} value={angle}>
                            {angle}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-[#a0a0a0] mb-1 block">
                        时长 (秒)
                      </label>
                      <input
                        type="number"
                        value={activeBoard.duration}
                        onChange={(e) =>
                          setStoryboards(
                            storyboards.map((s) =>
                              s.id === activeBoardId
                                ? { ...s, duration: Number(e.target.value) }
                                : s
                            )
                          )
                        }
                        min={1}
                        max={60}
                        className="w-full px-3 py-2 bg-[#141414] border border-[#2a2a2a] rounded-lg text-sm text-white outline-none focus:border-amber-500/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Clapperboard className="w-12 h-12 text-[#333] mx-auto mb-3" />
                <p className="text-sm text-[#666]">选择一个分镜进行编辑</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-[240px] bg-[#0d0d0d] border-l border-[#1a1a1a] flex flex-col">
          <div className="p-4 border-b border-[#1a1a1a]">
            <h3 className="text-sm font-medium text-white">操作</h3>
          </div>
          <div className="p-4 space-y-3">
            <button
              onClick={() => {
                if (activeBoard) {
                  setStoryboards(
                    storyboards.map((s) =>
                      s.id === activeBoardId
                        ? { ...s, status: "generated" as const }
                        : s
                    )
                  );
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              生成分镜
            </button>
            <button
              onClick={() => {
                if (activeBoard) {
                  setStoryboards(
                    storyboards.map((s) =>
                      s.id === activeBoardId
                        ? { ...s, status: "completed" as const }
                        : s
                    )
                  );
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg text-sm transition-colors"
            >
              <Wand2 className="w-4 h-4" />
              合成视频
            </button>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] text-[#a0a0a0] hover:text-white rounded-lg text-sm transition-colors">
              <Download className="w-4 h-4" />
              导出项目
            </button>
          </div>

          <div className="flex-1 p-4 border-t border-[#1a1a1a]">
            <h4 className="text-xs text-[#a0a0a0] mb-3">项目信息</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#666]">分镜总数</span>
                <span className="text-white">{storyboards.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#666]">总时长</span>
                <span className="text-white">{totalDuration}秒</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#666]">已完成</span>
                <span className="text-emerald-400">
                  {storyboards.filter((s) => s.status === "completed").length}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-[#1a1a1a]">
            <button className="w-full flex items-center justify-center gap-2 py-2 text-xs text-[#666] hover:text-white transition-colors">
              <Settings className="w-3.5 h-3.5" />
              项目设置
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
