"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileDown, Loader2 } from "lucide-react";
import { downloadPresentationPPTX } from "@/services/api/requests";

interface PPTXExportProps {
	presentationId: number;
	presentationName: string;
	className?: string;
	variant?:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link";
	size?: "default" | "sm" | "lg" | "icon";
}

export const PPTXExport: React.FC<PPTXExportProps> = ({
	presentationId,
	presentationName,
	className = "",
	variant = "default",
	size = "default",
}) => {
	const [isExporting, setIsExporting] = useState(false);

	const handleExport = async () => {
		if (!presentationId) return;

		setIsExporting(true);

		try {
			// Скачиваем презентацию
			await downloadPresentationPPTX(presentationId, presentationName);

			// Можно добавить toast-уведомление об успешном скачивании
			// toast.success('Презентация успешно скачана!');
		} catch (error) {
			console.error("Error exporting presentation:", error);

			// Показываем сообщение об ошибке
			alert("Ошибка при скачивании презентации. Попробуйте еще раз.");
		} finally {
			setIsExporting(false);
		}
	};

	// Если нет ID презентации, не показываем кнопку
	if (!presentationId) return null;

	return (
		<Button
			onClick={handleExport}
			disabled={isExporting}
			className={`${className} ${isExporting ? "opacity-70 cursor-not-allowed" : ""}`}
			variant={"yellow"}
		>
			{isExporting ? (
				<>
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					Скачиваем...
				</>
			) : (
				<>
					<Download className="mr-2 h-4 w-4" />
					Скачать PPTX
				</>
			)}
		</Button>
	);
};
