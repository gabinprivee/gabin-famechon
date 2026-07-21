export type CategoryId = 'fps' | 'tycoon' | 'precision' | 'strategy' | 'daily' | 'secret';

export interface Level {
  id: number;
  title: string;
  description: string;
  task: string;
  codeSnippet?: string;
  testCode?: string;
}

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  iconName: string;
  levels: Level[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface UserProgress {
  levels: Record<string, number[]>;
  achievements: string[];
  dailyLastCompleted?: string;
  dailyStreak: number;
}
