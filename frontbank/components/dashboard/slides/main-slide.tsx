import { Slide } from "@/services/types";
import { EditableTextField } from "../editable-text";

interface MainSlideProps {
	slide: Slide;
}

export const MainSlide: React.FC<MainSlideProps> = ({ slide }) => {
	return (
		<div className="p-11 text-white w-[1104px] h-[621px] bg-[#333333] flex items-center">
			{slide.content.map((field) => (
				<div key={field.fieldId} className="w-full">
					{field.type === "TEXT" ? (
						<div
							className={
								field.key === "title" ? "text-6xl font-bold" : "text-xl"
							}
						>
							<EditableTextField
								field={field}
								slideId={slide.slideId}
								className={
									field.key === "title" ? "text-6xl font-bold" : "text-xl"
								}
							/>
						</div>
					) : (
						<img
							src={field.image.url}
							alt={field.value}
							className="max-w-full max-h-64 mx-auto"
						/>
					)}
				</div>
			))}
		</div>
	);
};
