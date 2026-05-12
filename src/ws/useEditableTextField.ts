import { useState, useEffect, useCallback, useRef } from "react";
import { wsManager } from "./websocketManager";

export const useEditableTextField = (
  fieldId: number,
  initialValue: string
) => {
  const [serverValue, setServerValue] = useState(initialValue);
  const [draftValue, setDraftValue] = useState(initialValue);
  const [status, setStatus] =
    useState<"idle" | "sending" | "error">("idle");

  const debounceRef = useRef<number>(1);

  useEffect(() => {
    const handler = (message: any) => {
      if (
        message.type === "EDIT_PLAIN_TEXT" &&
        message.fieldId === fieldId
      ) {
        console.log("Server confirmed:", message.text);

        setServerValue(message.text);
        setDraftValue(message.text);
        setStatus("idle");
      }
    };

    wsManager.addListener(`field:${fieldId}`, handler);

    return () => {
      wsManager.removeListener(`field:${fieldId}`, handler);
    };
  }, [fieldId]);

  const setValue = useCallback(
    (newText: string) => {
      setDraftValue(newText);
      setStatus("sending");

      clearTimeout(debounceRef.current);

      debounceRef.current = window.setTimeout(() => {
        wsManager.send({
          type: "EDIT_PLAIN_TEXT",
          fieldId,
          text: newText,
        });

        window.setTimeout(() => {
          setStatus((current) =>
            current === "sending" ? "error" : current
          );
        }, 1000);
      }, 1000);
    },
    [fieldId]
  );

  return {
    value: draftValue,
    setValue,
    isPending: status === "sending",
    hasError: status === "error",
    serverValue,
  };
};