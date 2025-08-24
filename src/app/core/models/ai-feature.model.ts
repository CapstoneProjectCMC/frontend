export type ExercisePromptIn = {
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  duration: number; // phút
  tags: string[];
};

export type ExerciseRequestPromt = {
  exercisePromptIn: ExercisePromptIn;
};

export interface IQuizExercisePromtNeed extends ExerciseRequestPromt {
  numQuestions: number;
}

export interface ICodingExercisePromtNeed extends ExerciseRequestPromt {
  allowedLanguages: string[];
  timeLimit: number;
  memoryLimit: number;
  maxSubmissions: number;
  numTestCases: number;
}

export type GenerateExerciseResponse = {
  id: string;
  title: string;
  description: string;
  exerciseType: 'QUIZ' | 'CODING';
};
