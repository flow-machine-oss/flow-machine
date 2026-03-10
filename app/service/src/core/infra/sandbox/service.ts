import type { Result } from "neverthrow";
import z from "zod";
import type { Err } from "@/common/err/err";

type SandboxStatus =
  | "creating"
  | "starting"
  | "started"
  | "stopping"
  | "stopped"
  | "archiving"
  | "archived"
  | "destroying"
  | "error"
  | "unknown";

type SandboxInfo = {
  id: string;
  status: SandboxStatus;
  labels: Record<string, string>;
};

type ExecResult = {
  exitCode: number;
  result: string;
};

type CodeRunResult = {
  exitCode: number;
  result: string;
};

type FileMatch = {
  file: string;
  line: number;
  content: string;
};

type SearchFilesResult = {
  files: string[];
};

const sandboxServiceInputSchema = {
  create: z.object({
    language: z.string().optional(),
    image: z.string().optional(),
    envVars: z.record(z.string(), z.string()).optional(),
    labels: z.record(z.string(), z.string()).optional(),
    autoStopInterval: z.number().optional(),
  }),
  get: z.object({
    sandboxId: z.string(),
  }),
  list: z.object({
    labels: z.record(z.string(), z.string()).optional(),
  }),
  start: z.object({
    sandboxId: z.string(),
    timeout: z.number().optional(),
  }),
  stop: z.object({
    sandboxId: z.string(),
    timeout: z.number().optional(),
  }),
  delete: z.object({
    sandboxId: z.string(),
    timeout: z.number().optional(),
  }),
  exec: z.object({
    sandboxId: z.string(),
    command: z.string(),
    cwd: z.string().optional(),
    timeout: z.number().optional(),
  }),
  codeRun: z.object({
    sandboxId: z.string(),
    code: z.string(),
    timeout: z.number().optional(),
  }),
  uploadFile: z.object({
    sandboxId: z.string(),
    content: z.instanceof(Buffer),
    remotePath: z.string(),
  }),
  downloadFile: z.object({
    sandboxId: z.string(),
    remotePath: z.string(),
  }),
  findFiles: z.object({
    sandboxId: z.string(),
    path: z.string(),
    pattern: z.string(),
  }),
  searchFiles: z.object({
    sandboxId: z.string(),
    path: z.string(),
    pattern: z.string(),
  }),
  gitClone: z.object({
    sandboxId: z.string(),
    url: z.string(),
    path: z.string(),
    branch: z.string().optional(),
    commitId: z.string().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
  }),
};

interface SandboxService {
  create(
    input: z.infer<typeof sandboxServiceInputSchema.create>,
  ): Promise<Result<SandboxInfo, Err>>;
  get(
    input: z.infer<typeof sandboxServiceInputSchema.get>,
  ): Promise<Result<SandboxInfo, Err>>;
  list(
    input: z.infer<typeof sandboxServiceInputSchema.list>,
  ): Promise<Result<SandboxInfo[], Err>>;
  start(
    input: z.infer<typeof sandboxServiceInputSchema.start>,
  ): Promise<Result<void, Err>>;
  stop(
    input: z.infer<typeof sandboxServiceInputSchema.stop>,
  ): Promise<Result<void, Err>>;
  delete(
    input: z.infer<typeof sandboxServiceInputSchema.delete>,
  ): Promise<Result<void, Err>>;
  exec(
    input: z.infer<typeof sandboxServiceInputSchema.exec>,
  ): Promise<Result<ExecResult, Err>>;
  codeRun(
    input: z.infer<typeof sandboxServiceInputSchema.codeRun>,
  ): Promise<Result<CodeRunResult, Err>>;
  uploadFile(
    input: z.infer<typeof sandboxServiceInputSchema.uploadFile>,
  ): Promise<Result<void, Err>>;
  downloadFile(
    input: z.infer<typeof sandboxServiceInputSchema.downloadFile>,
  ): Promise<Result<Buffer, Err>>;
  findFiles(
    input: z.infer<typeof sandboxServiceInputSchema.findFiles>,
  ): Promise<Result<FileMatch[], Err>>;
  searchFiles(
    input: z.infer<typeof sandboxServiceInputSchema.searchFiles>,
  ): Promise<Result<SearchFilesResult, Err>>;
  gitClone(
    input: z.infer<typeof sandboxServiceInputSchema.gitClone>,
  ): Promise<Result<void, Err>>;
}

export {
  type SandboxService,
  type SandboxInfo,
  type SandboxStatus,
  type ExecResult,
  type CodeRunResult,
  type FileMatch,
  type SearchFilesResult,
  sandboxServiceInputSchema,
};
