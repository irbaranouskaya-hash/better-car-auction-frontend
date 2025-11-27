export const calculateGradeColor = (grade: number): string => {
  if (grade >= 80) return '#22c55e'; // green
  if (grade >= 60) return '#3b82f6'; // blue
  if (grade >= 40) return '#f59e0b'; // orange
  return '#ef4444'; // red
};

export const getGradeLabel = (grade: number): string => {
  if (grade >= 80) return 'Excellent';
  if (grade >= 60) return 'Good';
  if (grade >= 40) return 'Fair';
  return 'Poor';
};

export const getPriceDifference = (msrp: number, optimizedPrice: number): {
  amount: number;
  percentage: number;
  isDiscount: boolean;
} => {
  const amount = msrp - optimizedPrice;
  const percentage = (amount / msrp) * 100;
  
  return {
    amount: Math.abs(amount),
    percentage: Math.abs(percentage),
    isDiscount: amount > 0,
  };
};

