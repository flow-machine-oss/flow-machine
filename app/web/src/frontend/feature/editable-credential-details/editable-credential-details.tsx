import type { CredentialDomain } from "@/domain/entity/credential/credential-domain-schema";
import { makeCredentialDomainService } from "@/domain/entity/credential/credential-domain-service";
import { Badge } from "@/frontend/component/ui/badge";
import { Button } from "@/frontend/component/ui/button";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/frontend/component/ui/field";

type EditableCredentialDetailsProps = {
  credential: CredentialDomain;
  onEdit: () => void;
};

export function EditableCredentialDetails({
  credential,
  onEdit,
}: EditableCredentialDetailsProps) {
  const credentialDomainService = makeCredentialDomainService({ credential });

  return (
    <>
      <FieldSet>
        <FieldLegend>Basic</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Type</FieldLabel>
            <FieldContent>
              <Badge variant="secondary" className="w-fit">
                {credentialDomainService.getTypeDisplayName()}
              </Badge>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>
              {credential.type === "apiKey" ? "API Key" : "Username"}
            </FieldLabel>
            <FieldContent>
              <span className="font-mono text-sm">
                {credentialDomainService.getMaskedValue()}
              </span>
            </FieldContent>
          </Field>
          {credential.type === "basic" && (
            <Field>
              <FieldLabel>Password</FieldLabel>
              <FieldContent>
                <span className="font-mono text-sm">••••••••</span>
              </FieldContent>
            </Field>
          )}
          <Field>
            <FieldLabel>Expired at</FieldLabel>
            <FieldContent>
              <span className="text-sm">
                {credentialDomainService.getExpiredAt()}
              </span>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Created at</FieldLabel>
            <FieldContent>
              <span className="text-sm">
                {credentialDomainService.getCreatedAt()}
              </span>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Updated at</FieldLabel>
            <FieldContent>
              <span className="text-sm">
                {credentialDomainService.getUpdatedAt()}
              </span>
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>
      <Field orientation="horizontal">
        <Button type="button" variant="outline" onClick={onEdit}>
          Edit
        </Button>
      </Field>
    </>
  );
}
