import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { type UseFormProps, useForm } from "react-hook-form";
import {
  type NewProjectFormValues,
  newProjectFormValuesSchema,
} from "@/frontend/feature/new-project/new-project-form-schema";

export const useNewProjectForm = (
  props?: UseFormProps<NewProjectFormValues>,
) => {
  return useForm<NewProjectFormValues>({
    defaultValues: {
      name: "",
    },
    resolver: standardSchemaResolver(newProjectFormValuesSchema),
    ...props,
  });
};
