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
  userId: string;
  title: string;
  description: string;
  exerciseType: 'CODING' | string; // hoặc tạo enum nếu cần cố định
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
