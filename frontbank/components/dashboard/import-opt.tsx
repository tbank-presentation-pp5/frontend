import Image from "next/image";
import FieldButton from "./field-button";

export const Import = () => {
	return (
		<div className="flex flex-col">
			<div className="flex gap-3 items-center justify-center pr-16 mb-6">
				<Image src={"/upload.svg"} width={56} height={56} alt="" />
				<h1 className="text-h1">Импортируем</h1>
			</div>
			<a className="text-center font-light mb-16">
				Выберите файл, который будет основой вашей презентации
			</a>
			<div className="flex flex-wrap gap-16 items-center justify-center">
				<FieldButton
					cardProps={{
						photo: "/folder.svg",
						h1: "Локальный файл",
						text: "Загрузите файл со своей системы",
					}}
				/>
				<FieldButton
					cardProps={{
						photo: "/googlefile.svg",
						h1: "Google Drive",
						text: "Выберите файл из Google Drive",
					}}
				/>
				<FieldButton
					cardProps={{
						photo: "/dropbox.svg",
						h1: "Dropbox",
						text: "Выберите файл из Dropbox",
					}}
				/>
			</div>
		</div>
	);
};
