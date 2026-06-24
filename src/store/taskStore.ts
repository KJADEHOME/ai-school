import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TaskStep {
  id: string;
  moduleType: string;
  moduleName: string;
  task: string;
  completed: boolean;
}

export interface TaskLine {
  id: string;
  mood: string;
  moodEmoji: string;
  title: string;
  description: string;
  color: string;
  steps: TaskStep[];
  reward: string;
  completed: boolean;
  createdAt: number;
}

// 预定义的任务线
export const taskLineTemplates: Record<string, Omit<TaskLine, "id" | "completed" | "createdAt" | "steps"> & { steps: Omit<TaskStep, "completed">[] }> = {
  happy: {
    mood: "happy",
    moodEmoji: "😊",
    title: "快乐分享官",
    description: "把今天的快乐记录下来，分享给更多人",
    color: "#f59e0b",
    reward: "快乐分享官徽章",
    steps: [
      { id: "h1", moduleType: "copywriting", moduleName: "策划文案", task: "写一段今天最开心的事，200字左右" },
      { id: "h2", moduleType: "graphic", moduleName: "平面设计", task: "做一张「今日份快乐」分享海报" },
      { id: "h3", moduleType: "drama", moduleName: "短剧生成", task: "写一个15秒快乐瞬间的小剧本" },
      { id: "h4", moduleType: "canvas", moduleName: "无限画布", task: "自由创作一幅「快乐拼贴」" },
    ],
  },
  calm: {
    mood: "calm",
    moodEmoji: "😌",
    title: "静心创作者",
    description: "在平静中找到创作的流动感",
    color: "#4A90E2",
    reward: "静心大师徽章",
    steps: [
      { id: "c1", moduleType: "copywriting", moduleName: "策划文案", task: "写一首关于宁静的小诗" },
      { id: "c2", moduleType: "graphic", moduleName: "平面设计", task: "设计一张冥想主题的静心海报" },
      { id: "c3", moduleType: "3d", moduleName: "3D设计", task: "建造一个宁静的冥想空间" },
      { id: "c4", moduleType: "canvas", moduleName: "无限画布", task: "用蓝色系自由创作一幅「宁静之境」" },
    ],
  },
  anxious: {
    mood: "anxious",
    moodEmoji: "😰",
    title: "焦虑释放者",
    description: "把焦虑转化为创作的动力，释放压力",
    color: "#8b5cf6",
    reward: "压力释放徽章",
    steps: [
      { id: "a1", moduleType: "copywriting", moduleName: "策划文案", task: "写下让你焦虑的3件事，然后给每件写一句「没关系」" },
      { id: "a2", moduleType: "graphic", moduleName: "平面设计", task: "做一张「深呼吸」减压海报" },
      { id: "a3", moduleType: "drama", moduleName: "短剧生成", task: "写一个「焦虑退散」的小短片剧本" },
      { id: "a4", moduleType: "canvas", moduleName: "无限画布", task: "自由创作一幅「释放」主题的作品" },
    ],
  },
  tired: {
    mood: "tired",
    moodEmoji: "😴",
    title: "温柔疗愈师",
    description: "用轻松的创作，给自己一段温柔时光",
    color: "#74b9ff",
    reward: "温柔治愈徽章",
    steps: [
      { id: "t1", moduleType: "copywriting", moduleName: "策划文案", task: "写一段给自己的温柔鼓励" },
      { id: "t2", moduleType: "graphic", moduleName: "平面设计", task: "做一张「今天辛苦了」暖心卡片" },
      { id: "t3", moduleType: "3d", moduleName: "3D设计", task: "建造一个「温馨小窝」" },
      { id: "t4", moduleType: "canvas", moduleName: "无限画布", task: "随意拼贴，不用思考，跟着感觉走" },
    ],
  },
  excited: {
    mood: "excited",
    moodEmoji: "🤩",
    title: "创意冒险家",
    description: "大胆尝试，用创作释放你的热情",
    color: "#ee5a24",
    reward: "创意冒险徽章",
    steps: [
      { id: "e1", moduleType: "copywriting", moduleName: "策划文案", task: "写一个充满激情的创意点子" },
      { id: "e2", moduleType: "graphic", moduleName: "平面设计", task: "设计一张超酷的个人风格海报" },
      { id: "e3", moduleType: "drama", moduleName: "短剧生成", task: "写一个「我的冒险故事」剧本" },
      { id: "e4", moduleType: "canvas", moduleName: "无限画布", task: "大胆混搭，做一幅疯狂的创意拼贴" },
    ],
  },
  low: {
    mood: "low",
    moodEmoji: "😔",
    title: "情绪整理师",
    description: "整理情绪，在创作中重新找回自己",
    color: "#fd79a8",
    reward: "情绪整理徽章",
    steps: [
      { id: "l1", moduleType: "copywriting", moduleName: "策划文案", task: "写下此刻的心情，不用修饰，真实就好" },
      { id: "l2", moduleType: "graphic", moduleName: "平面设计", task: "做一张「明天会更好」励志海报送给自己" },
      { id: "l3", moduleType: "3d", moduleName: "3D设计", task: "建造一个「梦想花园」，种满希望" },
      { id: "l4", moduleType: "canvas", moduleName: "无限画布", task: "自由创作，把所有情绪都放到画布上" },
    ],
  },
};

interface TaskStore {
  activeTask: TaskLine | null;
  taskHistory: TaskLine[];
  startTaskLine: (mood: string) => void;
  completeStep: (stepId: string) => void;
  abandonTask: () => void;
  getProgress: () => number;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      activeTask: null,
      taskHistory: [],

      startTaskLine: (mood: string) => {
        const template = taskLineTemplates[mood];
        if (!template) return;

        const newTask: TaskLine = {
          id: Date.now().toString(),
          mood: template.mood,
          moodEmoji: template.moodEmoji,
          title: template.title,
          description: template.description,
          color: template.color,
          reward: template.reward,
          completed: false,
          createdAt: Date.now(),
          steps: template.steps.map((s) => ({ ...s, completed: false })),
        };

        set({ activeTask: newTask });
      },

      completeStep: (stepId: string) => {
        const { activeTask } = get();
        if (!activeTask) return;

        const updatedSteps = activeTask.steps.map((s) =>
          s.id === stepId ? { ...s, completed: true } : s
        );

        const allCompleted = updatedSteps.every((s) => s.completed);

        const updatedTask: TaskLine = {
          ...activeTask,
          steps: updatedSteps,
          completed: allCompleted,
        };

        set({
          activeTask: allCompleted ? null : updatedTask,
          ...(allCompleted
            ? { taskHistory: [updatedTask, ...get().taskHistory] }
            : {}),
        });
      },

      abandonTask: () => {
        const { activeTask } = get();
        if (activeTask) {
          set({
            activeTask: null,
            taskHistory: [activeTask, ...get().taskHistory],
          });
        }
      },

      getProgress: () => {
        const { activeTask } = get();
        if (!activeTask || activeTask.steps.length === 0) return 0;
        return (
          (activeTask.steps.filter((s) => s.completed).length /
            activeTask.steps.length) *
          100
        );
      },
    }),
    { name: "task-store" }
  )
);
