"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SlideMenu } from "../controls/SlideMenu";
import { PointItem } from "./PointItem";

interface SlideCardProps {
	index: number;
	slide: { title: string; points?: string[] };
	totalSlides: number;
	// onTitleChange: (index: number, value: string) => void;
	// onPointChange: (slideIndex: number, pointIndex: number, value: string) => void;
	// onMoveUp: (index: number) => void;
	// onMoveDown: (index: number) => void;
	// onDelete: (index: number) => void;
}

export const SlideCard: React.FC<SlideCardProps> = ({
	index,
	slide,
	totalSlides,
	// onTitleChange,
	// onPointChange,
	// onMoveUp,
	// onMoveDown,
	// onDelete,
}) => {
	return (
		<Card className="overflow-hidden bg-field">
			<CardHeader>
				<div className="flex items-center justify-between gap-3">
					<div className="flex items-center gap-3 flex-1">
						<div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary font-bold text-3xl">
							{index + 1}
						</div>
						<Input
							value={slide.title}
							readOnly
							className="text-xl font-semibold"
							placeholder="Название слайда"
						/>
					</div>
					<SlideMenu
						slideIndex={index}
						totalSlides={totalSlides}
						// onMoveUp={() => onMoveUp(index)}
						// onMoveDown={() => onMoveDown(index)}
						// onDelete={() => onDelete(index)}
					/>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					{slide.points?.map((point, pointIndex) => (
						<PointItem
							key={pointIndex}
							point={point}
							// onChange={(value) => onPointChange(index, pointIndex, value)}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	);
};
