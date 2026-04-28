import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { Deck, FlexBox } from "spectacle";
import { GetPresentation } from "../requests";
import { SLIDE_COMPONENTS } from "./registry";

const theme = {
  colors: {
    primary: '#1d1d1b',
    secondary: '#ffdd2d',
    tertiary: '#ffffff',
  }
};

function PresentationViewer() {
  const { id } = useParams();
  const presId = Number(id);

  const { status, data } = useQuery({
    queryKey: ['presentation', presId],
    queryFn: () => GetPresentation(presId),
  });

  if (status === 'pending') return <FlexBox height="100vh">Загрузка...</FlexBox>;
  if (status === 'error' || !data) return <FlexBox height="100vh">Ошибка загрузки</FlexBox>;

  return (
    <Deck theme={theme}>
      {data.slides.map((slide: any) => {
        const SlideComponent = SLIDE_COMPONENTS[slide.type]?.[slide.templateSlideId];

        if (!SlideComponent) return null;

        return (
          <SlideComponent 
            key={slide.slideId} 
            slide={slide} 
            createdAt={data.createdAt}
            isViewer={true}
          />
        );
      })}
    </Deck>
  );
}

export default PresentationViewer;