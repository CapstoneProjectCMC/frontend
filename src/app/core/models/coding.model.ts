export type CodeSubmission = {
  submissionId: number;
  submittedCode: string;
  userId: string;
  exerciseId: string;
  memory: number;
  cpus: number;
};

export type CodingResponse = {
  submissionId: string;
  status: string;
  actualOutput: string;
  expectedOutput: string;
  message: string;
  timeUsedMs: number;
  memoryUsedKb: number;
};
