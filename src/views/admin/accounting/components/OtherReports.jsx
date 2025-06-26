import React from 'react';
import ReportsBase from 'components/reports/ReportsBase';

export default function OtherReports() {
  return (
    <ReportsBase
      title="Other Charges Income"
      reportType="others"
      endpoint="/reports/charges/others"
      totalEndpoint="/reports/contribution-incomes/others/supperadmin"
      showReasonFilter={true}
    />
  );
}
