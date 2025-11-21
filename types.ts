export enum View {
  DASHBOARD = 'DASHBOARD',
  PROMPT_BUILDER = 'PROMPT_BUILDER',
  CHAT_TUTOR = 'CHAT_TUTOR',
  QUICK_REFINE = 'QUICK_REFINE',
  LESSONS = 'LESSONS'
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface PromptInputs {
  role: string;
  task: string;
  context: string;
  format: string;
  constraints: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  content: string;
}