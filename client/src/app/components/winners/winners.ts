import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';

import { GiftService } from '../../service/gift';
import { AuthService } from '../../auth/auth-service';
import { giftModel } from '../../models/Gift.model';

@Component({
  selector: 'app-winners',
  standalone: true,
  imports: [TableModule, CommonModule, NzIconModule, NzCardModule],
  templateUrl: './winners.html',
  styleUrl: './winners.css',
})
export class Winners implements OnInit {
  giftSrv = inject(GiftService);
  authSrv = inject(AuthService);
 
  gifts: giftModel[] = [];
  isLoading = true;

  ngOnInit() {
    this.giftSrv.getAll().subscribe({
      next: (allGifts) => {
        // סינון רק מתנות שהוגרלו
        this.gifts = allGifts.filter(g => g.isDrown === true);
       
        // השלמת פרטי זוכה במידה והאובייקט winner חסר
        this.gifts.forEach(gift => {
          if (gift.winnerId && !gift.winner) {
            this.authSrv.getById(gift.winnerId).subscribe({
              next: (user) => { gift.winner = user; },
              error: (err) => console.error('Error fetching winner:', err)
            });
          }
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading gifts:', err);
        this.isLoading = false;
      }
    });
  }
  getWInner(winnerId: string) {
    this.authSrv.getById(winnerId).subscribe({
      next: (user) => {
        console.log(user);
        
        return user;
      },
      error: (err) => {
        console.error('Error fetching winner:', err);
        return null;
      }
    });
  
    
  }
}