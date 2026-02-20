export interface Presentation {
	templatePresentationId: number;
	presentationId: number;
	name: string;
	createdAt: string;
	slides: Slide[];
}

export interface Slide {
	slideId: number;
	templateSlideId: number;
	type: "MAIN" | "SECTION" | "TEXT_WITH_IMAGE";
	orderNumber: number;
	content: SlideContent[];
}

export interface SlideContent {
	templateFieldId: number;
	fieldId: number;
	type: "TEXT" | "IMAGE";
	key: string;
	value: string;
	image: {
		id: number;
		url: string;
	};
}

export type page = "create" | "ai" | "text" | "file";

export type PromptStore = {
	page: page;
	setPage: (page: page) => void;
};

export interface GenerateOutlineRequest {
	numberOfSlides: number;
	shortDescription: string;
}
