export const camelToSentenceCase = (str: string) => {
  const result = str.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export const formatCurrency = (amount: number) =>
  (Math.round(amount * 100) / 100).toFixed(2);
