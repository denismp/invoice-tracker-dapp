export interface InvoiceRecordItem {
  clientName: string;
  invoiceNumber: number;
  netTerms: number;
  numberHours: number;
  amount: string;
  timesheetEndDate: string;
  invoiceSentDate: string;
  due30DaysDate: string;
  due60DaysDate: string;
  due90DaysDate: string;
  due120DaysDate: string;
  datePmtReceived: string;
}
