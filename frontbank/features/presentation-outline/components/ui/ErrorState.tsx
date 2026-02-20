import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ErrorStateProps {
	error: string;
	onBack: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onBack }) => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-4">
			<AlertCircle className="h-12 w-12 text-destructive mb-4" />
			<h1 className="text-2xl font-bold mb-2">Ошибка загрузки</h1>
			<p className="text-muted-foreground mb-6 text-center">{error}</p>
			<Button onClick={onBack}>
				<ArrowLeft className="mr-2 h-4 w-4" />
				Вернуться назад
			</Button>
		</div>
	);
};
