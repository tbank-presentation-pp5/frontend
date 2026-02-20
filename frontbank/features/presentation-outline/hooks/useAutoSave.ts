import { useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { OutlineService } from "../services/outline-service";
import { useActions, useOutline } from "../store/usePresentationOutlineStore";

export const useAutoSave = (outlineId?: number) => {
	const currentOutline = useOutline();
	const { setOutline } = useActions();
	const debouncedOutline = useDebounce(currentOutline, 3000);

	useEffect(() => {
		if (!outlineId || !debouncedOutline) return;

		const save = async () => {
			try {
				const updated = await OutlineService.save(
					outlineId,
					debouncedOutline.plan,
				);
				setOutline(updated);
			} catch (error) {
				console.error("Ошибка автосохранения:", error);
			}
		};

		save();
	}, [debouncedOutline, outlineId]);
};
