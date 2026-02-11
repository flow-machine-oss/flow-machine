import { NextRequest, NextResponse } from "next/server";
import type { WorkflowDefinitionHttpClient } from "@/backend/http-client/workflow-definition/workflow-definition-http-client";
import { workflowDefinitionDomainCodec } from "@/backend/http-route-handler/workflow-definition/workflow-definition-route-handler-codec";
import type { WorkflowDefinitionDomain } from "@/domain/entity/workflow-definition/workflow-definition-domain-schema";
import {
  createWorkflowDefinitionServicePortInSchema,
  deleteWorkflowDefinitionServicePortInSchema,
  getWorkflowDefinitionServicePortInSchema,
  updateWorkflowDefinitionServicePortInSchema,
} from "@/domain/port/workflow-definition/workflow-definition-service-port";
import { type HttpEnvelope, okHttpEnvelope } from "@/lib/http/http-schema";

type MakeWorkflowDefinitionRouteHandlerIn = {
  workflowDefinitionHttpClient: WorkflowDefinitionHttpClient;
};

export const makeWorkflowDefinitionRouteHandler = ({
  workflowDefinitionHttpClient,
}: MakeWorkflowDefinitionRouteHandlerIn) => ({
  create: async (request: NextRequest) => {
    const body = await request.json();

    const { body: payload } = createWorkflowDefinitionServicePortInSchema.parse(
      { body },
    );

    await workflowDefinitionHttpClient.create({ payload });

    return NextResponse.json(okHttpEnvelope());
  },

  deleteById: async (
    _: NextRequest,
    ctx: RouteContext<"/api/v1/workflow-definition/[id]">,
  ) => {
    const params = await ctx.params;

    const validatedInput = deleteWorkflowDefinitionServicePortInSchema.parse({
      params,
    });

    await workflowDefinitionHttpClient.deleteById({
      payload: { id: validatedInput.params.id },
    });

    return NextResponse.json(okHttpEnvelope());
  },

  getById: async (
    _: NextRequest,
    ctx: RouteContext<"/api/v1/workflow-definition/[id]">,
  ): Promise<NextResponse<HttpEnvelope<WorkflowDefinitionDomain>>> => {
    const params = await ctx.params;

    const validatedInput = getWorkflowDefinitionServicePortInSchema.parse({
      params,
    });

    const response = await workflowDefinitionHttpClient.getById({
      payload: { id: validatedInput.params.id },
    });
    const data = workflowDefinitionDomainCodec.decode(response.data);

    return NextResponse.json(okHttpEnvelope({ data }));
  },

  list: async (): Promise<
    NextResponse<HttpEnvelope<WorkflowDefinitionDomain[]>>
  > => {
    const listWorkflowDefinitionsClientResponse =
      await workflowDefinitionHttpClient.list();

    const data = listWorkflowDefinitionsClientResponse.data.map((item) =>
      workflowDefinitionDomainCodec.decode(item),
    );

    return NextResponse.json(okHttpEnvelope({ data }));
  },

  updateById: async (
    request: NextRequest,
    ctx: RouteContext<"/api/v1/workflow-definition/[id]">,
  ) => {
    const body = await request.json();
    const params = await ctx.params;

    const validatedInput = updateWorkflowDefinitionServicePortInSchema.parse({
      body,
      params,
    });
    await workflowDefinitionHttpClient.updateById({
      payload: {
        id: validatedInput.params.id,
        body: validatedInput.body,
      },
    });

    return NextResponse.json(okHttpEnvelope());
  },
});
