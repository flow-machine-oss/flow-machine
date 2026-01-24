import { Engine } from "@inngest/workflow-kit";
import z from "zod";
import { ctx } from "@/old/inngest/ctx.inngest";
import { workflowActions } from "@/old/inngest/workflow-action.inngest";
import { idSchema } from "@/old/lib/id";
import { getWorkflowUseCase } from "@/old/use-case/workflow/get-workflow.use-case";

const loaderPayloadSchema = z.object({
  data: z.object({
    workflowId: idSchema,
    organizationId: z.string(),
  }),
});

export const workflowEngine = new Engine({
  actions: workflowActions,
  loader: async (payload: unknown) => {
    const parseResult = loaderPayloadSchema.safeParse(payload);
    if (parseResult.success) {
      const { data } = parseResult.data;
      const result = await getWorkflowUseCase(ctx, {
        id: data.workflowId,
        organizationId: data.organizationId,
      });
      if (result.isErr()) {
        return null;
      }
      return {
        ...result.value,
        actions: result.value.definition.actions,
        edges: result.value.definition.edges,
      };
    }
    return null;
  },
});
