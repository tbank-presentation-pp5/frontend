import React from "react";
import { useEditableTextField } from "../../ws/useEditableTextField";

interface EditableTextProps {
  field: {
    fieldId: number;
    value: string;
  };
  className?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
  field,
  className,
}) => {
  const { value, setValue, isPending, hasError } = useEditableTextField(field.fieldId, field.value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <div 
    // {...isPending && { style: { opacity: 0.5 } }}
    {...hasError && { style: { color: "red" } }}>
      <textarea
        value={value}
        onChange={handleChange}
        className={className}
        style={{
          backgroundColor: "transparent",
          border: "none",
          resize: "none",
          scrollbarWidth: "none",
          padding: 0,
        }}
    />
    </div>
  );
};