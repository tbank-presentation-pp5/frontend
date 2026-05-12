export const getFields = (content: any[]) => {
  return content.reduce((acc, field) => {
    acc[field.key] = {
      value: field.value,
      image: field.image,
      fieldId: field.fieldId
    };
    return acc;
  }, {} as Record<string, any>);
};