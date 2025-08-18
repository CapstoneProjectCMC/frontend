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
  visibility: boolean;
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

export type CreateExerciseRequest = {
  title: string; // required
  description?: string;
  difficulty: DifficultyLevel; // required enum
  exerciseType: ExerciseType; // required enum
  orgId?: string;
  cost: number; // required; BigDecimal → number
  freeForOrg: boolean; // required
  startTime?: string; // Instant → string (ISO format)
  endTime?: string; // Instant → string
  duration?: number; // int → number
  allowDiscussionId?: string;
  resourceIds?: string[];
  tags?: string[];
  allowAiQuestion?: boolean;
  visibility?: boolean;
};

export type PatchUpdateExerciseRequest = {
  title: String;
  description: String;
  difficulty: DifficultyLevel;
  cost: number;
  freeForOrg: boolean;
  startTime: string;
  endTime: string;
  duration: number;
  allowDiscussionId: String;
  resourceIds: string[];
  tags: string[];
  allowAiQuestion: boolean;
  visibility: boolean;
};

// Enum for difficulty
export enum DifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

// Enum for exercise type
export enum ExerciseType {
  CODING = 'CODING',
  QUIZ = 'QUIZ',
}

export type QuizQuestionCreate = {
  text: string;
  questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'FILL_BLANK'; // hoặc dùng enum nếu cần
  points: number;
  orderInQuiz: number;
  options: QuizOptionCreate[];
};

export type QuizOptionCreate = {
  optionText: string;
  correct: boolean;
  order: string; // A, B, C, D,...
};

export type QuizDetailCreateStupid = {
  questions: QuizQuestionCreate[];
};

export type OptionCreate = {
  optionText: string;
  correct: boolean;
  order: string;
};

export type UpdateQuestionRequest = {
  text: string;
  questionType: 'SINGLE_CHOICE' | ' MULTI_CHOICE ' | 'FILL_BLANK';
  points: number;
  orderInQuiz: number;
};

export type UpdateOptionRequest = {
  optionText: string;
  correct: boolean;
  order: string;
};

export interface QuizOptionWithQuestionRequest {
  id: string;
  optionText: string;
  correct: boolean;
  order: string; // A, B, C,...
  delete: boolean; // true nếu muốn xoá option này
}

export interface QuizQuestionWithOptionRequest {
  text: string;
  questionType: UpdateQuestionRequest['questionType'];
  points: number;
  orderInQuiz: number;
  options: QuizOption[];
}

export interface IExerciseAnswerRequest {
  exerciseId: string;
  studentId: string;
  answers: IAnswer[];
  timeTakenSeconds: number;
}

export interface IAnswer {
  questionId: string;
  selectedOptionId?: string;
  answerText?: string;
}

export interface IExerciseResultResponse {
  score: number;
  totalpoints: number;
  passed: boolean;
  timeTakenSeconds: number;
}

export type ExercisePreview = {
  exercise: {
    id: string;
    title: string;
    description: string;
    totalpoints: number;
    numquestions: number;
    duration: number; // tính theo giây/phút tùy backend
  };
  questions: QuestionPreview[];
};

export type QuestionPreview = {
  id: string;
  text: string;
  questiontype: 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'FILL_BLANK';
  points: number;
  orderinquiz: number;
  options: QuestionOption[];
};

export type QuestionOption = {
  id: string;
  optiontext: string;
  order: string; // ví dụ: "A", "B", "C"
};

export type MyQuizHistoryResponse = {
  submissionId: string;
  exerciseId: string;
  exerciseTitle: string;
  score: number;
  totalPoints: number;
  timeTakenSeconds: number;
  submittedAt: string;
};
