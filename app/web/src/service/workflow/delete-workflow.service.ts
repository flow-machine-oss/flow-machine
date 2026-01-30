import type { HttpClient } from "@/lib/http/http-client";
import type { HttpEnvelope } from "@/lib/http/http-dto";
import type { IdParamsDto } from "@/schema/shared.schema";

export type DeleteWorkflowPayload = {
  params: IdParamsDto;
};

export const makeDeleteWorkflow =
  (httpClient: HttpClient) =>
  async ({ params }: DeleteWorkflowPayload) => {
    const response = await httpClient.delete<HttpEnvelope<undefined>>(
      `/api/v1/workflow/${params.id}`,
    );
    return response.data;
  };
