import { useState, useEffect, useRef } from 'react';
import { useSlideField } from '@/hooks/useSlideField';

interface EditableTextFieldProps {
  field: {
    fieldId: number;
    value: string;
    type: string;
    key: string;
  };
  slideId: number;
  className?: string;
  placeholder?: string;
}

export const EditableTextField: React.FC<EditableTextFieldProps> = ({ 
  field, 
  slideId,
  className = '',
  placeholder = "Введите текст..."
}) => {
  const [value, setValue] = useSlideField(slideId, field.fieldId, field.value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Функция для автоматического изменения высоты
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Вызываем adjustHeight при изменении значения
  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  // Определяем минимальное количество строк
  const getMinRows = () => {
    if (field.key === 'title') return 1;
    if (field.key.includes('title')) return 1;
    return 2;
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      className={`
        w-full bg-transparent border-none resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded
        overflow-hidden ${className}
      `}
      rows={getMinRows()}
      placeholder={placeholder}
    />
  );
};