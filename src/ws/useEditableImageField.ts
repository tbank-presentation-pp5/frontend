import {useState, useCallback, useEffect } from "react";
import { wsManager } from "./websocketManager";

export const useEditableImageField = (
    fieldId: number,
    initialUrl: string
) => {
    const [imageUrl, setImageUrl] = useState(initialUrl)
    const [status, setStatus] = useState<"idle" | "pending" | "error">("idle"); 
    
    useEffect(() => {
        const handler = (message: any) => {
            if (
                message.type === 'IMAGE_UPDATED' &&
                message.fieldId === fieldId
            ) {
                setImageUrl(message.url);
                setStatus("idle");
            }
        }

        wsManager.addListener(`field:${fieldId}`, handler);

        return () => {
            wsManager.removeListener(`field:${fieldId}`, handler);
        };
    }, [fieldId]);
    
    const setImage = useCallback(
        (imageId: number) => {
            setStatus('pending')

            wsManager.send({
                type: 'EDIT_IMAGE',
                fieldId,
                imageId
            })

            window.setTimeout(() => {
                setStatus((current) => 
                current === 'pending' ? 'error' : current
                )
            }, 3000)
        }, [fieldId]
    );

    const setPexelsImage = useCallback(
        (pexelsImageId: number) => {
            setStatus('pending');

            wsManager.send({
                type: 'EDIT_IMAGE_BY_PEXELS',
                fieldId,
                pexelsImageId,
            });

            window.setTimeout(() => {
                setStatus((current) =>
                current === 'pending' ? 'error' : current
            );
            }, 3000);
        },
        [fieldId]
    );

    return {
        imageUrl,
        setImage,
        setPexelsImage,
        isPending: status === 'pending',
        hasError: status === 'error',
    }
}