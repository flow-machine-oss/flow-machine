import z from "zod";
import { entityIdSchema, newEntityId } from "@/core/domain/entity";
import { projectIssueFieldTypes } from "@/core/domain/project/issue/field/type";
import { projectProviders } from "@/core/domain/project/provider";
import {
  type Tenant,
  TenantAwareEntity,
} from "@/core/domain/tenant-aware-entity";

const projectIssueFieldDefinitionEntityPropsCommonSchema = {
  type: z.enum(projectIssueFieldTypes),
  options: z
    .object({
      value: z.string().min(1).max(256),
      label: z.string().min(1).max(256),
    })
    .array()
    .optional(),

  name: z.string().min(1).max(256),
  integration: z
    .object({
      externalId: z.string().min(1).max(32),
      externalKey: z.string().min(1).max(32),
      provider: z.enum(projectProviders),
    })
    .optional(),
  project: z.object({
    id: entityIdSchema,
  }),
};

const projectIssueFieldDefinitionEntityProps = z.discriminatedUnion("type", [
  z.object({
    ...projectIssueFieldDefinitionEntityPropsCommonSchema,
    type: z.literal("textfield"),
    options: z.undefined().optional(),
  }),
  z.object({
    ...projectIssueFieldDefinitionEntityPropsCommonSchema,
    type: z.literal("select"),
    options: z
      .object({
        value: z.string().min(1).max(256),
        label: z.string().min(1).max(256),
      })
      .array(),
  }),
]);
type ProjectIssueFieldDefinitionEntityProps = z.output<
  typeof projectIssueFieldDefinitionEntityProps
>;

class ProjectIssueFieldDefinitionEntity extends TenantAwareEntity<ProjectIssueFieldDefinitionEntityProps> {
  static makeNew(
    tenant: Tenant,
    props: ProjectIssueFieldDefinitionEntityProps,
  ) {
    return new ProjectIssueFieldDefinitionEntity(newEntityId(), tenant, props);
  }
}

export {
  ProjectIssueFieldDefinitionEntity,
  projectIssueFieldDefinitionEntityProps,
  type ProjectIssueFieldDefinitionEntityProps,
};
