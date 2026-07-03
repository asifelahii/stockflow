import { Component, Input } from '@angular/core';
import {
  DollarSign,
  LucideAngularModule,
  TrendingDown,
  TrendingUp
} from 'lucide-angular';

import { FinancialSummary } from '../../../core/models/finance.model';

@Component({
  selector: 'app-finance-summary',
  imports: [LucideAngularModule],
  templateUrl: './finance-summary.html',
  styleUrl: './finance-summary.scss'
})
export class FinanceSummaryComponent {
  @Input() summary: FinancialSummary | null = null;

  protected readonly incomeIcon = TrendingUp;
  protected readonly expenseIcon = TrendingDown;
  protected readonly balanceIcon = DollarSign;

  protected get totalIncome(): string | number {
    return this.summary?.total_income ?? 0;
  }

  protected get totalExpense(): string | number {
    return this.summary?.total_expense ?? 0;
  }

  protected get netBalance(): string | number {
    return this.summary?.net_balance ?? 0;
  }

  protected formatCurrency(value: string | number): string {
    return `\u09F3 ${Number(value ?? 0).toLocaleString('en-BD', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
  }
}
