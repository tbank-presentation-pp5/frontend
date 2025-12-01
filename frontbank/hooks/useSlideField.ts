import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { usePresentationStore } from '@/store/usePresentationStore';
import { toast } from 'sonner';

export function useSlideField(
    slideId: number,
    fieldId: number,
    initialValue: string
) {
    const updateContent = usePresentationStore(state => state.updateContent);
    const [value, setValue] = useState(initialValue);
    const debouncedValue = useDebounce(value, 3500);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        if (debouncedValue !== initialValue) {
            toast.info("Презентация обновлена!")
            updateContent(slideId, fieldId, debouncedValue);
        }
    }, [debouncedValue, initialValue, slideId, fieldId, updateContent]);

    return [value, setValue] as const;
}