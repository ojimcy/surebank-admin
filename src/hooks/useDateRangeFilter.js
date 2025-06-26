import { useState, useCallback } from 'react';
import { formatDate } from 'utils/helper';

export const TIME_RANGES = [
  { value: 'all', label: 'All Time' },
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'custom', label: 'Custom Range' },
];

export function useDateRangeFilter() {
  const [timeRange, setTimeRange] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCustomDateModalOpen, setCustomDateModalOpen] = useState(false);
  const [customRangeLabel, setCustomRangeLabel] = useState('Custom Range');

  // Generate date range for predefined ranges
  const getDateRange = useCallback((range) => {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    switch (range) {
      case 'last7days':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'last30days':
        startDate.setDate(endDate.getDate() - 30);
        break;
      default:
        return null;
    }

    return { startDate: startDate.getTime(), endDate: endDate.getTime() };
  }, []);

  // Get current date range parameters for API calls
  const getDateRangeParams = useCallback(() => {
    const params = {};

    if (timeRange === 'custom' && startDate && endDate) {
      const customStartDate = new Date(startDate);
      customStartDate.setHours(0, 0, 0, 0);
      const customEndDate = new Date(endDate);
      customEndDate.setHours(23, 59, 59, 999);
      params.startDate = customStartDate.getTime();
      params.endDate = customEndDate.getTime();
    } else if (timeRange !== 'all') {
      const dateRange = getDateRange(timeRange);
      if (dateRange) {
        params.startDate = dateRange.startDate;
        params.endDate = dateRange.endDate;
      }
    }

    return params;
  }, [timeRange, startDate, endDate, getDateRange]);

  // Handle time range selection
  const handleSelectChange = useCallback((e) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'custom') {
      setCustomDateModalOpen(true);
    } else {
      setTimeRange(selectedValue);
    }
  }, []);

  // Handle custom date range application
  const handleCustomDateApply = useCallback(
    (selectedStartDate, selectedEndDate) => {
      if (selectedStartDate && selectedEndDate) {
        const formattedStartDate = formatDate(selectedStartDate);
        const formattedEndDate = formatDate(selectedEndDate);
        setCustomRangeLabel(`${formattedStartDate} to ${formattedEndDate}`);
        setStartDate(selectedStartDate);
        setEndDate(selectedEndDate);
        setTimeRange('custom');
      }
      setCustomDateModalOpen(false);
    },
    []
  );

  // Reset to default state
  const resetDateRange = useCallback(() => {
    setTimeRange('all');
    setStartDate('');
    setEndDate('');
    setCustomRangeLabel('Custom Range');
    setCustomDateModalOpen(false);
  }, []);

  return {
    // State
    timeRange,
    startDate,
    endDate,
    isCustomDateModalOpen,
    customRangeLabel,

    // Setters
    setStartDate,
    setEndDate,
    setCustomDateModalOpen,

    // Computed values
    dateRangeParams: getDateRangeParams(),

    // Event handlers
    handleSelectChange,
    handleCustomDateApply,
    resetDateRange,
  };
}
