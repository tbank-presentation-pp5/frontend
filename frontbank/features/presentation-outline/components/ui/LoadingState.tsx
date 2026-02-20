import { Loader2 } from "lucide-react";

export const LoadingState: React.FC = () => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center">
			<Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
			<p className="text-muted-foreground">Загружаем план презентации...</p>
		</div>
	);
};
