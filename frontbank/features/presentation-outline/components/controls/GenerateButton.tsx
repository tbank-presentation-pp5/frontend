"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useGeneratePresentation } from "../../hooks/useGeneratePresentation";

export const GenerateButton: React.FC<{
	planId: number;
	className?: string;
}> = ({ planId, className }) => {
	const { isLoading, generate } = useGeneratePresentation(planId);

	return (
		<div className="sticky bottom-6 backdrop-blur p-4 rounded-lg border shadow-lg flex justify-center">
			<Button
				onClick={generate}
				className={`${className} ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
				variant="yellow"
				disabled={isLoading}
			>
				{isLoading ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Генерируем...
					</>
				) : (
					<>
						<Sparkles className="mr-2 h-4 w-4" />
						Сгенерировать презентацию
					</>
				)}
			</Button>
		</div>
	);
};
