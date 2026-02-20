import { useCallback } from "react";
import { useOutline, useActions } from "../store/usePresentationOutlineStore";
import { SlidePlan } from "../store/usePresentationOutlineStore";

export const useOutlineEditor = () => {
	const plan: SlidePlan[] = useOutline().plan;
	const { setPlan } = useActions();

	const updatePlanInStore = useCallback((newPlan: typeof plan) => {
		if (!newPlan) return;
		setPlan(newPlan);
	}, []);

	const handleSlideTitleChange = useCallback(
		(index: number, value: string) => {
			const newPlan = [...plan];
			newPlan[index] = { ...newPlan[index], title: value };
			updatePlanInStore(newPlan);
		},
		[plan, updatePlanInStore],
	);

	const handlePointChange = useCallback(
		(slideIndex: number, pointIndex: number, value: string) => {
			const newPlan = [...plan];
			if (!newPlan[slideIndex].points) {
				newPlan[slideIndex].points = [];
			}
			newPlan[slideIndex].points![pointIndex] = value;
			updatePlanInStore(newPlan);
		},
		[plan, updatePlanInStore],
	);

	const moveSlideUp = useCallback(
		(slideIndex: number) => {
			if (slideIndex === 0) return;
			const newPlan = [...plan];
			const temp = newPlan[slideIndex];
			newPlan[slideIndex] = newPlan[slideIndex - 1];
			newPlan[slideIndex - 1] = temp;
			updatePlanInStore(newPlan);
		},
		[plan, updatePlanInStore],
	);

	const moveSlideDown = useCallback(
		(slideIndex: number) => {
			if (slideIndex === plan.length - 1) return;
			const newPlan = [...plan];
			const temp = newPlan[slideIndex];
			newPlan[slideIndex] = newPlan[slideIndex + 1];
			newPlan[slideIndex + 1] = temp;
			updatePlanInStore(newPlan);
		},
		[plan, updatePlanInStore],
	);

	const removeSlide = useCallback(
		(slideIndex: number) => {
			if (plan.length <= 1) return;
			const newPlan = plan.filter((_, index) => index !== slideIndex);
			updatePlanInStore(newPlan);
		},
		[plan, updatePlanInStore],
	);

	const addSlide = useCallback(() => {
		const newPlan = [...plan, { title: "Новый слайд", points: [""] }];
		updatePlanInStore(newPlan);
	}, [plan, updatePlanInStore]);

	return {
		plan,
		handleSlideTitleChange,
		handlePointChange,
		moveSlideUp,
		moveSlideDown,
		removeSlide,
		addSlide,
	};
};
