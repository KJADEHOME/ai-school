import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Heart,
  Eye,
  TrendingUp,
  Clock,
  Grid3X3,
  LayoutList,
  Image,
  PenLine,
  Palette,
  Box,
  Clapperboard,
  LayoutGrid,
  Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/AppLayout";

interface GalleryItem {
  id: string;
  title: string;
  author: string;
  avatar: string | null;
  moduleType: string;
  moduleColor: string;
  moduleIcon: typeof Image;
  likes: number;
  views: number;
  createdAt: string;
  featured?: boolean;
}

const moduleFilters = [
  { id: "all", label: "全部", icon: Sparkles, color: "#ffffff" },
  { id: "copywriting", label: "策划文案", icon: PenLine, color: "#10b981" },
  { id: "graphic", label: "平面设计", icon: Palette, color: "#8b5cf6" },
  { id: "3d", label: "3D设计", icon: Box, color: "#06b6d4" },
  { id: "drama", label: "短剧生成", icon: Clapperboard, color: "#f59e0b" },
  { id: "canvas", label: "无限画布", icon: LayoutGrid, color: "#ec4899" },
];

const mockItems: GalleryItem[] = [
  {
    id: "1",
    title: "校园宣传片脚本 - 春天篇",
    author: "张同学",
    avatar: null,
    moduleType: "copywriting",
    moduleColor: "#10b981",
    moduleIcon: PenLine,
    likes: 128,
    views: 456,
    createdAt: "2小时前",
    featured: true,
  },
  {
    id: "2",
    title: "毕业展览海报设计",
    author: "李同学",
    avatar: null,
    moduleType: "graphic",
    moduleColor: "#8b5cf6",
    moduleIcon: Palette,
    likes: 256,
    views: 892,
    createdAt: "5小时前",
    featured: true,
  },
  {
    id: "3",
    title: "产品展示3D场景",
    author: "王同学",
    avatar: null,
    moduleType: "3d",
    moduleColor: "#06b6d4",
    moduleIcon: Box,
    likes: 89,
    views: 345,
    createdAt: "1天前",
  },
  {
    id: "4",
    title: "微电影分镜 - 邂逅",
    author: "赵同学",
    avatar: null,
    moduleType: "drama",
    moduleColor: "#f59e0b",
    moduleIcon: Clapperboard,
    likes: 167,
    views: 534,
    createdAt: "1天前",
  },
  {
    id: "5",
    title: "无限画布 - 品牌工作流",
    author: "钱同学",
    avatar: null,
    moduleType: "canvas",
    moduleColor: "#ec4899",
    moduleIcon: LayoutGrid,
    likes: 95,
    views: 278,
    createdAt: "2天前",
  },
  {
    id: "6",
    title: "社团招新文案",
    author: "孙同学",
    avatar: null,
    moduleType: "copywriting",
    moduleColor: "#10b981",
    moduleIcon: PenLine,
    likes: 78,
    views: 234,
    createdAt: "3天前",
  },
  {
    id: "7",
    title: "科技节活动海报",
    author: "周同学",
    avatar: null,
    moduleType: "graphic",
    moduleColor: "#8b5cf6",
    moduleIcon: Palette,
    likes: 312,
    views: 1024,
    createdAt: "3天前",
    featured: true,
  },
  {
    id: "8",
    title: "校园Vlog分镜脚本",
    author: "吴同学",
    avatar: null,
    moduleType: "drama",
    moduleColor: "#f59e0b",
    moduleIcon: Clapperboard,
    likes: 134,
    views: 445,
    createdAt: "4天前",
  },
];

const sortOptions = [
  { id: "trending", label: "最热", icon: TrendingUp },
  { id: "recent", label: "最新", icon: Clock },
];

