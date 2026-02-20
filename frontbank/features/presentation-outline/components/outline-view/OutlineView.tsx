"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { OutlineHeader } from "./OutlineHeader";
import { SlideCard } from "./SlideCard";
import { useOutlineEditor } from "../../hooks/useOutlineEditor";
import { useAutoSave } from "../../hooks/useAutoSave";
import { PresentationOutline } from "../../store/usePresentationOutlineStore";

interface OutlineViewProps {
	outline: PresentationOutline;
}

export const OutlineView: React.FC<OutlineViewProps> = ({ outline }) => {
	// const {
	//   plan,
	//   handleSlideTitleChange,
	//   handlePointChange,
	//   moveSlideUp,
	//   moveSlideDown,
	//   removeSlide,
	//   addSlide,
	// } = useOutlineEditor();

	// useAutoSave(outline.id);

	// if (!plan) {
	//   return (
	//     <div className="bg-accent2 rounded-2xl p-7">
	//       <OutlineHeader title="Содержание" />
	//       <div className="text-center py-8 text-muted-foreground">
	//         План пуст. Добавьте слайды для начала работы.
	//       </div>
	//       <Button onClick={addSlide} variant="white">
	//         <Plus className="h-4 w-4 mr-2" />
	//         Добавить первый слайд
	//       </Button>
	//     </div>
	//   );
	// }

	return (
		<div className="bg-accent2 rounded-2xl">
			<OutlineHeader title="Содержание" />

			<div className="grid gap-4 p-7">
				{outline.plan.map((slide, index) => (
					<SlideCard
						key={index}
						index={index}
						slide={slide}
						totalSlides={outline.plan.length}
						// onTitleChange={handleSlideTitleChange}
						// onPointChange={handlePointChange}
						// onMoveUp={moveSlideUp}
						// onMoveDown={moveSlideDown}
						// onDelete={removeSlide}
					/>
				))}
				{/* <Button variant="white">
          <Plus className="h-4 w-4 mr-2" />
          Добавить слайд
        </Button> */}
			</div>
		</div>
	);
};
