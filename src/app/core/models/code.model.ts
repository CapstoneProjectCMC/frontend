import { UserBasicInfo } from './exercise.model';

export type CodingDetails = {
  topic: string;
  allowedLanguages: string[];
  input: string;
  output: string;
  constraintText: string;
  timeLimit: number; // seconds
  memoryLimit: number; // MB
  maxSubmissions: number;
  codeTemplate: string;
  solution: string;
  testCases: TestCase[] | [];
};

export type TestCase = {
  input: string;
  expectedOutput: string;
  sample: boolean;
  note: string;
};

export type ExerciseCodeResponse = {
  id: string;
  user: UserBasicInfo | null;
  title: string;
  description: string;
  exerciseType: 'CODING' | 'QUIZ'; // hoặc tạo enum nếu cần cố định
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | string;
  orgId: string;
  active: boolean;
  cost: number;
  freeForOrg: boolean;
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  duration: number; // minutes
  allowDiscussionId: string;
  resourceIds: string[];
  tags: string[];
  allowAiQuestion: boolean;
  visibility: boolean;
  codingDetail: CodingDetailResponse;
};

export type CodingDetailResponse = {
  id: string;
  topic: string;
  allowedLanguages: string[];
  input: string;
  output: string;
  constraintText: string;
  timeLimit: number; // seconds
  memoryLimit: number; // MB
  maxSubmissions: number;
  codeTemplate: string;
  solution: string;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  testCases: TestCaseResponse[];
};

export type TestCaseResponse = {
  id: string;
  input: string;
  expectedOutput: string;
  sample: boolean;
  note: string;
  delete?: boolean | undefined;
};

export type AddCodeDetailsRequest = {
  topic: string;
  allowedLanguages: string[];
  input: string;
  output: string;
  constraintText: string;
  timeLimit: number;
  memoryLimit: number;
  maxSubmissions: number;
  codeTemplate: string;
  solution: string;
  testCases: TestCase[];
};

export type UpdateCodingDetailRequest = {
  topic: string;
  allowedLanguages: string[];
  input: string;
  output: string;
  constraintText: string;
  timeLimit: number; // seconds
  memoryLimit: number; // MB
  maxSubmissions: number;
  codeTemplate: string;
  solution: string;
  testCases: UpdateTestCaseRequest[];
};

export type UpdateTestCaseRequest = {
  id: string;
  input: string;
  expectedOutput: string;
  sample: boolean;
  note: string;
  delete?: boolean;
};

export type submitCodeRequest = {
  exerciseId: String;
  studentId: String;
  language: String;
  sourceCode: String;
  timeTakenSeconds: String;
};

export type SubmitCodeResponse = {
  submissionid: string;
  score: number;
  totalpoints: number;
  passed: boolean;
  results: {
    testcaseid: string;
    passed: boolean;
    runtimems: number;
    memorykb: number;
    output: string;
    errormessage: string;
  }[];
  memorymb: number;
  cpus: number;
  peakmemorymb: number; // bộ nhớ cao nhất đo được
};

export type AddNewCodingDetailsResponse = {
  submissionId: string;
  status: string;
  actualOutput: string;
  expectedOutput: string;
  message: string;
  timeUsedMs: number;
  memoryUsedKb: number;
};

export type MyCodeHistoryResponse = {
  submissionId: string;
  exerciseId: string;
  exerciseTitle: string;
  score: number;
  totalPoints: number;
  timeTakenSeconds: number;
  language: string;
  peakMemoryMb: number;
  status: SubmissionStatus;
  submittedAt: string;
  passed: Boolean;
};

export enum SubmissionStatus {
  SUBMITTED, // 0 – vừa nộp
  PASSED, // 1 – đạt tối đa điểm
  PARTIAL, // 2 – có điểm nhưng chưa max
  FAILED, // 3 – 0 điểm
}
