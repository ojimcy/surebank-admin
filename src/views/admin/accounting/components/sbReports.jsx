import React from 'react';
import ReportsBase from 'components/reports/ReportsBase';

export default function SbReports() {
  return (
    <ReportsBase
      title="SB Income"
      reportType="sb"
      endpoint="/reports/charges"
      totalEndpoint="/reports/contribution-incomes/sb/supperadmin"
      showReasonFilter={false}
    />
  );
}
