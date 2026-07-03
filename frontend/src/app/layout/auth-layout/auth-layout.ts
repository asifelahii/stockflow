import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  Boxes,
  ChartNoAxesCombined,
  ClipboardList,
  LucideAngularModule,
  Package,
  TrendingUp,
  WalletCards
} from 'lucide-angular';

@Component({
  selector: 'app-auth-layout',
  imports: [LucideAngularModule, RouterLink, RouterOutlet],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss'
})
export class AuthLayoutComponent {
  protected readonly productsIcon = Boxes;
  protected readonly movementIcon = ClipboardList;
  protected readonly financeIcon = WalletCards;
  protected readonly packageIcon = Package;
  protected readonly trendIcon = TrendingUp;
  protected readonly chartIcon = ChartNoAxesCombined;
}
