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

export  const formatMdbDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  }).format(date);
};


export const formatNaira = (number) => {
  return number.toLocaleString('en-NG', {
    style: 'currency',
    currency: 'NGN',
  });
};

export const toSentenceCase = (text) => {
  return text.toLowerCase().charAt(0).toUpperCase() + text.slice(1);
};

// Helper function to get the start date based on the number of days
export const getStartDate = (days) => {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);
  return startDate.getTime();
};

// Helper function to get the end date
export const getEndDate = () => {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  return endDate.getTime();
};
