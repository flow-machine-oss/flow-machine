import { Daytona, type SandboxState } from "@daytonaio/sdk";
import { err, ok } from "neverthrow";
import { Err } from "@/common/err/err";
import type {
  SandboxInfo,
  SandboxService,
  SandboxStatus,
} from "@/core/infra/sandbox/service";

class DaytonaSandboxService implements SandboxService {
  #daytona: Daytona;

  constructor(daytona: Daytona) {
    this.#daytona = daytona;
  }

  async create(input: Parameters<SandboxService["create"]>[0]) {
    try {
      const sandbox = await this.#daytona.create({
        language: input.language,
        envVars: input.envVars,
        labels: input.labels,
        autoStopInterval: input.autoStopInterval,
      });
      return ok(this.#toSandboxInfo(sandbox));
    } catch (error) {
      return err(Err.from(error));
    }
  }

  async get(input: Parameters<SandboxService["get"]>[0]) {
    try {
      const sandbox = await this.#daytona.get(input.sandboxId);
      return ok(this.#toSandboxInfo(sandbox));
    } catch (error) {
      return err(Err.from(error));
    }
  }

  async list(input: Parameters<SandboxService["list"]>[0]) {
    try {
      const result = await this.#daytona.list(input.labels);
      return ok(result.items.map((s) => this.#toSandboxInfo(s)));
    } catch (error) {
      return err(Err.from(error));
    }
  }

  async start(input: Parameters<SandboxService["start"]>[0]) {
    try {
      const sandbox = await this.#daytona.get(input.sandboxId);
      await this.#daytona.start(sandbox, input.timeout);
      return ok(undefined);
    } catch (error) {
      return err(Err.from(error));
    }
  }

  async stop(input: Parameters<SandboxService["stop"]>[0]) {
    try {
      const sandbox = await this.#daytona.get(input.sandboxId);
      await this.#daytona.stop(sandbox);
      return ok(undefined);
    } catch (error) {
      return err(Err.from(error));
    }
  }

  async delete(input: Parameters<SandboxService["delete"]>[0]) {
    try {
      const sandbox = await this.#daytona.get(input.sandboxId);
      await this.#daytona.delete(sandbox, input.timeout);
      return ok(undefined);
    } catch (error) {
      return err(Err.from(error));
    }
  }

  async exec(input: Parameters<SandboxService["exec"]>[0]) {
    try {
      const sandbox = await this.#daytona.get(input.sandboxId);
      const response = await sandbox.process.executeCommand(
        input.command,
        input.cwd,
        undefined,
        input.timeout,
      );
      return ok({
        exitCode: response.exitCode,
        result: response.result,
      });
    } catch (error) {
      return err(Err.from(error));
    }
  }

  async codeRun(input: Parameters<SandboxService["codeRun"]>[0]) {
    try {
      const sandbox = await this.#daytona.get(input.sandboxId);
      const response = await sandbox.process.codeRun(
        input.code,
        undefined,
        input.timeout,
      );
      return ok({
        exitCode: response.exitCode,
        result: response.result,
      });
    } catch (error) {
      return err(Err.from(error));
    }
  }

  async uploadFile(input: Parameters<SandboxService["uploadFile"]>[0]) {
    try {
      const sandbox = await this.#daytona.get(input.sandboxId);
      await sandbox.fs.uploadFile(input.content, input.remotePath);
      return ok(undefined);
    } catch (error) {
      return err(Err.from(error));
    }
  }

  async downloadFile(input: Parameters<SandboxService["downloadFile"]>[0]) {
    try {
      const sandbox = await this.#daytona.get(input.sandboxId);
      const buffer = await sandbox.fs.downloadFile(input.remotePath);
      return ok(buffer);
    } catch (error) {
      return err(Err.from(error));
    }
  }

  async findFiles(input: Parameters<SandboxService["findFiles"]>[0]) {
    try {
      const sandbox = await this.#daytona.get(input.sandboxId);
      const matches = await sandbox.fs.findFiles(input.path, input.pattern);
      return ok(
        matches.map((m) => ({
          file: m.file ?? "",
          line: m.line ?? 0,
          content: m.content ?? "",
        })),
      );
    } catch (error) {
      return err(Err.from(error));
    }
  }

  async searchFiles(input: Parameters<SandboxService["searchFiles"]>[0]) {
    try {
      const sandbox = await this.#daytona.get(input.sandboxId);
      const result = await sandbox.fs.searchFiles(input.path, input.pattern);
      return ok({
        files: result.files ?? [],
      });
    } catch (error) {
      return err(Err.from(error));
    }
  }

  async gitClone(input: Parameters<SandboxService["gitClone"]>[0]) {
    try {
      const sandbox = await this.#daytona.get(input.sandboxId);
      await sandbox.git.clone(
        input.url,
        input.path,
        input.branch,
        input.commitId,
        input.username,
        input.password,
      );
      return ok(undefined);
    } catch (error) {
      return err(Err.from(error));
    }
  }

  #toSandboxInfo(sandbox: { id: string; state?: SandboxState; labels: Record<string, string> }): SandboxInfo {
    return {
      id: sandbox.id,
      status: this.#mapStatus(sandbox.state),
      labels: sandbox.labels,
    };
  }

  #mapStatus(state?: SandboxState): SandboxStatus {
    switch (state) {
      case "creating":
      case "restoring":
      case "pending_build":
      case "building_snapshot":
      case "pulling_snapshot":
        return "creating";
      case "starting":
        return "starting";
      case "started":
        return "started";
      case "stopping":
        return "stopping";
      case "stopped":
        return "stopped";
      case "archiving":
        return "archiving";
      case "archived":
        return "archived";
      case "destroying":
      case "destroyed":
        return "destroying";
      case "error":
      case "build_failed":
        return "error";
      default:
        return "unknown";
    }
  }
}

export { DaytonaSandboxService };
