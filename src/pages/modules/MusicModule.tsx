import { useState } from "react";
import { motion } from "framer-motion";
import {
  Music,
  Play,
  Pause,
  Wand2,
  Heart,
  Sparkles,
  Clock,
  Mic2,
  Guitar,
  Piano,
  Drum,
  Music2,
  Headphones,
  Download,
  Share2,
  RefreshCw,
  ChevronRight,
  Volume2,
  SkipBack,
  SkipForward,
  Sliders,
  Mic,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/AppLayout";

/* ===== 心情风格映射 ===== */
const moodStyles = [
  { id: "peaceful", label: "宁静", emoji: "🍃", color: "#74b9ff", desc: "轻柔治愈" },
  { id: "energetic", label: "活力", emoji: "⚡", color: "#FFD166", desc: "节奏明快" },
  { id: "romantic", label: "浪漫", emoji: "🌹", color: "#fd79a8", desc: "温柔抒情" },
  { id: "focus", label: "专注", emoji: "🎯", color: "#4A90E2", desc: "沉浸工作" },
  { id: "sad", label: "释怀", emoji: "🌧️", color: "#a29bfe", desc: "情绪释放" },
  { id: "dreamy", label: "梦幻", emoji: "✨", color: "#A78BFA", desc: "空灵唯美" },
];

/* ===== 音乐风格 ===== */
const musicGenres = [
  { id: "pop", label: "流行", icon: Music2 },
  { id: "folk", label: "民谣", icon: Guitar },
  { id: "classical", label: "古典", icon: Piano },
  { id: "electronic", label: "电子", icon: Sliders },
  { id: "rock", label: "摇滚", icon: Drum },
  { id: "jazz", label: "爵士", icon: Mic2 },
];

/* ===== 乐器选择 ===== */
const instruments = [
  { id: "piano", label: "钢琴", icon: Piano },
  { id: "guitar", label: "吉他", icon: Guitar },
  { id: "violin", label: "小提琴", icon: Music2 },
  { id: "drums", label: "鼓组", icon: Drum },
  { id: "synth", label: "合成器", icon: Sliders },
  { id: "vocal", label: "人声", icon: Mic },
];

/* ===== 示例生成的音乐 ===== */
const demoTracks = [
  { id: 1, title: "清晨的光", mood: "peaceful", genre: "folk", duration: "3:24", liked: false },
  { id: 2, title: "星空漫步", mood: "dreamy", genre: "electronic", duration: "4:12", liked: true },
  { id: 3, title: "雨后花园", mood: "romantic", genre: "classical", duration: "3:08", liked: false },
  { id: 4, title: "专注时刻", mood: "focus", genre: "piano", duration: "5:01", liked: false },
];

export default function MusicModule() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [lyricsInput, setLyricsInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTracks, setGeneratedTracks] = useState<typeof demoTracks>([]);
  const [currentTrack, setCurrentTrack] = useState<(typeof demoTracks)[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<"create" | "library">("create");

  const toggleInstrument = (id: string) => {
    setSelectedInstruments((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    if (!selectedMood || !selectedGenre) return;
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      const moodLabel = moodStyles.find((m) => m.id === selectedMood)?.label || "";
      const genreLabel = musicGenres.find((g) => g.id === selectedGenre)?.label || "";
      const newTrack = {
        id: Date.now(),
        title: `${moodLabel}${genreLabel} · ${lyricsInput.slice(0, 8) || "即兴创作"}`,
        mood: selectedMood,
        genre: selectedGenre,
        duration: `${Math.floor(Math.random() * 3 + 2)}:${Math.floor(Math.random() * 50 + 10)}`,
        liked: false,
      };
      setGeneratedTracks((prev) => [newTrack, ...prev]);
      setIsGenerating(false);
      setCurrentTrack(newTrack);
    }, 2500);
  };

  const handlePlayTrack = (track: (typeof demoTracks)[0]) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  return (
    <AppLayout title="音乐创作" showSidebar>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #FFD166, #FFB347)" }}
            >
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>
                音乐创作
              </h1>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                用AI谱出你此刻的心情旋律
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit" style={{ background: "rgba(0,0,0,0.03)" }}>
          <button
            onClick={() => setActiveTab("create")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === "create" ? "text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
            style={activeTab === "create" ? { background: "linear-gradient(135deg, #FFD166, #FFB347)" } : {}}
          >
            <Sparkles className="w-3.5 h-3.5 inline mr-1.5" />
            创作新曲
          </button>
          <button
            onClick={() => setActiveTab("library")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === "library" ? "text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
            style={activeTab === "library" ? { background: "linear-gradient(135deg, #FFD166, #FFB347)" } : {}}
          >
            <Headphones className="w-3.5 h-3.5 inline mr-1.5" />
            我的作品
          </button>
        </div>

        {activeTab === "create" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {/* Step 1: Select Mood */}
            <div className="rounded-2xl p-5 border bg-white shadow-sm mb-4" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold" style={{ background: "linear-gradient(135deg, #FFD166, #FFB347)" }}>
                  1
                </div>
                <h2 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                  选择心情
                </h2>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {moodStyles.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all",
                      selectedMood === mood.id ? "scale-105" : "hover:scale-105"
                    )}
                    style={{
                      background: selectedMood === mood.id ? `${mood.color}15` : "rgba(248,250,255,0.8)",
                      borderColor: selectedMood === mood.id ? `${mood.color}50` : "rgba(0,0,0,0.06)",
                      boxShadow: selectedMood === mood.id ? `0 4px 16px ${mood.color}15` : "none",
                    }}
                  >
                    <span className="text-xl">{mood.emoji}</span>
                    <span
                      className="text-[11px] font-medium"
                      style={{ color: selectedMood === mood.id ? mood.color : "var(--color-text)" }}
                    >
                      {mood.label}
                    </span>
                    <span className="text-[9px]" style={{ color: "var(--color-text-dim)" }}>
                      {mood.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Genre */}
            <div className="rounded-2xl p-5 border bg-white shadow-sm mb-4" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold" style={{ background: "linear-gradient(135deg, #FFD166, #FFB347)" }}>
                  2
                </div>
                <h2 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                  音乐风格
                </h2>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {musicGenres.map((genre) => {
                  const Icon = genre.icon;
                  return (
                    <button
                      key={genre.id}
                      onClick={() => setSelectedGenre(genre.id)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                        selectedGenre === genre.id ? "scale-105" : "hover:scale-105"
                      )}
                      style={{
                        background: selectedGenre === genre.id ? "#FFD16615" : "rgba(248,250,255,0.8)",
                        borderColor: selectedGenre === genre.id ? "#FFD16650" : "rgba(0,0,0,0.06)",
                        boxShadow: selectedGenre === genre.id ? "0 4px 16px #FFD16615" : "none",
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: selectedGenre === genre.id ? "#FFD16620" : "rgba(0,0,0,0.03)",
                        }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color: selectedGenre === genre.id ? "#E8940C" : "#94A3B8" }}
                        />
                      </div>
                      <span
                        className="text-[11px] font-medium"
                        style={{ color: selectedGenre === genre.id ? "#E8940C" : "var(--color-text)" }}
                      >
                        {genre.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Instruments */}
            <div className="rounded-2xl p-5 border bg-white shadow-sm mb-4" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold" style={{ background: "linear-gradient(135deg, #FFD166, #FFB347)" }}>
                  3
                </div>
                <h2 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                  偏好乐器（可选）
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {instruments.map((inst) => {
                  const Icon = inst.icon;
                  const isSelected = selectedInstruments.includes(inst.id);
                  return (
                    <button
                      key={inst.id}
                      onClick={() => toggleInstrument(inst.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all",
                        isSelected ? "scale-105" : "hover:scale-105"
                      )}
                      style={{
                        background: isSelected ? "#FFD16615" : "rgba(248,250,255,0.8)",
                        borderColor: isSelected ? "#FFD16650" : "rgba(0,0,0,0.06)",
                        color: isSelected ? "#E8940C" : "var(--color-text-secondary)",
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {inst.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Lyrics / Theme */}
            <div className="rounded-2xl p-5 border bg-white shadow-sm mb-4" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold" style={{ background: "linear-gradient(135deg, #FFD166, #FFB347)" }}>
                  4
                </div>
                <h2 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                  歌词或主题（可选）
                </h2>
              </div>
              <textarea
                value={lyricsInput}
                onChange={(e) => setLyricsInput(e.target.value)}
                placeholder="输入一段歌词、诗句，或者描述你想表达的主题和情感...&#10;例如：春天的校园里，樱花飘落，和好朋友告别的下午"
                className="w-full rounded-xl px-4 py-3 text-sm border resize-none outline-none focus:ring-2 transition-all"
                style={{
                  background: "rgba(248,250,255,0.8)",
                  borderColor: "rgba(0,0,0,0.06)",
                  color: "var(--color-text)",
                  minHeight: "100px",
                  ringColor: "#FFD16640",
                }}
              />
            </div>

            {/* Generate Button */}
            <motion.button
              onClick={handleGenerate}
              disabled={!selectedMood || !selectedGenre || isGenerating}
              className="w-full py-3.5 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 mb-6 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: !selectedMood || !selectedGenre ? "#CBD5E1" : "linear-gradient(135deg, #FFD166, #FFB347)",
                boxShadow: selectedMood && selectedGenre ? "0 4px 16px #FFD16630" : "none",
              }}
              whileHover={selectedMood && selectedGenre ? { scale: 1.01 } : {}}
              whileTap={selectedMood && selectedGenre ? { scale: 0.99 } : {}}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  AI正在谱写旋律...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  生成音乐
                </>
              )}
            </motion.button>

            {/* Generated Tracks */}
            {generatedTracks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-5 border bg-white shadow-sm mb-6"
                style={{ borderColor: "rgba(0,0,0,0.06)" }}
              >
                <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--color-text)" }}>
                  已生成的音乐
                </h2>
                <div className="space-y-2">
                  {generatedTracks.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-sm"
                      style={{ borderColor: "rgba(0,0,0,0.06)", background: currentTrack?.id === track.id ? "#FFD16608" : "transparent" }}
                    >
                      <button
                        onClick={() => handlePlayTrack(track)}
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                        style={{ background: "linear-gradient(135deg, #FFD166, #FFB347)" }}
                      >
                        {currentTrack?.id === track.id && isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 ml-0.5" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "var(--color-text)" }}>
                          {track.title}
                        </p>
                        <div className="flex items-center gap-2 text-[10px]" style={{ color: "var(--color-text-dim)" }}>
                          <span className="px-1.5 py-0.5 rounded" style={{ background: "#FFD16615", color: "#E8940C" }}>
                            {musicGenres.find((g) => g.id === track.genre)?.label || track.genre}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {track.duration}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setGeneratedTracks((prev) =>
                            prev.map((t) => (t.id === track.id ? { ...t, liked: !t.liked } : t))
                          );
                        }}
                        className="p-2 rounded-lg transition-colors"
                      >
                        <Heart
                          className="w-4 h-4"
                          style={{ color: track.liked ? "#fd79a8" : "#CBD5E1", fill: track.liked ? "#fd79a8" : "none" }}
                        />
                      </button>
                      <button className="p-2 rounded-lg transition-colors" style={{ color: "var(--color-text-dim)" }}>
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === "library" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {/* Demo Tracks */}
            <div className="rounded-2xl p-5 border bg-white shadow-sm" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                  创作记录
                </h2>
                <span className="text-[10px] px-2 py-1 rounded-full" style={{ background: "#FFD16615", color: "#E8940C" }}>
                  {demoTracks.length + generatedTracks.length} 首
                </span>
              </div>
              <div className="space-y-2">
                {[...generatedTracks, ...demoTracks].map((track, index) => (
                  <div
                    key={`${track.id}-${index}`}
                    className="flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-sm"
                    style={{ borderColor: "rgba(0,0,0,0.06)", background: currentTrack?.id === track.id ? "#FFD16608" : "transparent" }}
                  >
                    <button
                      onClick={() => handlePlayTrack(track)}
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                      style={{ background: "linear-gradient(135deg, #FFD166, #FFB347)" }}
                    >
                      {currentTrack?.id === track.id && isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--color-text)" }}>
                        {track.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px]" style={{ color: "var(--color-text-dim)" }}>
                        <span className="px-1.5 py-0.5 rounded" style={{ background: "#FFD16615", color: "#E8940C" }}>
                          {musicGenres.find((g) => g.id === track.genre)?.label || track.genre}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          {track.duration}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (index < generatedTracks.length) {
                          setGeneratedTracks((prev) =>
                            prev.map((t) => (t.id === track.id ? { ...t, liked: !t.liked } : t))
                          );
                        }
                      }}
                      className="p-2 rounded-lg transition-colors"
                    >
                      <Heart
                        className="w-4 h-4"
                        style={{
                          color: track.liked ? "#fd79a8" : "#CBD5E1",
                          fill: track.liked ? "#fd79a8" : "none",
                        }}
                      />
                    </button>
                    <button className="p-2 rounded-lg transition-colors" style={{ color: "var(--color-text-dim)" }}>
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="mt-6 rounded-2xl p-5 border bg-white shadow-sm" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#FFD16615" }}>
                  <Music className="w-4 h-4" style={{ color: "#E8940C" }} />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
                    即将接入 AI 音乐生成 API
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                    我们正在对接国内领先的 AI 音乐生成服务，届时你将可以直接生成完整的音乐作品，支持多种风格、自定义歌词和乐器编排。敬请期待！
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Player Bar */}
        {currentTrack && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-0 left-0 right-0 border-t bg-white/95 backdrop-blur-md z-40"
            style={{ borderColor: "rgba(0,0,0,0.06)", paddingLeft: "230px" }}
          >
            <div className="flex items-center gap-4 px-6 py-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #FFD166, #FFB347)" }}
                >
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--color-text)" }}>
                    {currentTrack.title}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--color-text-dim)" }}>
                    {musicGenres.find((g) => g.id === currentTrack.genre)?.label || currentTrack.genre} ·{" "}
                    {currentTrack.duration}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg transition-colors" style={{ color: "var(--color-text-dim)" }}>
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{ background: "linear-gradient(135deg, #FFD166, #FFB347)" }}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <button className="p-2 rounded-lg transition-colors" style={{ color: "var(--color-text-dim)" }}>
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              <div className="hidden md:flex items-center gap-2 flex-1 max-w-[200px]">
                <Volume2 className="w-3.5 h-3.5" style={{ color: "var(--color-text-dim)" }} />
                <div className="flex-1 h-1 rounded-full" style={{ background: "#E2E8F0" }}>
                  <div className="h-full rounded-full" style={{ width: "60%", background: "linear-gradient(90deg, #FFD166, #FFB347)" }} />
                </div>
              </div>

              <div className="hidden md:flex items-center gap-1">
                <button className="p-2 rounded-lg transition-colors" style={{ color: "var(--color-text-dim)" }}>
                  <Heart className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg transition-colors" style={{ color: "var(--color-text-dim)" }}>
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg transition-colors" style={{ color: "var(--color-text-dim)" }}>
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
