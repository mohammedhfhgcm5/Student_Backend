export class ExpenseReportDto {
  summary: {
    totalDonations: number;
    totalExpenses: number;
    totalAllocated: number;
    remainingBalance: number;
    utilizationRate: number; // percentage
  };
  
  purposeSummary: Array<{
    purposeId: number;
    purposeName: string;
    totalDonations: number;
    totalExpenses: number;
    allocatedDonations: number;
    allocatedExpenses: number;
  }>;
  
  recentAllocations: any[];
}