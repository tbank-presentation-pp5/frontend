import React from "react";
import { useEditableTextField } from "../../ws/useEditableTextField";
import { useIsViewer } from "./ViewerContext";

interface EditableTextProps {
  field: {
    fieldId: number;
    value: string;
  };
  className?: string;
}

const EditableTextEditor: React.FC<EditableTextProps> = ({ field, className }) => {
  const { value, setValue, hasError } = useEditableTextField(field.fieldId, field.value);

  return (
    <div {...hasError && { style: { color: "red" } }}>
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
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

export const EditableText: React.FC<EditableTextProps> = ({ field, className }) => {
  const isViewer = useIsViewer();

  if (isViewer) {
    return <div className={className}>{field.value}</div>;
  }

  return <EditableTextEditor field={field} className={className} />;
};