type ViewMode = "grid" | "list";

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  const filtered =
    activeFilter === "all"
      ? mockItems
      : mockItems.filter((item) => item.moduleType === activeFilter);

  const sorted =
    sortBy === "trending"
      ? [...filtered].sort((a, b) => b.likes - a.likes)
      : [...filtered]; // Already sorted by recent

  const toggleLike = (id: string) => {
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <AppLayout title="灵感广场">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-white">灵感广场</h1>
          <p className="text-sm text-[#a0a0a0] mt-0.5">
            发现来自师生们的优秀创作作品
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            {moduleFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all",
                  activeFilter === filter.id
                    ? "text-white border"
                    : "bg-[#141414] text-[#a0a0a0] border border-[#2a2a2a] hover:border-[#333]"
                )}
                style={
                  activeFilter === filter.id
                    ? {
                        backgroundColor: `${filter.color}20`,
                        borderColor: `${filter.color}40`,
                        color: filter.color,
                      }
                    : undefined
                }
              >
                <filter.icon className="w-3.5 h-3.5" />
                {filter.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort */}
            <div className="flex items-center gap-1 bg-[#141414] border border-[#2a2a2a] rounded-lg p-0.5">
              {sortOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1.5 rounded-md text-xs transition-all",
                    sortBy === opt.id
                      ? "bg-[#1a1a1a] text-white"
                      : "text-[#a0a0a0] hover:text-white"
                  )}
                >
                  <opt.icon className="w-3.5 h-3.5" />
                  {opt.label}
                </button>
              ))}
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-1 bg-[#141414] border border-[#2a2a2a] rounded-lg p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewMode === "grid"
                    ? "bg-[#1a1a1a] text-white"
                    : "text-[#a0a0a0] hover:text-white"
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewMode === "list"
                    ? "bg-[#1a1a1a] text-white"
                    : "text-[#a0a0a0] hover:text-white"
                )}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Featured Banner (only on "all" filter) */}
        {activeFilter === "all" && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockItems
              .filter((item) => item.featured)
              .slice(0, 3)
              .map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative bg-[#141414] border border-[#2a2a2a] hover:border-[#333] rounded-xl overflow-hidden transition-all hover:-translate-y-0.5 cursor-pointer group">
                    <div
                      className="aspect-[2/1] relative"
                      style={{
                        background: `linear-gradient(135deg, ${item.moduleColor}30 0%, #141414 60%)`,
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <item.moduleIcon
                          className="w-12 h-12"
                          style={{ color: item.moduleColor, opacity: 0.5 }}
                        />
                      </div>
                      <div className="absolute top-3 left-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                          style={{
                            backgroundColor: `${item.moduleColor}30`,
                            color: item.moduleColor,
                          }}
                        >
                          {
                            moduleFilters.find(
                              (m) => m.id === item.moduleType
                            )?.label
                          }
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-white truncate group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-[#666]">
                          by {item.author}
                        </span>
                        <div className="flex items-center gap-3 text-xs text-[#666]">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {item.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {item.views}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        )}

        {/* Items Grid/List */}
        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              : "space-y-3"
          )}
        >
          {sorted.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {viewMode === "grid" ? (
                <div className="group bg-[#141414] border border-[#2a2a2a] hover:border-[#333] rounded-xl overflow-hidden transition-all hover:-translate-y-0.5">
                  {/* Thumbnail */}
                  <div
                    className="aspect-video relative"
                    style={{
                      background: `linear-gradient(135deg, ${item.moduleColor}20 0%, #141414 100%)`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <item.moduleIcon
                        className="w-10 h-10"
                        style={{ color: item.moduleColor, opacity: 0.4 }}
                      />
                    </div>
                    <div className="absolute top-2 right-2">
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px]"
                        style={{
                          backgroundColor: `${item.moduleColor}30`,
                          color: item.moduleColor,
                        }}
                      >
                        {
                          moduleFilters.find((m) => m.id === item.moduleType)
                            ?.label
                        }
                      </span>
                    </div>
                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-white truncate">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center text-[8px] text-white font-medium">
                          {item.author[0]}
                        </div>
                        <span className="text-xs text-[#666]">
                          {item.author}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleLike(item.id)}
                        className={cn(
                          "flex items-center gap-1 text-xs transition-colors",
                          likedItems.has(item.id)
                            ? "text-red-400"
                            : "text-[#666] hover:text-red-400"
                        )}
                      >
                        <Heart
                          className={cn(
                            "w-3.5 h-3.5",
                            likedItems.has(item.id) && "fill-current"
                          )}
                        />
                        {item.likes + (likedItems.has(item.id) ? 1 : 0)}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="group flex items-center gap-4 bg-[#141414] border border-[#2a2a2a] hover:border-[#333] rounded-xl p-4 transition-all hover:-translate-y-0.5 cursor-pointer">
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${item.moduleColor}20` }}
                  >
                    <item.moduleIcon
                      className="w-7 h-7"
                      style={{ color: item.moduleColor }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-white truncate">
                        {item.title}
                      </h3>
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px]"
                        style={{
                          backgroundColor: `${item.moduleColor}30`,
                          color: item.moduleColor,
                        }}
                      >
                        {
                          moduleFilters.find((m) => m.id === item.moduleType)
                            ?.label
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center text-[6px] text-white font-medium">
                        {item.author[0]}
                      </div>
                      <span className="text-xs text-[#666]">
                        {item.author}
                      </span>
                      <span className="text-xs text-[#333]">·</span>
                      <span className="text-xs text-[#666]">
                        {item.createdAt}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#666]">
                    <button
                      onClick={() => toggleLike(item.id)}
                      className={cn(
                        "flex items-center gap-1 transition-colors",
                        likedItems.has(item.id)
                          ? "text-red-400"
                          : "hover:text-red-400"
                      )}
                    >
                      <Heart
                        className={cn(
                          "w-4 h-4",
                          likedItems.has(item.id) && "fill-current"
                        )}
                      />
                      {item.likes + (likedItems.has(item.id) ? 1 : 0)}
                    </button>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {item.views}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="px-6 py-2 bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#333] rounded-lg text-sm text-[#a0a0a0] hover:text-white transition-all">
            加载更多
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
