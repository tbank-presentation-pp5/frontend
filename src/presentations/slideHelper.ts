export const getFields = (content: any[]) => {
  return content.reduce((acc, field) => {
    acc[field.key] = {
      value: field.value,
      image: field.image
    };
    return acc;
  }, {} as Record<string, any>);
};