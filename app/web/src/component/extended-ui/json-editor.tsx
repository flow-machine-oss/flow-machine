"use client";

import { useState } from "react";
import { Field, FieldError } from "@/component/ui/field";
import { Textarea } from "@/component/ui/textarea";

type JsonEditorProps = {
  value: string;
  onValueChange: (value: string) => void;
};

const isJsonStringValid = (jsonString: string) => {
  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
};

export function JsonEditor({ value, onValueChange }: JsonEditorProps) {
  const [isValid, setIsValid] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const currentJsonString = e.target.value;
    const isCurrentJsonStringValid = isJsonStringValid(currentJsonString);
    setIsValid(isCurrentJsonStringValid);
    onValueChange(
      isCurrentJsonStringValid
        ? JSON.stringify(currentJsonString, null, 2)
        : currentJsonString,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();

      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = value.substring(0, start) + "  " + value.substring(end);

      onValueChange(newValue);

      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      });
    }
  };

  const lineCount = value.split("\n").length;

  return (
    <Field>
      <div className="bg-muted/30 relative overflow-hidden rounded-lg border">
        <div className="flex">
          <div className="bg-muted/50 text-muted-foreground border-r px-3 py-3 text-right font-mono text-sm select-none">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i + 1} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>
          <Textarea
            className="rounded-none border-0"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Paste or type your JSON here..."
            spellCheck={false}
          />
        </div>
      </div>
      {isValid && <FieldError>Invalid JSON</FieldError>}
    </Field>
  );
}
