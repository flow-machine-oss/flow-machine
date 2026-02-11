import { NextResponse } from "next/server";
import type { WorkflowActionDefinitionHttpClient } from "@/backend/http-client/workflow-action-definition/workflow-action-definition-http-client";
import { workflowActionDefinitionDomainCodec } from "@/backend/http-route-handler/workflow-action-definition/workflow-action-definition-route-handler-codec";
import { type HttpEnvelope, okHttpEnvelope } from "@/common/http/http-schema";
import type { WorkflowActionDefinitionDomain } from "@/domain/entity/workflow-action-definition/workflow-action-definition-schema";

type MakeWorkflowActionDefinitionRouteHandlerIn = {
  workflowActionDefinitionHttpClient: WorkflowActionDefinitionHttpClient;
};

export const makeWorkflowActionDefinitionRouteHandler = ({
  workflowActionDefinitionHttpClient,
}: MakeWorkflowActionDefinitionRouteHandlerIn) => ({
  list: async (): Promise<
    NextResponse<HttpEnvelope<WorkflowActionDefinitionDomain[]>>
  > => {
    const listWorkflowActionDefinitionsClientResponse =
      await workflowActionDefinitionHttpClient.list();

    const data = listWorkflowActionDefinitionsClientResponse.data.map((item) =>
      workflowActionDefinitionDomainCodec.decode(item),
    );

    return NextResponse.json(okHttpEnvelope({ data }));
  },
});
