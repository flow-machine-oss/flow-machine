import type { Result } from "neverthrow";
import type { Err } from "@/common/err/err";
import type { WorkflowActionDefinitionEntity } from "@/v2/core/domain/workflow/definition/action/entity";

interface WorkflowActionDefinitionCrudService {
  list(): Promise<Result<WorkflowActionDefinitionEntity[], Err>>;
}

export { type WorkflowActionDefinitionCrudService };
