import { ReactNode } from "react";

export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  type: 'video' | 'interactive' | 'gallery' | 'community';
  component: ReactNode;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  content: ReactNode;
}

export interface ScrollState {
  scrollY: number;
  progress: number;
}
