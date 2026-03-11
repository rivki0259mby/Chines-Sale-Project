import { Component, inject, OnInit } from '@angular/core';
import { GiftService } from '../../../service/gift';
import { giftModel } from '../../../models/Gift.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

// ייבוא רכיבי NG-ZORRO
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { DonorSevice } from '../../../service/donor';
import { donorModel } from '../../../models/donor.model';
import { NzTooltipDirective } from "ng-zorro-antd/tooltip";
import { CategoryService } from '../../../service/category';

@Component({
  selector: 'app-get-gift-by-id',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzPageHeaderModule,
    NzButtonModule,
    NzIconModule,
    NzGridModule,
    NzCardModule,
    NzDividerModule,
    NzBadgeModule,
    NzBreadCrumbModule,
    NzTooltipDirective
],
  templateUrl: './get-gift-by-id.html',
  styleUrl: './get-gift-by-id.css',
})
export class GetGiftById implements OnInit {
  private route = inject(ActivatedRoute);
  private location = inject(Location); // לצורך כפתור החזרה
  private router = inject(Router);
  
 
  giftSrv: GiftService = inject(GiftService);
  donorSrv: DonorSevice = inject(DonorSevice);
  categorySrv: CategoryService = inject(CategoryService);
  drafgift: giftModel = {};
  giftId!: number;
  draftDonor: donorModel = {
    id: '',
    name: '',
    phoneNumber: '',
  };

  ngOnInit() {
    this.giftId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.giftId) {
      this.getById();
    }
  }

  getById() {
    this.giftSrv.getById(this.giftId).subscribe(gift => {
      this.drafgift = gift;
    });
  }

  // פונקציה לחזרה לדף הקודם
  goBack(): void {
    this.location.back();
  }

  // פונקציה להוספה לסל (תוכלי לחבר ללוגיקה שלך)
  addToCart(id?: number): void {
    if (id) {
      console.log('מתנה נוספה לסל:', id);
      // כאן תבוא הקריאה לסרוויס העגלה שלך
    }
  }
  getDonorName(donorId: string) {
     this.donorSrv.getById(donorId).subscribe(d => {
      return d ? d.name! : 'תורם אנונימי'; 
    }
  )}
  
}

