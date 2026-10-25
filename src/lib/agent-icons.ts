import { Award, Bot, Brain, Briefcase, Code2, FileText, FolderKanban, GraduationCap, Instagram, Linkedin, Mail, MessageSquare, Presentation, Sparkles, Trophy, Vault, Video, Wand2, type LucideIcon } from 'lucide-react';

const icons: Record<string, LucideIcon> = { Award, Brain, Briefcase, Code2, FileText, FolderKanban, GraduationCap, Instagram, Linkedin, Mail, MessageSquare, Presentation, Sparkles, Trophy, Vault, Video, Wand2 };
export function agentIcon(name: string): LucideIcon { return icons[name] ?? Bot; }