import React from 'react';
import ReportsBase from 'components/reports/ReportsBase';

export default function DsReports() {
  return (
    <ReportsBase
      title="DS Income"
      reportType="ds"
      endpoint="/reports/charges"
      totalEndpoint="/reports/contribution-incomes/ds/supperadmin"
      showReasonFilter={false}
    />
  );
}
