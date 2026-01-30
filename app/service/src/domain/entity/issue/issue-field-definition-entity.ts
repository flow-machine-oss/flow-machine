import { ok } from "neverthrow";
import z from "zod";
import { newEntityId } from "@/common/domain/entity-id";
import {
  type Tenant,
  TenantAwareEntity,
} from "@/common/domain/tenant-aware-entity";
import { issueFieldTypes } from "@/domain/entity/issue/issue-field-type";

export const baseIssueFieldDefinitionEntityProps = z.object({
  name: z.string().min(1).max(256),
  fieldType: z.enum(issueFieldTypes),
  isRequired: z.boolean(),
});

export const issueFieldDefinitionEntityProps = z.discriminatedUnion(
  "fieldType",
  [
    z.object({
      ...baseIssueFieldDefinitionEntityProps.shape,
      fieldType: z.literal("select"),
      options: z
        .object({
          label: z.string().min(1).max(256),
          value: z.string().min(1).max(256),
        })
        .array()
        .min(1),
    }),
    z.object({
      ...baseIssueFieldDefinitionEntityProps.shape,
      fieldType: z.literal("textArea"),
    }),
    z.object({
      ...baseIssueFieldDefinitionEntityProps.shape,
      fieldType: z.literal("textField"),
    }),
  ],
);

export type IssueFieldDefinitionEntityProps = z.output<
  typeof issueFieldDefinitionEntityProps
>;

export class IssueFieldDefinitionEntity extends TenantAwareEntity<IssueFieldDefinitionEntityProps> {
  static makeNew(tenant: Tenant, props: IssueFieldDefinitionEntityProps) {
    return ok(new IssueFieldDefinitionEntity(newEntityId(), tenant, props));
  }

  static makeExisting(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    tenant: Tenant,
    props: IssueFieldDefinitionEntityProps,
  ) {
    return ok(
      new IssueFieldDefinitionEntity(id, tenant, props, {
        createdAt,
        updatedAt,
      }),
    );
  }
}
