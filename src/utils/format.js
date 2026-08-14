export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return 'Rp0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount).replace(/,00$/, '');
};

export const formatPercentage = (value) => {
  if (value === undefined || value === null) return '0%';
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 2
  }).format(value) + '%';
};

export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '-';
  try {
    const defaultOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    let date;
    if (typeof dateString === 'string' && dateString.length === 10 && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-');
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      date = new Date(dateString);
    }
    
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('id-ID', { ...defaultOptions, ...options });
  } catch (error) {
    return dateString;
  }
};

export const formatChartDate = (dateStr) => {
  if (!dateStr) return '';
  // Handling "YYYY-MM"
  if (dateStr.length === 7) {
    const [year, month] = dateStr.split('-');
    const date = new Date(year, parseInt(month) - 1, 1);
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  }
  // Handling "YYYY-MM-DD"
  if (dateStr.length === 10 && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' });
  }
  return dateStr;
};
