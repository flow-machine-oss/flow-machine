import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { type UseFormProps, useForm } from "react-hook-form";
import {
  type CreateAiAgentFormValues,
  createAiAgentFormValuesSchema,
} from "@/frontend/feature/create-ai-agent/create-ai-agent-form";

export const useCreateAiAgentForm = (
  props?: UseFormProps<CreateAiAgentFormValues>,
) => {
  return useForm<CreateAiAgentFormValues>({
    defaultValues: {
      name: "",
      model: "anthropic/claude-opus-4.5",
    },
    resolver: standardSchemaResolver(createAiAgentFormValuesSchema),
    ...props,
  });
};
