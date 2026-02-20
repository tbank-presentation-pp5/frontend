import { useState } from "react";
import { useRouter } from "next/navigation";
import { generatePresentationFromPlan } from "@/services/api/requests";
import { usePresentationStore } from "@/store/usePresentationStore";
import { toast } from "sonner";

export const useGeneratePresentation = (planId: number) => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { setPresentation } = usePresentationStore();

	const generate = async () => {
		if (!planId) return;

		setIsLoading(true);

		try {
			const presentation = await generatePresentationFromPlan(planId);
			setPresentation(presentation);
			router.push(`/dashboard/${presentation.presentationId}`);
		} catch (error) {
			console.error("Error generating presentation:", error);
			toast.error("Ошибка при генерации презентации. Попробуйте еще раз.");
		} finally {
			setIsLoading(false);
		}
	};

	return { isLoading, generate };
};
