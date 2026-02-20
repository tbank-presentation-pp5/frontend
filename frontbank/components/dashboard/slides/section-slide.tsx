import { Slide } from "@/services/types";
import { EditableTextField } from "../editable-text";

interface SectionSlideProps {
	slide: Slide;
}

export const SectionSlide: React.FC<SectionSlideProps> = ({ slide }) => {
	return (
		<div className="text-white w-[1104px] h-[621px] bg-[#222424] flex items-center gap-16">
			<div className="w-[253px] h-[621px] bg-[#333333] rounded-br-[90px]">
				{/* Левая панель */}
			</div>

			<div className="flex-1 p-8">
				{slide.content.map((field) => (
					<div key={field.fieldId}>
						{field.type === "TEXT" ? (
							<EditableTextField
								field={field}
								slideId={slide.slideId}
								className={
									field.key.includes("title") ? "text-5xl font-bold" : "text-lg"
								}
							/>
						) : (
							<img
								src={field.image?.url}
								alt={field.value}
								className="max-w-full max-h-64 mx-auto rounded-lg"
							/>
						)}
					</div>
				))}
			</div>
		</div>
	);
};
