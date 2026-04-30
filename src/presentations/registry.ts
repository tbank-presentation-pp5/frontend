import { Slide1 } from "./slides/MAIN/Slide1";
import { Slide3 } from "./slides/TEXT_WITH_IMAGE/Slide3";
import { Slide4 } from "./slides/PROS_AND_CONS/Slide4";
import { Slide7 } from "./slides/SIX_POINTS/Slide7";
import { Slide6 } from "./slides/CHARTS/Slide6";
import { Slide5 } from "./slides/GRIDS/Slide5";

export const SLIDE_COMPONENTS: Record<string, Record<number, React.FC<any>>> = {
  "MAIN": {
    1: Slide1,
  },
  "TEXT_WITH_IMAGE": {
    3: Slide3,
  },
  "PROS_AND_CONS": {
    4: Slide4,
  },
  "IMAGE_GRID_5": {
    5: Slide5,
  },
  "TEXT_WITH_PIE_CHART": {
    6: Slide6,
  },
  "SIX_POINTS": {
    7: Slide7,
  }
};