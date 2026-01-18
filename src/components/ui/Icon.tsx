"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowLeftRight,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bold,
  Briefcase,
  Building2,
  CirclePlus,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  CreditCard,
  Dices,
  Download,
  ExternalLink,
  Eye,
  Facebook,
  FileImage,
  FilePlus2,
  FileText,
  FlipHorizontal,
  Github,
  Globe,
  Grid,
  Grid3X3,
  Image as ImageIcon,
  Instagram,
  Layers,
  LayoutGrid,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Moon,
  Move,
  MousePointer2,
  Palette,
  Pen,
  Phone,
  Play,
  Printer,
  RefreshCcw,
  QrCode,
  Redo,
  Redo2,
  Save,
  Settings,
  Shield,
  SendToBack,
  Square,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Sun,
  Trash,
  Twitter,
  Undo,
  Undo2,
  Upload,
  Users,
  VectorSquare,
  Wand2,
  TriangleAlert,
  X,
  Youtube,
  Zap,
  ZoomIn,
  ZoomOut,
  RotateCw,
  BringToFront,
  Italic,
  Minus,
  Plus,
  Underline,
} from "lucide-react";

export type IconName =
  | "AlignLeft"
  | "AlignCenter"
  | "AlignRight"
  | "ArrowLeftRight"
  | "ArrowLeft"
  | "ArrowRight"
  | "BadgeCheck"
  | "Bold"
  | "Briefcase"
  | "Building2"
  | "CirclePlus"
  | "Check"
  | "CheckCircle2"
  | "ChevronDown"
  | "ChevronUp"
  | "Copy"
  | "CreditCard"
  | "Dices"
  | "Download"
  | "ExternalLink"
  | "Eye"
  | "Facebook"
  | "FileImage"
  | "FilePlus2"
  | "FileText"
  | "FlipHorizontal"
  | "Github"
  | "Globe"
  | "Grid"
  | "Grid3X3"
  | "Image"
  | "Instagram"
  | "Layers"
  | "LayoutGrid"
  | "Linkedin"
  | "Mail"
  | "MapPin"
  | "Menu"
  | "Moon"
  | "Move"
  | "MousePointer2"
  | "Palette"
  | "Pen"
  | "Phone"
  | "Play"
  | "Printer"
  | "RefreshCcw"
  | "QrCode"
  | "Redo"
  | "Redo2"
  | "Save"
  | "Settings"
  | "Shield"
  | "SendToBack"
  | "Square"
  | "SlidersHorizontal"
  | "Smartphone"
  | "Sparkles"
  | "Sun"
  | "Trash"
  | "Twitter"
  | "Undo"
  | "Undo2"
  | "Upload"
  | "Users"
  | "VectorSquare"
  | "Wand2"
  | "TriangleAlert"
  | "X"
  | "Youtube"
  | "Zap"
  | "ZoomIn"
  | "ZoomOut"
  | "RotateCw"
  | "BringToFront"
  | "Italic"
  | "Underline"
  | "Plus"
  | "Minus";

export type IconSize =
  | "input" // 16px
  | "button" // 18px
  | "toolbar" // 20px
  | "action" // 24px
  | "xs" // 16px
  | "sm" // 18px
  | "md" // 20px
  | "lg" // 24px
  | number;

const ICONS: Record<IconName, LucideIcon> = {
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowLeftRight,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bold,
  Briefcase,
  Building2,
  CirclePlus,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  CreditCard,
  Dices,
  Download,
  ExternalLink,
  Eye,
  Facebook,
  FileImage,
  FilePlus2,
  FileText,
  FlipHorizontal,
  Github,
  Globe,
  Grid,
  Grid3X3,
  Image: ImageIcon,
  Instagram,
  Layers,
  LayoutGrid,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Moon,
  Move,
  MousePointer2,
  Palette,
  Pen,
  Phone,
  Play,
  Printer,
  RefreshCcw,
  QrCode,
  Redo,
  Redo2,
  Save,
  Settings,
  Shield,
  SendToBack,
  Square,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Sun,
  Trash,
  Twitter,
  Undo,
  Undo2,
  Upload,
  Users,
  VectorSquare,
  Wand2,
  TriangleAlert,
  X,
  Youtube,
  Zap,
  ZoomIn,
  ZoomOut,
  RotateCw,
  BringToFront,
  Italic,
  Underline,
  Plus,
  Minus,
};

function resolveSize(size: IconSize | undefined): number {
  if (typeof size === "number") return size;
  switch (size) {
    case "input":
    case "xs":
      return 16;
    case "button":
    case "sm":
      return 18;
    case "toolbar":
    case "md":
      return 20;
    case "action":
    case "lg":
      return 24;
    default:
      return 20;
  }
}

export function Icon({
  name,
  size = "md",
  className,
  strokeWidth = 2,
  style,
  title,
  decorative,
}: {
  name: IconName;
  size?: IconSize;
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
  title?: string;
  decorative?: boolean;
}) {
  const Lucide = ICONS[name];
  const px = resolveSize(size);

  return (
    <Lucide
      size={px}
      strokeWidth={strokeWidth}
      style={style}
      className={
        "shrink-0 text-current transition-[transform,opacity] duration-150 ease-out group-hover:opacity-95 group-hover:scale-[1.02] " +
        (className ?? "")
      }
      aria-hidden={decorative ? true : undefined}
      focusable={false}
      {...(title ? { title } : {})}
    />
  );
}
