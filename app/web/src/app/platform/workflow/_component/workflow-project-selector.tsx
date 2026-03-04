"use client";

import type { ProjectDomain } from "@/domain/entity/project/project-domain-schema";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/frontend/component/ui/combobox";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/frontend/component/ui/field";

type WorkflowProjectSelectorProps = {
  projects: ProjectDomain[];
  selectedProjectIds: string[];
  onSelectedProjectIdsChange: (ids: string[]) => void;
  disabled?: boolean;
};

export function WorkflowProjectSelector({
  projects,
  selectedProjectIds,
  onSelectedProjectIdsChange,
  disabled = false,
}: WorkflowProjectSelectorProps) {
  const chipsRef = useComboboxAnchor();
  const selectedProjects = projects.filter((p) =>
    selectedProjectIds.includes(p.id),
  );

  return (
    <div className="max-w-2xl">
      <Field>
        <FieldLabel>Assigned projects</FieldLabel>
        <FieldDescription>
          Select which projects this workflow belongs to. You can assign it to
          multiple projects.
        </FieldDescription>
        <Combobox
          multiple
          items={projects}
          value={selectedProjects}
          onValueChange={(next: ProjectDomain[]) =>
            onSelectedProjectIdsChange(next.map((p) => p.id))
          }
        >
          <ComboboxChips ref={chipsRef}>
            <ComboboxValue>
              {(value: ProjectDomain[]) => (
                <>
                  {value.map((project) => (
                    <ComboboxChip key={project.id} aria-label={project.name}>
                      {project.name}
                    </ComboboxChip>
                  ))}
                  <ComboboxChipsInput
                    disabled={disabled}
                    placeholder={
                      value.length > 0 ? "" : "Search projects..."
                    }
                  />
                </>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={chipsRef}>
            <ComboboxList>
              {(project: ProjectDomain) => (
                <ComboboxItem key={project.id} value={project}>
                  {project.name}
                </ComboboxItem>
              )}
            </ComboboxList>
            <ComboboxEmpty>No projects found</ComboboxEmpty>
          </ComboboxContent>
        </Combobox>
      </Field>
    </div>
  );
}
