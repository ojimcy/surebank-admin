export const formatDate = (timestamp) => {
  const date = new Date(parseInt(timestamp));
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

export const formatNaira = (number) => {
  return number.toLocaleString('en-NG', {
    style: 'currency',
    currency: 'NGN',
  });
};
