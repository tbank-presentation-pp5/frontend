"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { OutlineView } from "@/features/presentation-outline/components/outline-view/OutlineView";
import { GenerateButton } from "@/features/presentation-outline/components/controls/GenerateButton";
import { PageHeader } from "@/features/presentation-outline/components/ui/PageHeader";
import { ErrorState } from "@/features/presentation-outline/components/ui/ErrorState";
import {
	useOutline,
	useActions,
	useError,
} from "@/features/presentation-outline/store/usePresentationOutlineStore";

export default function PresentationOutlinePage() {
	const params = useParams();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const error = useError();
	const outline = useOutline();
	const { loadOutline } = useActions();

	const id = Number(params.id);

	useEffect(() => {
		setIsLoading(true);

		if (id && !isNaN(id)) {
			loadOutline(id);
			setIsLoading(false);
		}
	}, [id, loadOutline]);

	if (error || !outline) {
		return (
			<ErrorState
				error={error || `План презентации с ID ${id} не найден`}
				onBack={() => router.push("/")}
			/>
		);
	}

	if (isLoading) {
		return <div>Загрузка...</div>;
	}

	return (
		<div className="min-h-screen w-[1104px] mx-auto bg-background">
			<div className="container py-8">
				<PageHeader onBack={() => router.push("/")} />

				<OutlineView outline={outline} />

				<GenerateButton planId={id} />
			</div>
		</div>
	);
}
