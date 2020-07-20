export interface InvoiceListItem {
   clientName: string;
   invoiceNumber: number;
   netTerms: number;
   numberHours: number;
   amount: string;
   timesheetEndDate: number;
   rTimesheetEndDate: Date;
   sTimesheetEndDate: string;
   invoiceSentDate: number;
   due30DaysDate: number;
   due60DaysDate: number;
   due90DaysDate: number;
   due120DaysDate: number;
   datePmtReceived: number;
   rDatePmtReceived: Date;
   sDatePmtReceived: string;
}
