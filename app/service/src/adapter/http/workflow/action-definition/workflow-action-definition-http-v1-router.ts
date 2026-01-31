import Elysia from "elysia";
import { type WorkflowActionDefinitionResponseDto } from "@/adapter/http/workflow/action-definition/workflow-action-definition-http-v1-dto";
import { makeHttpAuthGuardPlugin } from "@/common/http/http-auth-guard-plugin";
import { errEnvelope, okEnvelope } from "@/common/http/http-envelope";
import { makeHttpMongoCtxPlugin } from "@/common/http/http-mongo-ctx-plugin";
import type { WorkflowActionDefinitionEntity } from "@/domain/entity/workflow/workflow-action-definition-entity";
import type {
  GetActiveMember,
  GetSession,
} from "@/domain/port/auth/auth-service";
import type { ListWorkflowActionDefinitionsUseCase } from "@/domain/port/workflow/workflow-action-definition-use-case";

type Input = {
  getSession: GetSession;
  getActiveMember: GetActiveMember;
  listWorkflowActionDefinitionsUseCase: ListWorkflowActionDefinitionsUseCase;
};

const toResponseDto = (
  entity: WorkflowActionDefinitionEntity,
): WorkflowActionDefinitionResponseDto => ({
  id: entity.id,
  createdAt: entity.createdAt,
  updatedAt: entity.updatedAt,
  kind: entity.props.kind,
  name: entity.props.name,
});

export const makeWorkflowActionDefinitionHttpV1Router = ({
  getSession,
  getActiveMember,
  listWorkflowActionDefinitionsUseCase,
}: Input) =>
  new Elysia({ name: "workflow-action-definition.v1" })
    .use(makeHttpMongoCtxPlugin())
    .use(makeHttpAuthGuardPlugin({ getSession, getActiveMember }))
    .group("/api/v1/workflow-action-definition", (r) =>
      r.get("", async ({ ctx }) => {
        const result = await listWorkflowActionDefinitionsUseCase({
          ctx,
        });
        if (result.isErr()) {
          return errEnvelope(result.error);
        }
        return okEnvelope({ data: result.value.map(toResponseDto) });
      }),
    );
