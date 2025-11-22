import { Slide } from "@/services/types";

interface ImageSlideProps {
  slide: Slide;
}

export const ImageSlide: React.FC<ImageSlideProps> = ({ slide }) => {
  const textFields = slide.content.filter(field => field.type === 'TEXT');
  const imageFields = slide.content.filter(field => field.type === 'IMAGE');

  return (
    <div className="rounded-xl p-6 text-white w-[1104px] h-[621px] bg-purple-600 flex">
      {/* Текстовый блок */}
      <div className="flex-1 pr-4 flex flex-col justify-center">
        {textFields.map(field => (
          <div key={field.fieldId} className="text-xl mb-4">
            {field.value}
          </div>
        ))}
      </div>
      
      {/* Изображения */}
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