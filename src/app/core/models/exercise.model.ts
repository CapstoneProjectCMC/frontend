export type ExerciseItem = {
  id: string;
  userId: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  exerciseType: 'QUIZ' | 'CODING';
  orgId: string;
  cost: number;
  freeForOrg: boolean;
  tags: Set<string>;
  createdAt: string;
};
