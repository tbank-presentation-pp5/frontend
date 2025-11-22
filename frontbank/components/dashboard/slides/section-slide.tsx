import { Slide } from "@/services/types";

interface SectionSlideProps {
  slide: Slide;
}

export const SectionSlide: React.FC<SectionSlideProps> = ({ slide }) => {
  return (
    <div className="text-white w-[1104px] h-[621px] bg-[#222424] flex items-center gap-16">
        <div className="w-[253px] h-[621px] bg-[#333333] rounded-br-[90px]">

        </div>
      {slide.content.map((field) => (
        <div key={field.fieldId} className="text-center mb-4">
          {field.type === 'TEXT' ? (
            <div className={field.key.includes('title') ? 'text-5xl font-bold' : 'text-lg'}>
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