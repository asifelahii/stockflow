import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  Boxes,
  ChartNoAxesCombined,
  LucideAngularModule,
  ShieldCheck,
  WalletCards
} from 'lucide-angular';

@Component({
  selector: 'app-auth-layout',
  imports: [LucideAngularModule, RouterOutlet],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss'
})
export class AuthLayoutComponent {
  protected readonly inventoryIcon = Boxes;
  protected readonly movementIcon = ChartNoAxesCombined;
  protected readonly financeIcon = WalletCards;
  protected readonly secureIcon = ShieldCheck;
}
