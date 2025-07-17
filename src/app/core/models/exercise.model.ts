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

//Quiz
// Interface cho option của câu hỏi
export interface QuizOption {
  id: string;
  optionText: string;
  correct: boolean;
  order: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  deletedBy: string;
  deletedAt: string;
}

// Interface cho câu hỏi
export interface QuizQuestion {
  id: string;
  text: string;
  points: number;
  type: string;
  orderInQuiz: number;
  options: QuizOption[];
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  deletedBy: string;
  deletedAt: string;
}

// Interface cho quizDetail
export interface QuizDetail {
  id: string;
  numQuestions: number;
  totalPoints: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number | null;
  questions: QuizQuestion[];
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  deletedBy: string;
  deletedAt: string;
}

// Interface cho bài tập
export interface ExerciseQuiz {
  id: string;
  userId: string;
  title: string;
  description: string;
  exerciseType: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  orgId: string;
  active: boolean;
  cost: number;
  freeForOrg: boolean;
  startTime: string;
  endTime: string;
  duration: number;
  allowDiscussionId: string;
  resourceIds: string[];
  tags: string[];
  allowAiQuestion: boolean;
  quizDetail: QuizDetail | null;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  deletedBy: string;
  deletedAt: string;
}
