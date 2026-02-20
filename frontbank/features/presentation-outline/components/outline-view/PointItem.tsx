import { Textarea } from "@/components/ui/textarea";
import { ChevronRight } from "lucide-react";

interface PointItemProps {
	point: string;
	// onChange: (value: string) => void;
}

export const PointItem: React.FC<PointItemProps> = ({ point }) => {
	return (
		<div className="flex gap-3">
			<ChevronRight className="h-4 w-4 flex text-muted-foreground mt-3" />
			<Textarea
				value={point}
				readOnly
				className="min-h-10 resize-none flex-col justify-center"
				placeholder="Текст пункта"
			/>
		</div>
	);
};
