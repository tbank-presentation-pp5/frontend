import { Slide } from "@/services/types";

interface MainSlideProps {
  slide: Slide;
}

export const MainSlide: React.FC<MainSlideProps> = ({ slide }) => {
  return (
    <div className="p-6 text-white w-[1104px] h-[621px] bg-[#333333] flex items-center">
      {slide.content.map((field) => (
        <div key={field.fieldId} className="text-center mb-4">
          {field.type === 'TEXT' ? (
            <div className={field.key === 'title' ? 'text-4xl font-bold' : 'text-xl'}>
              {field.value}
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