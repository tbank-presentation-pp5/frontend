import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
	onBack: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ onBack }) => {
	return (
		<div className="mb-8">
			<Button variant="white" onClick={onBack} className="mb-4">
				<ArrowLeft className="mr-2 h-4 w-4" />
				Назад к генерации
			</Button>
			<div className="flex flex-col">
				<div className="flex gap-3 items-center justify-center pr-16 mb-6">
					<h1 className="text-h1">Редактируйте</h1>
				</div>
				<p className="text-center font-light mb-16">
					Здесь вы можете отредактировать текст каждого слайда и дополнительно
					настроить свою презентацию
				</p>
			</div>
		</div>
	);
};
