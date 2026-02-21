import { format } from "date-fns";
import type { AiAgentDomain } from "@/domain/entity/ai-agent/ai-agent-domain-schema";
import { makeAiAgentDomainService } from "@/domain/entity/ai-agent/ai-agent-domain-service";
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

type EditableAiAgentDetailsProps = {
  aiAgent: AiAgentDomain;
  onEdit: () => void;
};

export function EditableAiAgentDetails({
  aiAgent,
  onEdit,
}: EditableAiAgentDetailsProps) {
  return (
    <>
      <FieldSet>
        <FieldLegend>Basic</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <FieldContent>
              <span className="text-sm">{aiAgent.name}</span>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Model</FieldLabel>
            <FieldContent>
              <Badge variant="secondary" className="w-fit">
                {makeAiAgentDomainService(aiAgent).modelDisplayName()}
              </Badge>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Created at</FieldLabel>
            <FieldContent>
              <span className="text-sm">
                {format(aiAgent.createdAt, "MMM d, yyyy, h:mm a")}
              </span>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Updated at</FieldLabel>
            <FieldContent>
              <span className="text-sm">
                {format(aiAgent.updatedAt, "MMM d, yyyy, h:mm a")}
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
