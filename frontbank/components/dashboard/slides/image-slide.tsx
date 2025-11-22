import { Slide } from "@/services/types";

interface ImageSlideProps {
  slide: Slide;
}

export const ImageSlide: React.FC<ImageSlideProps> = ({ slide }) => {
  const textFields = slide.content.filter(field => field.type === 'TEXT');
  const imageFields = slide.content.filter(field => field.type === 'IMAGE');

  return (
    <div className="p-11 text-white w-[1104px] h-[621px] bg-[#222424] flex">
      <div className="flex-1 pr-4 flex flex-col">
        {textFields.map(field => (
            
          <div key={field.fieldId} className={field.key.includes('title') ? 'text-4xl font-bold mb-16' : 'text-lg'}>
            {field.value}
          </div>
        ))}
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        {imageFields.map(field => (
          <img 
            key={field.fieldId}
            src={field.image.url} 
            alt={field.value}
            className="max-w-full max-h-96 rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};