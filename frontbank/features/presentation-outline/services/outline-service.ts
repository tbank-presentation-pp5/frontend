import {
	updatePresentationPlan,
	getPresentationOutline,
} from "@/services/api/requests";
import { PresentationOutline } from "../store/usePresentationOutlineStore";

export class OutlineService {
	static async loadById(id: number): Promise<PresentationOutline> {
		return await getPresentationOutline(id);
	}

	static async save(planId: number, plan: PresentationOutline["plan"]) {
		return await updatePresentationPlan(planId, plan);
	}
}
