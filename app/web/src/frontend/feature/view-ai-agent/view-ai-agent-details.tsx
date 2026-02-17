import { format } from "date-fns";
import type { AiAgentDomain } from "@/domain/entity/ai-agent/ai-agent-domain-schema";
import { Badge } from "@/frontend/component/ui/badge";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/frontend/component/ui/field";

const modelDisplayNames: Record<AiAgentDomain["model"], string> = {
  "anthropic/claude-haiku-4.5": "Claude Haiku 4.5",
  "anthropic/claude-opus-4.5": "Claude Opus 4.5",
  "anthropic/claude-sonnet-4.5": "Claude Sonnet 4.5",
  "minimax/minimax-m2.1": "MiniMax M2.1",
  "x-ai/grok-code-fast-1": "Grok Code Fast 1",
  "z-ai/glm-4.7": "GLM 4.7",
};

type ViewAiAgentDetailsProps = {
  aiAgent: AiAgentDomain;
};

export function ViewAiAgentDetails({ aiAgent }: ViewAiAgentDetailsProps) {
  return (
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
              {modelDisplayNames[aiAgent.model]}
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
  );
}
