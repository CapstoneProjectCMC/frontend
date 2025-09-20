export type ExerciseStatisticsResponse = {
  exerciseId: string;
  title: string;
  exerciseType: 'QUIZ' | 'CODING';
  visibility: boolean;
  orgId: string | null;
  assignedCount: number;
  completedCount: number;
  completionRate: number;
  submissionCount: number;
  passedCount: number;
  passRate: number;
  avgScore: number;
  lastSubmissionAt: string;
};

export type SummaryStatisticsAdmin = {
  totalExercises: number;
  totalVisibleExercises: number;
  totalQuiz: number;
  totalCoding: number;
  totalAssignments: number;
  totalCompletedAssignments: number;
  totalSubmissions: number;
  totalPassedSubmissions: number;
};
export type PaymentStatisticsAdmin = {
  day: string;
  totalAmount: number;
};
export type PaymentStatisticsUser = {
  day: string;
  depositAmount: number;
  purchaseAmount: number;
  walletBalance: number;
};
