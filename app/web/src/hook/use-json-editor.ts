import { useState } from "react";
import type { z } from "zod/v4";

type useJsonEditorOptions = {
  initialValue?: string;
  schema: z.ZodType;
};

export const useJsonEditor = ({
  initialValue,
  schema,
}: useJsonEditorOptions) => {
  const [value, setValue] = useState<string>(initialValue ?? "");
  const [error, setError] = useState<Error | null>(null);

  const handleValueChange = (newValue: string) => {
    try {
      JSON.parse(newValue);
      setError(null);
    } catch (err) {
      setError(err as Error);
    }
    setValue(newValue);
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(value);
      const formatted = JSON.stringify(parsed, null, 4);
      setValue(formatted);
      setError(null);
    } catch (err) {
      setError(err as Error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();

      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newValue =
        value.substring(0, start) + "    " + value.substring(end);
      handleValueChange(newValue);

      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      });
    }
  };

  const handleValidateSchema = () => {
    try {
      const parsed = JSON.parse(value);
      schema.parse(parsed);
      setError(null);
    } catch (err) {
      setError(err as Error);
    }
  };

  return {
    value,
    error,
    onChange: handleValueChange,
    onFormat: handleFormatJson,
    onKeyDown: handleKeyDown,
    onValidateSchema: handleValidateSchema,
  } as const;
};
