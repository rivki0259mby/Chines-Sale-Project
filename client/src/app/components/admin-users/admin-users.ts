import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { AuthService } from '../../auth/auth-service';
import { BusketService } from '../../service/busket';
import { winnerModel } from '../../models/Winner.model';
import { busketModel } from '../../models/busket.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ButtonModule, NzCardModule, NzIconModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css'
})
export class AdminUsers implements OnInit {
  authSrv = inject(AuthService);
  basketSrv = inject(BusketService);

  usersWithPurchases: any[] = [];
  isLoading = true;
  baskets$ = this.basketSrv.getAll();

  
   
  ngOnInit() {  
    console.log(this.baskets$.subscribe((busket)=> console.log(busket)
    ));
    
  }
  getTotalSpent(purchases: busketModel[]): number {
    if (!purchases) return 0;
    return purchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  }
  

}
