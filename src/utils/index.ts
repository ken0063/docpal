export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString().slice(0, 10);
};
