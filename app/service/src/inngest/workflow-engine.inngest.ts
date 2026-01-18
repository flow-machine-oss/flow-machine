import { Engine } from "@inngest/workflow-kit";
import z from "zod";
import { currentUserSchema } from "@/guard/auth-check.guard";
import { ctx } from "@/inngest/ctx.inngest";
import { workflowActions } from "@/inngest/workflow-action.inngest";
import { idSchema } from "@/lib/id";
import { getWorkflowUseCase } from "@/use-case/workflow/get-workflow.use-case";

const loaderPayloadSchema = z.object({
  data: z.object({
    workflowId: idSchema,
    user: currentUserSchema,
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
        user: data.user,
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
