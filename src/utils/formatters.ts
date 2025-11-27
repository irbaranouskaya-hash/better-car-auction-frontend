export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatVIN = (vin: string): string => {
  // Format VIN with spaces for readability: XXXXX XXXX XXXX XXX
  return vin.replace(/(.{5})(.{4})(.{4})(.{4})/, '$1 $2 $3 $4').trim();
};

export const formatOdometer = (value: number): string => {
  return `${formatNumber(value)} km`;
};

