export type ExerciseItem = {
  id: string;
  userId: string;
  title: string;
  description: string;
  exerciseType: 'QUIZ' | 'CODE';
  orgId: string;
  cost: number;
  freeForOrg: boolean;
  tags: Set<string>;
  createdAt: string;
};
