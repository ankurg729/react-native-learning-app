import {
  Bell,
  BookOpen,
  Bookmark,
  Bot,
  Brain,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock,
  Compass,
  Copy,
  Database,
  Flame,
  GraduationCap,
  House,
  Image as ImageIcon,
  Info,
  Layers,
  Lightbulb,
  LogOut,
  MessageSquare,
  Monitor,
  Moon,
  Pencil,
  Play,
  RefreshCw,
  Rocket,
  Search,
  Send,
  Settings,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Target,
  Terminal,
  Trash,
  TriangleAlert,
  Trophy,
  User,
  X,
} from 'lucide-react-native';
import type { ComponentType } from 'react';
import type { IconName } from '../types';

interface IconProps {
  color?: string;
  size?: number | string;
  strokeWidth?: number;
  fill?: string;
}

const icons: Record<IconName, ComponentType<IconProps>> = {
  sparkles: Sparkles,
  compass: Compass,
  'book-open': BookOpen,
  bot: Bot,
  user: User,
  bell: Bell,
  bookmark: Bookmark,
  clock: Clock,
  layers: Layers,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  'chevron-down': ChevronDown,
  search: Search,
  x: X,
  play: Play,
  check: Check,
  'circle-check': CircleCheck,
  flame: Flame,
  target: Target,
  copy: Copy,
  send: Send,
  trash: Trash,
  settings: Settings,
  moon: Moon,
  sun: Sun,
  monitor: Monitor,
  info: Info,
  shield: Shield,
  'log-out': LogOut,
  pencil: Pencil,
  trophy: Trophy,
  graduation: GraduationCap,
  database: Database,
  brain: Brain,
  message: MessageSquare,
  rocket: Rocket,
  image: ImageIcon,
  terminal: Terminal,
  lightbulb: Lightbulb,
  alert: TriangleAlert,
  sliders: SlidersHorizontal,
  refresh: RefreshCw,
  home: House,
};

interface AppIconProps {
  name: IconName;
  color: string;
  size?: number;
  strokeWidth?: number;
  filled?: boolean;
}

export function AppIcon({
  name,
  color,
  size = 22,
  strokeWidth = 2,
  filled = false,
}: AppIconProps) {
  const Icon = icons[name];
  return (
    <Icon
      color={color}
      size={size}
      strokeWidth={strokeWidth}
      fill={filled ? color : 'transparent'}
    />
  );
}
