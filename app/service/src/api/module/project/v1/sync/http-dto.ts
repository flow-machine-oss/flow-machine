import z from "zod";

const postProjectSyncRequestBodyDtoSchema = z.object({
  entityType: z.enum(["aiAgent", "gitRepository", "workflowDefinition"]),
});

const postProjectSyncRequestParamsDtoSchema = z.object({
  projectId: z.string(),
});

export {
  postProjectSyncRequestBodyDtoSchema,
  postProjectSyncRequestParamsDtoSchema,
};
